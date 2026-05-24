// app/api/toolost/me/route.js
// Proxies GET https://api.toolost.com/v1/me through the server.
// The browser never sees the access_token — it's injected server-side
// from the encrypted session cookie.

import { fetchTooLost } from '@/lib/toolost';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetchTooLost('/me');

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { message: errorText || 'Failed to fetch profile' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('[/api/toolost/me] Error:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
