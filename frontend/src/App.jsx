import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProviderWrapper } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import { PageLoader } from './components/Skeleton'; // Using a premium skeleton or loader

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProviderWrapper>
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-v-bg flex items-center justify-center"><PageLoader /></div>}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </ToastProviderWrapper>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
