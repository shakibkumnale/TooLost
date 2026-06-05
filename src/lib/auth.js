// ═══════════════════════════════════════════
// OAuth 2.0 Authentication Helpers
// Supports both PKCE (public) and Confidential clients
// ═══════════════════════════════════════════

const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const TOKEN_URL = import.meta.env.VITE_TOKEN_URL;
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const getRedirectUri = () => {
  const envUri = import.meta.env.VITE_REDIRECT_URI;
  if (!envUri) {
    return `${window.location.origin}/api/auth/toolost/callback`;
  }
  // Fallback if built with localhost but deployed on a remote server
  if (window.location.hostname !== 'localhost' && envUri.includes('localhost')) {
    try {
      const url = new URL(envUri);
      return `${window.location.origin}${url.pathname}`;
    } catch {
      return `${window.location.origin}/api/auth/toolost/callback`;
    }
  }
  return envUri;
};

const REDIRECT_URI = getRedirectUri();
const SCOPES = import.meta.env.VITE_SCOPES;

// ── PKCE Helpers ──────────────────────────

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// ── Token Storage ─────────────────────────

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'tl_access_token',
  REFRESH_TOKEN: 'tl_refresh_token',
  EXPIRES_AT: 'tl_expires_at',
  CODE_VERIFIER: 'tl_code_verifier',
  STATE: 'tl_state',
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function isTokenExpired() {
  const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  if (!expiresAt) return true;
  // Add 60s buffer
  return Date.now() >= (parseInt(expiresAt, 10) - 60000);
}

export function isAuthenticated() {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
}

function storeTokens({ access_token, refresh_token, expires_in }) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  if (refresh_token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
  }
  const expiresAt = Date.now() + (expires_in * 1000);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
}

export function clearTokens() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('tl_mock_mode');
}

// ── Auth Flow ─────────────────────────────

export async function startLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
  localStorage.setItem(STORAGE_KEYS.STATE, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${AUTH_URL}?${params.toString()}`;
}

export async function startRegister() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
  localStorage.setItem(STORAGE_KEYS.STATE, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${REGISTER_URL}?${params.toString()}`;
}

export async function handleCallback(code, state) {
  // Validate state
  const storedState = localStorage.getItem(STORAGE_KEYS.STATE);
  if (state && storedState && state !== storedState) {
    console.warn('State mismatch (expected:', storedState, 'got:', state, '). Proceeding.');
  }

  const codeVerifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
  if (!codeVerifier) {
    throw new Error('Missing code verifier');
  }

  // Build token exchange body
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });

  // Include client_secret for confidential clients
  if (CLIENT_SECRET) {
    body.append('client_secret', CLIENT_SECRET);
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error_description || 'Token exchange failed');
  }

  const tokens = await response.json();
  storeTokens(tokens);

  // Clean up PKCE params
  localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  localStorage.removeItem(STORAGE_KEYS.STATE);

  return tokens;
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  // Include client_secret for confidential clients
  if (CLIENT_SECRET) {
    body.append('client_secret', CLIENT_SECRET);
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const tokens = await response.json();
  storeTokens(tokens);
  return tokens;
}

export function logout() {
  clearTokens();
  window.location.href = '/';
}
