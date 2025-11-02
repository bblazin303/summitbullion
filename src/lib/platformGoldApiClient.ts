/**
 * Platform Gold API Client (Server-side)
 * Axios-based HTTP client for direct Platform Gold API calls
 */

import axios, { AxiosInstance } from 'axios';

// Create axios instance for Platform Gold API
let platformGoldApiInstance: AxiosInstance | null = null;
let authToken: string | null = null;

/**
 * Get or create Platform Gold API axios instance
 */
export async function getPlatformGoldApi(): Promise<AxiosInstance> {
  // Return existing instance if we have a valid token
  if (platformGoldApiInstance && authToken) {
    return platformGoldApiInstance;
  }

  // Check for required environment variables
  const apiUrl = process.env.PLATFORM_GOLD_API_URL;
  const email = process.env.PLATFORM_GOLD_EMAIL;
  const password = process.env.PLATFORM_GOLD_PASSWORD;

  if (!apiUrl || !email || !password) {
    throw new Error(
      'Platform Gold API credentials not configured. Please set PLATFORM_GOLD_API_URL, PLATFORM_GOLD_EMAIL, and PLATFORM_GOLD_PASSWORD in .env.local'
    );
  }

  // Login to get auth token
  try {
    const loginResponse = await axios.post(`${apiUrl}/login`, {
      email,
      password,
    });

    authToken = loginResponse.data.token;

    if (!authToken) {
      throw new Error('No token received from Platform Gold API');
    }

    // Create axios instance with auth token
    platformGoldApiInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('✅ Platform Gold API client initialized');

    return platformGoldApiInstance;
  } catch (error: any) {
    console.error('❌ Failed to initialize Platform Gold API client:', error.message);
    throw new Error(`Platform Gold API authentication failed: ${error.message}`);
  }
}

/**
 * Reset the API client (useful for testing or when token expires)
 */
export function resetPlatformGoldApi() {
  platformGoldApiInstance = null;
  authToken = null;
}

/**
 * Export the API instance getter as the main export
 */
export const platformGoldApi = {
  async get(url: string, config?: any) {
    const api = await getPlatformGoldApi();
    return api.get(url, config);
  },
  async post(url: string, data?: any, config?: any) {
    const api = await getPlatformGoldApi();
    return api.post(url, data, config);
  },
  async put(url: string, data?: any, config?: any) {
    const api = await getPlatformGoldApi();
    return api.put(url, data, config);
  },
  async delete(url: string, config?: any) {
    const api = await getPlatformGoldApi();
    return api.delete(url, config);
  },
};

