
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTokenFromCookies, removeTokenFromCookies, setTokenInCookies, authAPI, LoginCredentials, SignupCredentials } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getTokenFromCookies();
    if (token) {
      // In a real app, you'd validate the token with the backend
      // For now, we'll assume the token is valid if it exists
      setUser({
        id: 'temp-id',
        email: 'temp@email.com',
        full_name: 'Temp User',
        avatar_url: null,
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      setTokenInCookies(response.access_token);
      setUser({
        id: response.user_id,
        email: response.email,
        full_name: response.full_name,
        avatar_url: response.avatar_url,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await authAPI.signup(credentials);
      // After signup, you might want to auto-login or redirect to login
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeTokenFromCookies();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
