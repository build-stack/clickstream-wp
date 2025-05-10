/**
 * API client for WordPress REST API
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// API base URL
const apiUrl = isDevelopment 
  ? '/wp-json/clickstream-wp/v1' // Development (proxied by Vite)
  : (window.clickstreamWPAdmin?.apiUrl || '/wp-json/clickstream-wp/v1'); // Production

// Get WordPress admin settings for production
const wpSettings = window.clickstreamWPAdmin || {
  apiNonce: '',
  currentPage: 'dashboard',
  pluginUrl: ''
};

/**
 * Makes a GET request to the WordPress REST API
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add nonce in production
  if (!isDevelopment && wpSettings.apiNonce) {
    headers['X-WP-Nonce'] = wpSettings.apiNonce;
  }
  
  console.log(`Fetching from: ${apiUrl}${endpoint}`);
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    headers,
    credentials: 'include'
  });

  if (!response.ok) {
    const message = `API request failed: ${response.status} ${response.statusText}`;
    console.error(message);
    
    // Try to parse error response as JSON
    try {
      const errorData = await response.json();
      console.error('API Error:', errorData);
    } catch (e) {
      // If parsing fails, continue with the original error
    }
    
    throw new Error(message);
  }

  return response.json();
}

/**
 * Makes a POST request to the WordPress REST API
 */
export async function postApi<T>(endpoint: string, data: any): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add nonce in production
  if (!isDevelopment && wpSettings.apiNonce) {
    headers['X-WP-Nonce'] = wpSettings.apiNonce;
  }
  
  console.log(`Posting to: ${apiUrl}${endpoint}`, data);
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) {
    const message = `API request failed: ${response.status} ${response.statusText}`;
    console.error(message);
    
    // Try to parse error response as JSON
    try {
      const errorData = await response.json();
      console.error('API Error:', errorData);
    } catch (e) {
      // If parsing fails, continue with the original error
    }
    
    throw new Error(message);
  }

  return response.json();
}

/**
 * API Types
 */
export interface SetupData {
  tracking_enabled: boolean;
  remote_url: string;
  environment_id: string;
  health_status: {
    live: boolean;
    ready: boolean;
  };
}

export interface PrivacyData {
  anonymize_ip: boolean;
  data_retention: number;
  cookie_notice: string;
}

/**
 * Setup API Functions
 */
export async function getSetupData(): Promise<SetupData> {
  return fetchApi<SetupData>('/setup');
}

export async function updateSetupData(data: Partial<SetupData>): Promise<SetupData> {
  return postApi<SetupData>('/setup', data);
}

/**
 * Privacy API Functions
 */
export async function getPrivacyData(): Promise<PrivacyData> {
  return fetchApi<PrivacyData>('/privacy');
}

export async function updatePrivacyData(data: Partial<PrivacyData>): Promise<PrivacyData> {
  return postApi<PrivacyData>('/privacy', data);
} 