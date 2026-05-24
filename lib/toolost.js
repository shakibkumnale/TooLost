// lib/toolost.js
// Server-side utilities for the Too Lost OAuth integration.
// - getToolostSession(request): extracts tokens from the encrypted session cookie
// - fetchTooLost(path, options): authenticated API client with auto-refresh

import { getSession } from './session';

const BASE_URL = 'https://api.toolost.com/v1';
const TOKEN_URL = 'https://toolost.com/oauth/token';

/**
 * Retrieves the current Too Lost session from the encrypted cookie.
 * @returns {{ access_token: string, refresh_token: string, token_type: string, expires_in: number, obtained_at: number } | null}
 */
export async function getToolostSession() {
  const session = await getSession();

  if (!session.tokens?.access_token) {
    return null;
  }

  return {
    access_token: session.tokens.access_token,
    refresh_token: session.tokens.refresh_token,
    token_type: session.tokens.token_type,
    expires_in: session.tokens.expires_in,
    obtained_at: session.tokens.obtained_at,
  };
}

/**
 * Attempts to refresh the access token using the stored refresh_token.
 * Updates the session cookie on success.
 * @returns {object} New token data from Too Lost
 * @throws {Error} If refresh fails
 */
async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.TOOLOST_CLIENT_ID,
    client_secret: process.env.TOOLOST_CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'SoulDistribution/1.0',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error_description || errorData.error || 'Failed to refresh access token'
    );
  }

  return await response.json();
}

/**
 * Authenticated fetch wrapper for the Too Lost API.
 * Automatically includes the Bearer token and handles 401 refresh flows.
 *
 * @param {string} path - API path (e.g. "/me", "/releases")
 * @param {RequestInit} options - Standard fetch options (method, body, headers, etc.)
 * @returns {Response} The fetch Response object
 */
export async function fetchTooLost(path, options = {}) {
  const session = await getSession();

  if (!session.tokens?.access_token) {
    return new Response(JSON.stringify({ message: 'Unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'SoulDistribution/1.0',
    'Authorization': `Bearer ${session.tokens.access_token}`,
    ...options.headers,
  };

  const fetchOptions = { ...options };

  // Auto-serialize plain objects to JSON
  if (
    fetchOptions.body &&
    typeof fetchOptions.body === 'object' &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  fetchOptions.headers = headers;

  let response = await fetch(url, fetchOptions);

  // If 401 and we have a refresh token, attempt a transparent refresh
  if (response.status === 401 && session.tokens.refresh_token) {
    try {
      console.log('[fetchTooLost] 401 received — attempting token refresh');
      const newTokens = await refreshAccessToken(session.tokens.refresh_token);

      // Update the session with new tokens
      session.tokens = {
        ...session.tokens,
        ...newTokens,
        obtained_at: Date.now(),
      };
      await session.save();

      // Retry the original request with the new access token
      fetchOptions.headers.Authorization = `Bearer ${newTokens.access_token}`;
      response = await fetch(url, fetchOptions);
    } catch (err) {
      console.error('[fetchTooLost] Token refresh failed:', err.message);
      return new Response(
        JSON.stringify({ message: 'Session expired. Please log in again.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return response;
}
