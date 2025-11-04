/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService, type AuthResponse } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    console.log('AuthProvider: Checking auth - Token exists:', !!token, 'User exists:', !!savedUser);

    if (token && savedUser) {
      try {
        console.log('AuthProvider: Validating token with server...');
        const response = await apiService.validateToken();
        console.log('AuthProvider: Token validation response:', response);
        
        if (response.valid && response.user) {
          // Ensure user has role
          const userData = {
            ...response.user,
            role: response.user.role || 'USER'
          };
          console.log('AuthProvider: Setting user data:', userData);
          setUser(userData);
          // Update localStorage with corrected user data
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.log('AuthProvider: Token invalid, response:', response);
          // If token is invalid, clear everything
          logout();
        }
      } catch (error) {
        console.error('AuthProvider: Token validation failed:', error);
        // On network errors, use saved user as fallback
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            const userData = {
              ...parsedUser,
              role: parsedUser.role || 'USER'
            };
            setUser(userData);
            console.log('AuthProvider: Using saved user after network error');
          } else {
            logout();
          }
        } catch (parseError) {
          console.error('AuthProvider: Failed to parse saved user:', parseError);
          logout();
        }
      }
    } else {
      console.log('AuthProvider: No token or user found');
      logout(); // Clear any invalid data
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('AuthProvider: Attempting login for:', email);
      const response: AuthResponse = await apiService.login({ email, password });
      
      // Ensure user data has role
      const userData = {
        ...response.user,
        role: response.user.role || 'USER'
      };
      
      console.log('AuthProvider: Login successful, storing data', userData);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('AuthProvider: Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await apiService.register({ firstName, lastName, email, password });
      
      // Ensure user data has role
      const userData = {
        ...response.user,
        role: response.user.role || 'USER'
      };
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('AuthProvider: Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Safe role checking
  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  console.log('AuthProvider: Current auth state', { 
    user: user?.email, 
    isAuthenticated, 
    isAdmin, 
    loading 
  });

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};