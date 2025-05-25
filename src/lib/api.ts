
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}

export interface SignupResponse {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

// Helper function to get token from cookies
export const getTokenFromCookies = (): string | null => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Helper function to set token in cookies
export const setTokenInCookies = (token: string): void => {
  document.cookie = `access_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
};

// Helper function to remove token from cookies
export const removeTokenFromCookies = (): void => {
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// API request helper with authentication
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getTokenFromCookies();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    return apiRequest('/auth/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<void> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email: string, pin: string, newPassword: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        pin,
        new_password: newPassword,
      }),
    });
  },
};
