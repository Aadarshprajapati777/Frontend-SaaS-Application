import React, { Suspense, ErrorBoundary } from 'react';
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

// Lazy-loaded protected pages
const DocumentsPage = React.lazy(() => import('./pages/documents.jsx'));
const DocumentUploadPage = React.lazy(() => import('./pages/documents-upload.jsx'));
const ModelsPage = React.lazy(() => import('./pages/models.jsx'));
// const CreateModelPage = React.lazy(() => import('./pages/models-new.jsx'));
// const ChatListPage = React.lazy(() => import('./pages/chat.jsx'));
// const NewChatPage = React.lazy(() => import('./pages/chat-new.jsx'));
const SettingsPage = React.lazy(() => import('./pages/settings.jsx'));
// const ProfileSettingsPage = React.lazy(() => import('./pages/profile-settings.jsx'));
// const BillingPage = React.lazy(() => import('./pages/billing.jsx'));

// Business-specific pages (lazy-loaded)
const TeamManagementPage = React.lazy(() => import('./pages/team.jsx'));
const UsageMonitorPage = React.lazy(() => import('./pages/usage.jsx'));
const ApiKeysPage = React.lazy(() => import('./pages/api-keys.jsx'));

// Simple error boundary component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-red-600 text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              We're sorry, but there was an error in the application. Please try refreshing the page.
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
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
                  
                  {/* Document management */}
                  <Route path="/documents" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <DocumentsPage />
                    </Suspense>
                  } />
                  <Route path="/documents/upload" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <DocumentUploadPage />
                    </Suspense>
                  } />
                  
                  {/* Model management */}
                  <Route path="/models" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ModelsPage />
                    </Suspense>
                  } />
                  {/* <Route path="/models/new" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <CreateModelPage />
                    </Suspense>
                  } /> */}
                  
                  {/* Chat */}
                  {/* <Route path="/chat" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ChatListPage />
                    </Suspense>
                  } /> */}
                  {/* <Route path="/chat/new" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NewChatPage />
                    </Suspense>
                  } />
                   */}
                  {/* Settings */}
                  <Route path="/settings" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <SettingsPage />
                    </Suspense>
                  } />
                  {/* <Route path="/settings/profile" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ProfileSettingsPage />
                    </Suspense>
                  } /> */}
                  
                  {/* Billing */}
                  {/* <Route path="/billing" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <BillingPage />
                    </Suspense>
                  } /> */}
                  
                  {/* Business-specific routes */}
                  <Route path="/team" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <TeamManagementPage />
                    </Suspense>
                  } />
                  <Route path="/usage" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <UsageMonitorPage />
                    </Suspense>
                  } />
                  <Route path="/api-keys" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ApiKeysPage />
                    </Suspense>
                  } />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
