// Centralized token management for Platform Gold API
// This prevents multiple simultaneous login requests across different API routes

const API_BASE_URL = 'https://api.platform.gold/public/v2';

// Shared token cache across all API routes
let cachedToken: string | null = null;
let tokenExpiry: number = 0;
let loginInProgress: Promise<string> | null = null;

/**
 * Get a valid auth token, reusing cached token when possible
 * If multiple requests come in simultaneously, they all wait for the same login request
 */
export async function getAuthToken(): Promise<string> {
  // Return valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // If login is already in progress, wait for it
  if (loginInProgress) {
    console.log('⏳ Waiting for existing login request...');
    return await loginInProgress;
  }

  // Start new login request
  loginInProgress = performLogin();

  try {
    const token = await loginInProgress;
    return token;
  } finally {
    loginInProgress = null;
  }
}

/**
 * Clear the cached token (used when getting 401 errors)
 */
export function clearToken() {
  cachedToken = null;
  tokenExpiry = 0;
}

/**
 * Perform the actual login request
 */
async function performLogin(): Promise<string> {
  const email = process.env.PLATFORM_GOLD_EMAIL;
  const password = process.env.PLATFORM_GOLD_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing PLATFORM_GOLD_EMAIL or PLATFORM_GOLD_PASSWORD in environment variables');
  }

  console.log('🔐 Logging in to Platform Gold API...');

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login failed:', response.status, errorText);
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.token || typeof data.token !== 'string') {
    throw new Error('No token received from Platform Gold API');
  }
  
  cachedToken = data.token;
  
  // Token expires in 24 hours, but we'll refresh after 23 hours to be safe
  tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
  
  console.log('✅ Successfully logged in to Platform Gold API');
  
  return data.token;
}

/**
 * Utility to handle 401 errors and retry with a fresh token
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  // Handle 401 - token expired, retry once with fresh token
  if (response.status === 401) {
    console.log('⚠️ Token expired, refreshing and retrying...');
    clearToken();
    
    const newToken = await getAuthToken();
    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Authorization': `Bearer ${newToken}`,
      },
    });
    
    return retryResponse;
  }

  return response;
}

