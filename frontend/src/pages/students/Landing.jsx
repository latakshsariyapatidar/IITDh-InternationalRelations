import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../../api/client';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function Landing() {
  const { login, isStudentAuthenticated, role } = useStudentAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/students/track';

  useEffect(() => {
    if (isStudentAuthenticated) {
      if (role === 'faculty') {
        navigate('/faculty-portal', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isStudentAuthenticated, role, navigate, from]);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await apiClient.post('/campus-auth/google', {
        idToken: credentialResponse.credential,
      });
      const token = res.data?.data?.accessToken;
      const userRole = res.data?.data?.role;
      const profile = res.data?.data?.faculty;
      if (token) {
        login(token, userRole, profile);
        if (userRole === 'faculty') {
          navigate('/faculty-portal', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || 'Login failed. Please ensure you are using an @iitdh.ac.in account.');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    alert('Google Login Failed');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-8">
        <div>
          <img src="/IITDh Logo.svg" alt="IITDh Logo" className="h-20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-brand-purpleDark mb-2">Campus Portal</h1>
          <p className="text-gray-500 text-sm">
            Please log in with your official IIT Dharwad Google Account to access the student or faculty portal.
          </p>
        </div>
        
        <div className="flex justify-center pb-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            size="large"
            text="signin_with"
            hosted_domain="iitdh.ac.in"
          />
        </div>
      </div>
    </div>
  );
}
