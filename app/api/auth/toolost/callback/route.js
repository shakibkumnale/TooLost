import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  console.log('[OAuth Callback] Received callback', {
    hasCode: !!code,
    hasState: !!state,
    error,
    errorDescription,
  });

  const session = await getSession();

  if (error) {
    console.error('[OAuth Callback] Provider returned error:', error, errorDescription);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(error + ': ' + (errorDescription || ''))}`
    );
  }

  if (!code) {
    console.error('[OAuth Callback] No authorization code in request');
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=Missing+authorization+code`);
  }

  // Validate state (CSRF protection)
  const savedState = session.oauth?.state;
  const verifier = session.oauth?.code_verifier;

  console.log('[OAuth Callback] State check:', {
    receivedState: state,
    savedState,
    hasVerifier: !!verifier,
  });

  if (!savedState || state !== savedState) {
    console.error('[OAuth Callback] State mismatch — possible CSRF attack');
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=State+mismatch+CSRF+detected`);
  }

  try {
    const tokenUrl = 'https://toolost.com/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code: code,
      code_verifier: verifier,
    });

    console.log('[OAuth Callback] Exchanging code at:', tokenUrl);
    console.log('[OAuth Callback] Token request params (no secret):', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      has_code: !!code,
      has_verifier: !!verifier,
      has_secret: !!process.env.CLIENT_SECRET,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    // Read raw text first — never assume JSON
    const rawBody = await response.text();

    console.log('[OAuth Callback] Token response status:', response.status, response.statusText);
    console.log('[OAuth Callback] Token response headers:', Object.fromEntries(response.headers.entries()));
    console.log('[OAuth Callback] Token response raw body:', rawBody.substring(0, 500));

    // Try to parse as JSON
    let tokenData;
    try {
      tokenData = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error('[OAuth Callback] Response is not JSON. Full body:', rawBody);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(
          `Token server returned non-JSON (HTTP ${response.status}): ${rawBody.substring(0, 200)}`
        )}`
      );
    }

    if (!response.ok) {
      console.error('[OAuth Callback] Token exchange failed:', tokenData);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(
          tokenData.error_description || tokenData.message || tokenData.error || 'Token exchange failed'
        )}`
      );
    }

    console.log('[OAuth Callback] Token exchange success. Token type:', tokenData.token_type, 'Expires in:', tokenData.expires_in);

    // Store tokens in encrypted session
    session.tokens = tokenData;

    // Fetch + cache user profile
    const meResponse = await fetch('https://api.toolost.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    console.log('[OAuth Callback] /me response status:', meResponse.status);

    if (meResponse.ok) {
      const meData = await meResponse.json();
      session.user = meData.data;
      console.log('[OAuth Callback] User profile loaded:', meData.data?.email);
    } else {
      const meError = await meResponse.text();
      console.warn('[OAuth Callback] Failed to fetch user profile:', meResponse.status, meError);
    }

    // Clear OAuth PKCE state
    delete session.oauth;
    await session.save();

    console.log('[OAuth Callback] Session saved. Redirecting to dashboard.');
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (err) {
    console.error('[OAuth Callback] Unhandled error:', err);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(err.message)}`
    );
  }
}
