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

  // Generate PKCE values
  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(
    crypto.createHash('sha256').update(verifier).digest()
  );
  
  // Generate random state for CSRF protection
  const state = base64UrlEncode(crypto.randomBytes(16));

  // Save PKCE and state inside the encrypted cookie session
  session.oauth = {
    code_verifier: verifier,
    state: state
  };
  await session.save();

  const clientId = process.env.CLIENT_ID?.trim();
  const redirectUri = process.env.REDIRECT_URI?.trim();
  
  if (!clientId || !redirectUri) {
    throw new Error('Missing OAuth configuration: CLIENT_ID and REDIRECT_URI must be set');
  }
  
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
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  return Response.redirect(authUrl.toString());
}
