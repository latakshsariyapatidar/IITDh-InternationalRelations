import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStudentAuth } from '../contexts/StudentAuthContext';

const StudentProtectedRoute = ({ children }) => {
  const { isStudentAuthenticated, loading } = useStudentAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (!isStudentAuthenticated) {
    return <Navigate to="/students" state={{ from: location }} replace />;
  }

  return children;
};

export default StudentProtectedRoute;
