import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Error handler for React errors
const handleError = (error) => {
  console.error('React Error:', error);
  // You could also log to an error tracking service here
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Create root element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render with error boundary
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  handleError(error);
  
  // Render fallback UI if App fails to render
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-red-600 text-2xl font-bold mb-4">Application Error</h1>
        <p className="text-gray-700 mb-4">
          We're sorry, but the application failed to load. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Reload Application
        </button>
      </div>
    </div>
  );
}
