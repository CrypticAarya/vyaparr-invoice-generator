import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { ToastProviderWrapper } from './context/ToastContext';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';

// Lazy load pages for performance
const Drafts = lazy(() => import('./pages/Drafts'));
const History = lazy(() => import('./pages/History'));
const Clients = lazy(() => import('./pages/Clients'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
    <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

// Protected Route Wrapper (with Sidebar/Navbar)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (user && !user.isOnboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="flex-1 relative overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Route that redirects logged-in users away from public pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/home" replace />;
  return children;
};

// Route wrapper for full-page protected flows (like Onboarding) without Sidebar
const FullPageProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProviderWrapper>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing & Auth Routes */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            
            {/* Full-Page Protected Flow */}
            <Route path="/onboarding" element={<FullPageProtectedRoute><Onboarding /></FullPageProtectedRoute>} />

            {/* Application Shell Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/new-invoice" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/drafts" element={<ProtectedRoute><Drafts /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProviderWrapper>
    </AuthProvider>
  );
}

export default App;

