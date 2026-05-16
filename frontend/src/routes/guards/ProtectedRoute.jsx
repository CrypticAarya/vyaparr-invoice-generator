import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/Skeleton';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  // 1. Basic Auth Check
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Onboarding Check
  if (!user.isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // 3. RBAC Check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />; // Redirect unauthorized to home
  }

  // 4. Verification Check (Optional: Could show a banner instead of redirect)
  // if (!user.isVerified && sensitivePaths.includes(location.pathname)) { ... }

  return children;
};

export default ProtectedRoute;
