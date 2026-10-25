import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setCampusAccessToken, refreshCampusSession } from '../api/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

const StudentAuthContext = createContext();

export const useStudentAuth = () => useContext(StudentAuthContext);

export const StudentAuthProvider = ({ children }) => {
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userRole, profile) => {
    setCampusAccessToken(token);
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
      setCampusAccessToken(null);
      setIsStudentAuthenticated(false);
      setRole(null);
      setFacultyProfile(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Shared with the axios interceptor, so the two can't rotate the same
        // refresh cookie at once
        const data = await refreshCampusSession();
        const token = data?.accessToken;
        const userRole = data?.role;
        const profile = data?.faculty;
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

    const handleCampusSessionExpired = () => {
      setIsStudentAuthenticated(false);
      setRole(null);
      setFacultyProfile(null);
    };

    window.addEventListener('campus-session-expired', handleCampusSessionExpired);
    return () => {
      window.removeEventListener('campus-session-expired', handleCampusSessionExpired);
    };
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
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "40123449743-ger1qs5gjvdip8ba9f0vu152n1q8f2ol.apps.googleusercontent.com"}>
        {children}
      </GoogleOAuthProvider>
    </StudentAuthContext.Provider>
  );
};
