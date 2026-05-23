import { getSession } from './session';

const BASE_URL = 'https://api.toolost.com/v1';

async function refreshAccessToken(refreshToken) {
  const tokenUrl = 'https://toolost.com/oauth/token';
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: refreshToken
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || errorData.error || 'Failed to refresh access token');
  }

  return await response.json();
}

export async function fetchTooLost(path, options = {}) {
  const session = await getSession();
  
  if (!session.tokens || !session.tokens.access_token) {
    return new Response(JSON.stringify({ message: 'Unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${session.tokens.access_token}`,
    ...options.headers,
  };

  const fetchOptions = { ...options };

  if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  fetchOptions.headers = headers;

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && session.tokens.refresh_token) {
    try {
      console.log('Token expired (401). Attempting refresh...');
      const newTokens = await refreshAccessToken(session.tokens.refresh_token);
      
      // Update session
      session.tokens = {
        ...session.tokens,
        ...newTokens
      };
      await session.save();

      // Retry request with new token
      headers['Authorization'] = `Bearer ${newTokens.access_token}`;
      fetchOptions.headers = headers;
      response = await fetch(url, fetchOptions);
    } catch (err) {
      console.error('Failed auto-refreshing token:', err);
      // Return 401 directly if refresh fails so middleware can handle logout redirection
      return new Response(JSON.stringify({ message: 'Unauthenticated (Session Expired)' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return response;
}
