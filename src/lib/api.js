// ═══════════════════════════════════════════
// API Client with Token Auto-Refresh
// ═══════════════════════════════════════════

import { getAccessToken, isTokenExpired, refreshAccessToken, clearTokens } from './auth';
import { mockDb } from './mockDb';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  constructor(status, data) {
    super(data?.message || `API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeToRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshComplete(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function ensureValidToken() {
  if (localStorage.getItem('tl_mock_mode') === 'true') {
    return 'mock_token';
  }
  if (!isTokenExpired()) return getAccessToken();

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeToRefresh((token) => resolve(token));
    });
  }

  isRefreshing = true;
  try {
    const tokens = await refreshAccessToken();
    isRefreshing = false;
    onRefreshComplete(tokens.access_token);
    return tokens.access_token;
  } catch (err) {
    isRefreshing = false;
    clearTokens();
    window.location.href = '/';
    throw err;
  }
}

export async function apiRequest(endpoint, options = {}) {
  if (localStorage.getItem('tl_mock_mode') === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const { body, method = 'GET', params } = options;
    try {
      return mockDb.handleRequest(method, endpoint, body, params);
    } catch (err) {
      if (err.status) {
        throw new ApiError(err.status, { message: err.message });
      }
      throw err;
    }
  }

  const token = await ensureValidToken();

  const { body, method = 'GET', params, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...rest.headers,
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    ...rest,
  });

  if (response.status === 401) {
    // Token expired — try refresh once
    try {
      const tokens = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${tokens.access_token}`;
      const retryResponse = await fetch(url, {
        method,
        headers,
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      });
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new ApiError(retryResponse.status, errorData);
      }
      return retryResponse.json();
    } catch {
      clearTokens();
      window.location.href = '/';
      throw new ApiError(401, { message: 'Session expired' });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// Convenience methods
export const api = {
  get: (endpoint, params) => apiRequest(endpoint, { method: 'GET', params }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export { ApiError };
export default api;
