import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';
import FullPageProtectedRoute from './guards/FullPageProtectedRoute';

// Pages
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Signup from '../pages/Signup';
import Onboarding from '../pages/Onboarding';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Lazy loaded pages
const Drafts = lazy(() => import('../pages/Drafts'));
const History = lazy(() => import('../pages/History'));
const Clients = lazy(() => import('../pages/Clients'));
const Inventory = lazy(() => import('../pages/Inventory'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing & Auth Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
      
      {/* Full-Page Protected Flow (No Sidebar) */}
      <Route path="/onboarding" element={<FullPageProtectedRoute><Onboarding /></FullPageProtectedRoute>} />

      {/* Application Shell Routes (Dashboard Layout) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/new-invoice" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Protected Routes Example */}
      {/* 
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route> 
      */}
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
