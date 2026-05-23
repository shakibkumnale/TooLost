import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();
  session.destroy();
  return Response.json({ success: true });
}

export async function GET(request) {
  const session = await getSession();
  session.destroy();
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`);
}
