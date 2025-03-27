import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-utils';

/**
 * ProtectedRoute Component
 * 
 * A wrapper for protected routes that requires authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }) {
  const { user, loading, initialLoadComplete } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  // Only if the initial load is not complete
  if (loading && !initialLoadComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If we've completed initial loading and there's no user, redirect to login
  if (initialLoadComplete && !user) {
    // Save the location they were trying to go to for a redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render the protected content if authenticated
  return children;
} 