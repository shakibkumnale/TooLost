import { getSession } from '@/lib/session';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const session = await getSession();

  if (error) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(error + ': ' + (errorDescription || ''))}`);
  }

  if (!code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=Missing+authorization+code`);
  }

  // Validate state
  const savedState = session.oauth?.state;
  const verifier = session.oauth?.code_verifier;

  if (!savedState || state !== savedState) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=State+mismatch+CSRF+detected`);
  }

  try {
    const tokenUrl = 'https://toolost.com/oauth/token';
    const clientId = process.env.TOOLOST_CLIENT_ID?.trim();
    const clientSecret = process.env.TOOLOST_CLIENT_SECRET?.trim();
    const redirectUri = 'https://dashboard.souldistribution.in/api/auth/toolost/callback';

    if (!clientId || !redirectUri) {
      throw new Error('Missing OAuth configuration: CLIENT_ID and REDIRECT_URI must be set');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
      code_verifier: verifier
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const tokenData = await response.json();

    if (!response.ok) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(tokenData.error_description || tokenData.error || 'Token exchange failed')}`);
    }

    // Save tokens in session
    session.tokens = tokenData;

    // Fetch user profile to cache basic details
    const meResponse = await fetch('https://api.toolost.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (meResponse.ok) {
      const meData = await meResponse.json();
      session.user = meData.data;
    }

    // Clear OAuth state from session
    delete session.oauth;
    await session.save();

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (err) {
    console.error('Callback error:', err);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(err.message)}`);
  }
}
