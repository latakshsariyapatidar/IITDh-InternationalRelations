import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAccessToken } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to handle login success
  const login = (token) => {
    setAccessToken(token);
    setIsAdminAuthenticated(true);
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      setIsAdminAuthenticated(false);
    }
  };

  // Check auth state on mount by attempting a refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        const token = response.data?.data?.accessToken;
        if (token) {
          login(token);
        }
      } catch (error) {
        // Normal if user is not logged in or session expired
        console.log("No active session found.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for custom logout events from the axios interceptor
    const handleSessionExpired = () => {
      setIsAdminAuthenticated(false);
    };

    window.addEventListener('auth-session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth-session-expired', handleSessionExpired);
    };
  }, []);

  const value = {
    isAdminAuthenticated,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
