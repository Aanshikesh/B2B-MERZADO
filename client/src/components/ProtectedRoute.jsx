import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './CommonUI';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Checking authentication credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If role doesn't match, send user to their respective default portal
    if (user?.role === 'buyer') {
      return <Navigate to="/buyer/dashboard" replace />;
    } else {
      return <Navigate to="/marketplace" replace />;
    }
  }

  return children;
};
