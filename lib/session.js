import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'a_very_long_secure_session_secret_32_characters_long_minimum',
  cookieName: 'toolost_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

export async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions);
  return session;
}
