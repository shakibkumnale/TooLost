// app/api/auth/toolost/callback/route.js
// Handles the OAuth 2.0 callback from Too Lost.
// Validates the state parameter (CSRF), exchanges the authorization code
// for tokens server-side, stores everything in an encrypted httpOnly cookie,
// and redirects to /dashboard.

import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// FIX 4 — redirect_uri must be character-for-character identical to the value
// registered in the Too Lost Developer Portal: no trailing slash, no http,
// no query params. Defined as a single constant so it can never drift.
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

  // ── Validate state (CSRF protection) ─────────────────────────────
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
    // ── Clear state immediately after validation ──────────────────
    delete session.oauth;

    const clientId = process.env.TOOLOST_CLIENT_ID;
    const clientSecret = process.env.TOOLOST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing TOOLOST_CLIENT_ID or TOOLOST_CLIENT_SECRET env vars');
    }

    // FIX 1 — Body MUST be application/x-www-form-urlencoded, not JSON.
    // URLSearchParams.toString() produces the correct encoded body string.
    // Previously the Accept header was present but User-Agent was missing,
    // which caused Cloudflare to classify the request as a bot and return 403.
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      code,
    }).toString();

    // FIX 2 — Add User-Agent and Accept headers.
    // Cloudflare/WAF blocks requests that look like automated scripts.
    // A recognisable User-Agent and explicit Accept header bypass the block.
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'SoulDistribution/1.0',
      },
      body,
    });

    // FIX 3 — Detailed diagnostic logging BEFORE attempting JSON.parse.
    // Previously we only logged the body on parse failure.
    // Now we always log status + cf-ray + first 600 chars so the exact
    // WAF rejection reason is visible in server logs on every failed attempt.
    const rawText = await tokenResponse.text();

    console.log('[TooLost token] status :', tokenResponse.status, tokenResponse.statusText);
    console.log('[TooLost token] cf-ray  :', tokenResponse.headers.get('cf-ray') ?? 'n/a');
    console.log('[TooLost token] content :', tokenResponse.headers.get('content-type') ?? 'n/a');
    console.log('[TooLost token] body    :', rawText.slice(0, 600));

    // Guard: if the response is not JSON (e.g. a Cloudflare HTML block page),
    // redirect with a specific error code so it's easy to diagnose in logs.
    if (!tokenResponse.ok || !rawText.trimStart().startsWith('{')) {
      console.error('[OAuth Callback] Token exchange failed — non-JSON or error response');
      return Response.redirect(
        `${appUrl}/?error=${encodeURIComponent(`token_failed_${tokenResponse.status}`)}`
      );
    }

    const tokenData = JSON.parse(rawText);

    if (!tokenData.access_token) {
      console.error('[OAuth Callback] Token response missing access_token:', tokenData);
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

    // ── Store tokens in encrypted httpOnly session cookie ─────────
    session.tokens = {
      token_type: tokenData.token_type,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      obtained_at: Date.now(),
    };

    // Fetch and cache the user profile while we have a fresh token (non-blocking)
    try {
      const meResponse = await fetch(ME_URL, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
          'User-Agent': 'SoulDistribution/1.0',
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

    // ── Redirect to /dashboard ────────────────────────────────────
    console.log('[OAuth Callback] Session saved. Redirecting to /dashboard.');
    return Response.redirect(`${appUrl}/dashboard`);
  } catch (err) {
    console.error('[OAuth Callback] Unhandled error:', err);
    return Response.redirect(
      `${appUrl}/?error=${encodeURIComponent(err.message)}`
    );
  }
}
