// app/api/auth/toolost/login/route.js
// Initiates the Too Lost OAuth 2.0 Authorization Code flow.
// Generates a cryptographic state param, stores it in the iron-session cookie,
// and redirects the user to Too Lost's authorization endpoint.

import crypto from 'crypto';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();

  // (a) Generate a cryptographically random state string (CSRF protection)
  const state = crypto.randomUUID();

  // (b) Persist state in the encrypted iron-session cookie
  session.oauth = { state, created_at: Date.now() };
  await session.save();

  // (c) Build the authorization URL
  const clientId = process.env.TOOLOST_CLIENT_ID;
  const redirectUri = 'https://dashboard.souldistribution.in/api/auth/toolost/callback';

  if (!clientId) {
    return new Response('Missing TOOLOST_CLIENT_ID environment variable', { status: 500 });
  }

  const scopes = [
    'read:profile',
    'read:catalog',
    'read:analytics',
    'read:earnings',
    'read:audience',
    'write:releases',
  ].join(' ');

  const authUrl = new URL('https://toolost.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', state);

  // (d) Redirect the user to Too Lost for authorization
  return Response.redirect(authUrl.toString());
}
