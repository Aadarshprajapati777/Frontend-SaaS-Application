import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Create context
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  clearError: () => {},
  initialLoadComplete: false,
});

/**
 * AuthProvider Component
 * 
 * Provides authentication state and methods to the app
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const navigate = useNavigate();

  // Clear any error messages
  const clearError = () => setError(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          setInitialLoadComplete(true);
          return;
        }
        
        // Set token in axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get current user data
        const response = await api.get('/api/auth/me');
        setUser(response.data.data);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post('/api/auth/login', { email, password });
      
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      
      // Set token in axios header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setUser(response.data.data);
      
      // Return the data without navigation
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post('/api/auth/register', userData);
      
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      
      // Set token in axios header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setUser(response.data.data);
      
      // Return the data without navigation
      return response.data;
    } catch (err) {
      console.error('Registration error details:', err);
      
      // Try to get a detailed error message from the response
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with an error status
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
        console.log('Server error response:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      try {
        // Call logout API
        await api.post('/api/auth/logout');
        console.log('Successfully logged out from server');
      } catch (apiError) {
        // Log but continue with local logout even if the API call fails
        console.error('Error during server logout:', apiError);
        console.log('Continuing with local logout...');
      }
      
      // Always clean up local state regardless of API call success
      // Remove token from local storage
      localStorage.removeItem('token');
      
      // Remove token from axios header
      delete api.defaults.headers.common['Authorization'];
      
      // Clear user data
      setUser(null);
      
      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Show error to user
      setError('Failed to logout properly. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    initialLoadComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 