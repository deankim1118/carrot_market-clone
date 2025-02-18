import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { loginSession } from '@/lib/session';
import {
  accssTokenGithub,
  getUserProfileGithub,
  getUserEmailGithub,
} from '@/lib/github/githubAuth';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await accssTokenGithub(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { login, id, avatar_url } = await getUserProfileGithub(access_token);

  const { email } = await getUserEmailGithub(access_token);

  const user = await db.user.findUnique({
    where: { github_id: id + '' },
    select: { id: true },
  });
  if (user) {
    await loginSession(user.id);
    return redirect('/profile');
  }

  // Check if GitHub's username is already exists in Database
  const sameUsernameUser = await db.user.findUnique({
    where: { username: login },
    select: { id: true },
  });

  const sameEmailUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  console.log('Got sameEmailUser');

  // Create a new user if GitHub's username is not exists in Database
  const newUser = await db.user.create({
    data: {
      github_id: id + '',
      username: sameUsernameUser ? `${login}-github` : login,
      avatar: avatar_url,
      email: sameEmailUser ? null : email,
    },
    select: { id: true },
  });
  console.log('Got newUser');

  await loginSession(newUser.id);
  return redirect('/profile');
}
