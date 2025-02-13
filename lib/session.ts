import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: 'yummy-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function loginSession(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
}
