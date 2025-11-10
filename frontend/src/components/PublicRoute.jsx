import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth/authQueries';

const PublicRoute = ({ children, restrictWhenAuthenticated = false }) => {
  const { data: authData, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If authenticated and this route should be restricted, redirect to dashboard
  if (authData && restrictWhenAuthenticated) {
    // Check if user was trying to go somewhere specific before login
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Render the public content
  return children;
};

export default PublicRoute;