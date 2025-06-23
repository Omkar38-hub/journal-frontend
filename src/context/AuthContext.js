import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { 
  isTokenExpired, 
  isTokenExpiringSoon, 
  clearAuthData as clearAuthDataUtil,
  getTimeUntilExpiration 
} from '../utils/tokenUtils';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to clear all auth data
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    clearAuthDataUtil();
  };

  // Function to validate token and handle expiration
  const validateToken = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return false;
    }

    // First check if token is expired locally
    if (isTokenExpired(token)) {
      console.log('Token is expired locally');
      clearAuthData();
      setIsLoading(false);
      return false;
    }

    try {
      // Make a simple API call to validate the token
      await api.get('/user');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      // If token is invalid or expired, clear auth data
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      return true; // For other errors, assume token is still valid
    }
  }, [token]);

  // Check for token expiration warnings
  const checkTokenExpirationWarning = useCallback(() => {
    if (!token) return;
    if (isTokenExpiringSoon(token)) {
      const timeUntilExpiration = getTimeUntilExpiration(token);
      const minutesLeft = Math.ceil(timeUntilExpiration / (1000 * 60));
      // Dispatch warning event
      window.dispatchEvent(new CustomEvent('tokenExpiringSoon', {
        detail: {
          message: `Your session will expire in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}. Please save your work.`,
          timeLeft: timeUntilExpiration
        }
      }));
    }
  }, [token]);

  // Validate token on app startup and when token changes
  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
    }
  }, [token, validateToken]);

  // Set up periodic token validation and expiration checks
  useEffect(() => {
    if (!token) return;
    const validationInterval = setInterval(() => {
      validateToken();
    }, 60 * 1000); // 1 minute
    const warningInterval = setInterval(() => {
      checkTokenExpirationWarning();
    }, 30 * 1000); // 30 seconds
    return () => {
      clearInterval(validationInterval);
      clearInterval(warningInterval);
    };
  }, [token, validateToken, checkTokenExpirationWarning]);

  useEffect(() => {
    if (user && token && role) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [user, token, role]);

  const login = (userData, jwt, userRole) => {
    setUser(userData);
    setToken(jwt);
    setRole(userRole);
  };

  const logout = () => {
    clearAuthData();
  };

  const signup = (userData, jwt, userRole) => {
    setUser(userData);
    setToken(jwt);
    setRole(userRole);
  };

  // Function to handle token expiration
  const handleTokenExpiration = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      role, 
      setRole, 
      login, 
      logout, 
      signup, 
      isLoading,
      handleTokenExpiration,
      validateToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
