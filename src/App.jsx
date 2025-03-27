import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/auth-context';
import { ProtectedRoute } from './components/auth/protected-route';
import { LandingLayout } from './components/layout/landing-layout';
import { AppShell } from './components/layout/app-shell';

// Public pages
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

// Protected pages
import DashboardPage from './pages/dashboard';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Main App Component
 * 
 * Sets up routing and global providers
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes with landing layout */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Add more public routes as needed */}
              <Route path="/pricing" element={<div>Pricing Page (Coming Soon)</div>} />
              <Route path="/features" element={<div>Features Page (Coming Soon)</div>} />
              <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
            </Route>

            {/* Protected routes with app shell layout */}
            <Route 
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Add more protected routes as needed */}
              <Route path="/documents" element={<div>Documents Page (Coming Soon)</div>} />
              <Route path="/documents/upload" element={<div>Upload Document Page (Coming Soon)</div>} />
              <Route path="/models" element={<div>Models Page (Coming Soon)</div>} />
              <Route path="/models/new" element={<div>Create Model Page (Coming Soon)</div>} />
              <Route path="/chat" element={<div>Chat List Page (Coming Soon)</div>} />
              <Route path="/chat/new" element={<div>New Chat Page (Coming Soon)</div>} />
              <Route path="/teams" element={<div>Teams Page (Coming Soon)</div>} />
              <Route path="/billing" element={<div>Billing Page (Coming Soon)</div>} />
              <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
              <Route path="/settings/profile" element={<div>Profile Settings Page (Coming Soon)</div>} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
      
      {/* Toast notifications */}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
