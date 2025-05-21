import axios from 'axios';

import { getAuthToken } from './authService';

// Define the base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005';
// const locale = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token and language to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage
    const token = getAuthToken();

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Get the language from localStorage and add it to Accept-Language header
    const language = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

    config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response issues
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      // Clear any existing auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response && error.response.status === 403) {
      // Handle forbidden access
      console.log('Forbidden access');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Custom GET method with additional configuration
export const customGet = async <T>(url: string, params?: any, config?: any): Promise<T> => {
  try {
    // Get the auth token
    const token = getAuthToken();

    // Create a custom config for this request
    const customConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      },
      params
    };

    const response = await apiClient.get<T>(url, customConfig);

    return response.data;
  } catch (error) {
    console.error(`Error in custom GET request to ${url}:`, error);
    throw error;
  }
};

// Custom POST method for creating resources
export const customPost = async <T>(url: string, data?: any, config?: any): Promise<T> => {
  try {
    // Get the auth token
    const token = getAuthToken();

    // Create a custom config for this request
    const customConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    };

    const response = await apiClient.post<T>(url, data, customConfig);

    return response.data;
  } catch (error) {
    console.error(`Error in custom POST request to ${url}:`, error);
    throw error;
  }
};

export const customPostFile = async <T>(url: string, data?: any, config?: any): Promise<any> => {
  try {
    // Get the auth token
    const token = getAuthToken();

    // Create a custom config for this request
    const customConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    };

    const response = await apiClient.post<T>(url, data, customConfig);

    return response;
  } catch (error) {
    console.error(`Error in custom POST request to ${url}:`, error);
    throw error;
  }
};

// Custom PUT method for updating resources
export const customPostForm = async <T>(url: string, data?: any, config?: any): Promise<T> => {
  try {
    // Get the auth token
    const token = getAuthToken();

    // Create a custom config for this request
    const customConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    };

    const response = await apiClient.postForm<T>(url, data, customConfig);

    return response.data;
  } catch (error) {
    console.error(`Error in custom PUT request to ${url}:`, error);
    throw error;
  }
};

// Custom DELETE method for removing resources
export const customDelete = async <T>(url: string, config?: any): Promise<T> => {
  try {
    // Get the auth token
    const token = getAuthToken();

    // Create a custom config for this request
    const customConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    };

    const response = await apiClient.delete<T>(url, customConfig);

    return response.data;
  } catch (error) {
    console.error(`Error in custom DELETE request to ${url}:`, error);
    throw error;
  }
};

export default apiClient;
