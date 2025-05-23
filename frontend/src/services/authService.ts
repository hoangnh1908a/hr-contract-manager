import axios, { isAxiosError } from 'axios';

// Define the base URL for your Spring Boot API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005';

// Types for login requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    fullName: string;
    roles: string[];
    forcePasswordChangeOnLogin?: number;
    passwordExpiryDate?: string;
  };
}

/**
 * Authenticate user with Spring Boot backend
 * @param loginData email and password
 * @returns Promise with login response containing token and user data
 */
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/generateToken`, loginData);

    const parsedUser = JSON.parse(response.data.user as any);

    const loginResponse: LoginResponse = {
      token: response.data.token,
      user: {
        username: parsedUser.username,
        fullName: parsedUser.fullname,
        roles: parsedUser.authorities.map((a: any) => a.role),
        forcePasswordChangeOnLogin: parsedUser.forcePasswordChangeOnLogin,
        passwordExpiryDate: parsedUser.passwordExpiryDate
      }
    };

    return loginResponse;
  } catch (error) {
    // Handle different error status codes
    if (isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Authentication failed');
      } else {
        throw new Error('Network error, please check your connection');
      }
    }

    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Store authentication token in localStorage
 * @param token JWT token from login response
 */
export const setAuthToken = (email: string, token: string, role: string): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);
};

/**
 * Get stored authentication token
 * @returns The stored JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }

  return null;
};

export const getCurrentEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('email');
  }

  return null;
};

/**
 * Remove authentication token (logout)
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();

  return !!token;
};
