/**
 * API Client Configuration
 * Centralized API configuration for making HTTP requests to the backend
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api';

/**
 * Get the base backend API URL
 */
export const getBackendUrl = (): string => {
  return BACKEND_URL;
};

/**
 * Create a full API endpoint URL
 * @param path - The API endpoint path (e.g., '/transactions', '/products')
 * @returns Full URL to the API endpoint
 */
export const createApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
};

/**
 * API Client for making HTTP requests
 */
export const apiClient = {
  /**
   * GET request
   */
  get: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(createApiUrl(path), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * POST request
   */
  post: async <T>(path: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(createApiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * PUT request
   */
  put: async <T>(path: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(createApiUrl(path), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * DELETE request
   */
  delete: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(createApiUrl(path), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * PATCH request
   */
  patch: async <T>(path: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(createApiUrl(path), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};

export default apiClient;
