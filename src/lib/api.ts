export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface LoginCredentials {
  email: string;
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
  try {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    console.log('All cookies:', cookies); // Debug log
    
    const tokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      console.log('Token found in cookies:', token ? 'exists' : 'none'); // Debug log
      return token;
    }
    console.log('No access_token cookie found'); // Debug log
    return null;
  } catch (error) {
    console.error('Error getting token from cookies:', error);
    return null;
  }
};

// Helper function to set token in cookies
export const setTokenInCookies = (token: string) => {
  try {
    // Set cookie without secure flag for localhost
    document.cookie = `access_token=${token}; path=/; max-age=86400`;
    console.log('Token set in cookies successfully'); // Debug log
    
    // Verify token was set
    const storedToken = getTokenFromCookies();
    console.log('Token verification after setting:', storedToken ? 'exists' : 'missing');
  } catch (error) {
    console.error('Error setting token in cookies:', error);
  }
};

// Helper function to remove token from cookies
export const removeTokenFromCookies = (): void => {
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  console.log('Access token removed from cookies');
};

// API request helper with authentication
// export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//   const token = getTokenFromCookies();
//   console.log('Making API request to:', endpoint, 'with token:', token ? 'exists' : 'none');
  
//   const config: RequestInit = {
//     ...options,
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` }),
//       ...options.headers,
//     },
//   };

//   console.log('Request config headers for', endpoint, ':', config.headers); // New Debug Log

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
//     if (!response.ok) {
//       if (response.status === 401) {
//         // Only redirect to login if we're not already on the login page
//         if (!window.location.pathname.includes('/login')) {
//           removeTokenFromCookies();
//           window.location.href = '/login';
//         }
//         throw new Error('Session expired. Please login again.');
//       }
//       const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
//       console.error('API Error:', response.status, errorData);
//       throw new Error(errorData.detail || `API Error: ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     console.error('Request failed:', error);
//     throw error;
//   }
// };











// api.ts
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getTokenFromCookies();
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Only set Content-Type to application/json if the body is not FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired');
    }
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
  }

  // Handle cases where the response body is empty (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null; // Or handle as appropriate for non-JSON responses
  }
};









// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      formData.append('grant_type', 'password');

      console.log('Attempting login with:', { email: credentials.email }); // Debug log

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include',
      });

      const responseData = await response.json();
      console.log('Login response status:', response.status); // Debug log
      console.log('Login response data:', responseData); // Debug log

      if (!response.ok) {
        const errorMessage = responseData.detail || responseData.message || 'Login failed';
        console.error('Login failed:', {
          status: response.status,
          error: errorMessage,
          data: responseData
        });
        throw new Error(errorMessage);
      }

      if (!responseData.access_token) {
        console.error('No access token in response:', responseData);
        throw new Error('No access token received from server');
      }

      // Store token in cookies with proper settings
      const token = responseData.access_token;
      // Set cookie without secure flag for localhost
      document.cookie = `access_token=${token}; path=/; max-age=86400`;
      console.log('Token stored in cookies successfully');

      // Verify token was set
      const storedToken = getTokenFromCookies();
      console.log('Stored token verification:', storedToken ? 'exists' : 'missing');

      return responseData;
    } catch (error) {
      console.error('Login error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    return apiRequest('/auth/signup', {
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
