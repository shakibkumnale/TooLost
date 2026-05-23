import crypto from 'crypto';
import { getSession } from '@/lib/session';

function base64UrlEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function GET(request) {
  const session = await getSession();

  // Generate random state for CSRF protection
  const state = base64UrlEncode(crypto.randomBytes(16));

  // Save state in session (no PKCE for confidential clients)
  session.oauth = { state };
  await session.save();

  const clientId = 'a1d45991-036b-4de2-b7bd-f0e1e60a33df';
  const redirectUri = 'https://dashboard.souldistribution.in/api/auth/toolost/callback';

  const scopes = [
    'read:profile',
    'read:catalog',
    'read:analytics',
    'read:earnings',
    'read:audience',
    'write:releases'
  ].join(' ');

  const authUrl = new URL('https://toolost.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', state);
  // No code_challenge / code_challenge_method — confidential client uses client_secret

  return Response.redirect(authUrl.toString());
}
