import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();

  if (!session.tokens?.refresh_token) {
    return Response.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: session.tokens.refresh_token,
    });

    const response = await fetch('https://toolost.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ message: data.error_description || 'Refresh failed' }, { status: 401 });
    }

    session.tokens = { ...session.tokens, ...data };
    await session.save();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
