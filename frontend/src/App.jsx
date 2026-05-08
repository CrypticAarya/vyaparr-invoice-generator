import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProviderWrapper } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProviderWrapper>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProviderWrapper>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
