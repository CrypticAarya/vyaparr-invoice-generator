import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/home" replace />;

  return children;
};

export default PublicRoute;
