import { getSession } from '@/lib/session';

export async function GET(request) {
  const session = await getSession();

  if (!session.tokens || !session.tokens.access_token) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({
    authenticated: true,
    user: session.user || null,
  });
}
