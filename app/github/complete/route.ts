import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { loginSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const accessTokenParams = new URLSearchParams([
    ['client_id', process.env.GITHUB_CLIENT_ID!],
    ['client_secret', process.env.GITHUB_CLIENT_SECRET!],
    ['code', code],
  ]).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });
  const { login, id, avatar_url } = await userProfileResponse.json();

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
  const newUser = await db.user.create({
    data: {
      github_id: id + '',
      username: `${sameUsernameUser ? login + '-github' : login}`,
      avatar: avatar_url,
    },
    select: { id: true },
  });
  await loginSession(newUser.id);
  return redirect('/profile');
}
