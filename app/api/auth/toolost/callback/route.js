// app/api/auth/toolost/callback/route.js
// Handles the OAuth 2.0 callback from Too Lost.
// Validates the state parameter (CSRF), exchanges the authorization code
// for tokens server-side, stores everything in an encrypted httpOnly cookie,
// and redirects to /dashboard.

import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const REDIRECT_URI = 'https://dashboard.souldistribution.in/api/auth/toolost/callback';
const TOKEN_URL = 'https://toolost.com/oauth/token';
const ME_URL = 'https://api.toolost.com/v1/me';
const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // ── Handle provider errors ───────────────────────────────────────
  if (error) {
    console.error('[OAuth Callback] Provider returned error:', error, errorDescription);
    return Response.redirect(
      `${appUrl}/?error=${encodeURIComponent(error + ': ' + (errorDescription || ''))}`
    );
  }

  if (!code) {
    console.error('[OAuth Callback] No authorization code in request');
    return Response.redirect(`${appUrl}/?error=Missing+authorization+code`);
  }

  // ── (a–c) Validate state (CSRF protection) ──────────────────────
  const session = await getSession();
  const savedState = session.oauth?.state;
  const stateCreatedAt = session.oauth?.created_at;

  if (!savedState || state !== savedState) {
    console.error('[OAuth Callback] State mismatch — possible CSRF attack');
    return Response.redirect(`${appUrl}/?error=State+mismatch+CSRF+detected`);
  }

  // Reject if the state cookie is older than 10 minutes
  if (stateCreatedAt && Date.now() - stateCreatedAt > STATE_MAX_AGE_MS) {
    console.error('[OAuth Callback] State expired (>10 min)');
    delete session.oauth;
    await session.save();
    return Response.redirect(`${appUrl}/?error=Login+session+expired.+Please+try+again.`);
  }

  try {
    // ── (d) Clear the state immediately after validation ──────────
    delete session.oauth;

    // ── (e) Exchange authorization code for tokens (server-side) ──
    const clientId = process.env.TOOLOST_CLIENT_ID;
    const clientSecret = process.env.TOOLOST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing TOOLOST_CLIENT_ID or TOOLOST_CLIENT_SECRET env vars');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    // ── (f) Parse the token response ─────────────────────────────
    const rawBody = await tokenResponse.text();

    let tokenData;
    try {
      tokenData = JSON.parse(rawBody);
    } catch {
      console.error('[OAuth Callback] Token response is not JSON:', rawBody.slice(0, 300));
      return Response.redirect(
        `${appUrl}/?error=${encodeURIComponent(
          `Token server returned non-JSON (HTTP ${tokenResponse.status})`
        )}`
      );
    }

    if (!tokenResponse.ok) {
      console.error('[OAuth Callback] Token exchange failed:', tokenData);
      return Response.redirect(
        `${appUrl}/?error=${encodeURIComponent(
          tokenData.error_description || tokenData.message || tokenData.error || 'Token exchange failed'
        )}`
      );
    }

    console.log(
      '[OAuth Callback] Token exchange success. Type:',
      tokenData.token_type,
      'Expires in:',
      tokenData.expires_in
    );

    // ── (g) Store tokens in encrypted httpOnly session cookie ─────
    session.tokens = {
      token_type: tokenData.token_type,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      obtained_at: Date.now(),
    };

    // Also fetch and cache the user profile while we have a fresh token
    try {
      const meResponse = await fetch(ME_URL, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      });

      if (meResponse.ok) {
        const meData = await meResponse.json();
        session.user = meData.data;
        console.log('[OAuth Callback] User profile cached:', meData.data?.email);
      } else {
        console.warn('[OAuth Callback] /me fetch failed:', meResponse.status);
      }
    } catch (meErr) {
      console.warn('[OAuth Callback] /me fetch error (non-blocking):', meErr.message);
    }

    await session.save();

    // ── (h) Redirect to /dashboard ───────────────────────────────
    console.log('[OAuth Callback] Session saved. Redirecting to /dashboard.');
    return Response.redirect(`${appUrl}/dashboard`);
  } catch (err) {
    console.error('[OAuth Callback] Unhandled error:', err);
    return Response.redirect(
      `${appUrl}/?error=${encodeURIComponent(err.message)}`
    );
  }
}
