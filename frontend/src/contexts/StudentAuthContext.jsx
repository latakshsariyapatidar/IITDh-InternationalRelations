import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAccessToken } from '../api/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

const StudentAuthContext = createContext();

export const useStudentAuth = () => useContext(StudentAuthContext);

export const StudentAuthProvider = ({ children }) => {
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (token) => {
    setAccessToken(token);
    setIsStudentAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.post('/student-auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      setIsStudentAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.post('/student-auth/refresh');
        const token = response.data?.data?.accessToken;
        if (token) {
          login(token);
        }
      } catch (error) {
        console.log("No active student session found.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    isStudentAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <StudentAuthContext.Provider value={value}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "355857964889-4carkip2drm07698r2gchihhsmt43312.apps.googleusercontent.com"}>
        {children}
      </GoogleOAuthProvider>
    </StudentAuthContext.Provider>
  );
};
