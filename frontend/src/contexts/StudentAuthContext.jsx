import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAccessToken } from '../api/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

const StudentAuthContext = createContext();

export const useStudentAuth = () => useContext(StudentAuthContext);

export const StudentAuthProvider = ({ children }) => {
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userRole, profile) => {
    setAccessToken(token);
    setIsStudentAuthenticated(true);
    setRole(userRole);
    setFacultyProfile(profile);
  };

  const logout = async () => {
    try {
      await apiClient.post('/campus-auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      setIsStudentAuthenticated(false);
      setRole(null);
      setFacultyProfile(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.post('/campus-auth/refresh');
        const token = response.data?.data?.accessToken;
        const userRole = response.data?.data?.role;
        const profile = response.data?.data?.faculty;
        if (token) {
          login(token, userRole, profile);
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
    role,
    facultyProfile,
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
