// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { AuthContext } from './auth-types';

// /**
//  * AuthProvider Component
//  * 
//  * Provides authentication state and methods to the app
//  */
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const navigate = useNavigate();

//   // Clear any error messages
//   const clearError = () => setError(null);

//   // Check if user is logged in on initial load
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           setLoading(false);
//           setInitialLoadComplete(true);
//           return;
//         }
        
//         // Set token in axios header
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
//         // Get current user data
//         const response = await api.get('/api/auth/me');
//         setUser(response.data.data);
//       } catch (err) {
//         console.error('Failed to load user:', err);
//         // Clear invalid token
//         localStorage.removeItem('token');
//         delete api.defaults.headers.common['Authorization'];
//       } finally {
//         setLoading(false);
//         setInitialLoadComplete(true);
//       }
//     };

//     loadUser();
//   }, []);

//   // Login user
//   const login = async (email, password) => {
//     try {
//       clearError();
//       setLoading(true);
      
//       if (!email || !password) {
//         throw new Error('Email and password are required');
//       }
      
//       const response = await api.post('/api/auth/login', { email, password });
      
//       if (!response.data || !response.data.token) {
//         throw new Error('Invalid response from server');
//       }
      
//       // Save token to local storage
//       localStorage.setItem('token', response.data.token);
      
//       // Set token in axios header
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
//       // Set user data
//       setUser(response.data.data);
      
//       // Redirect to dashboard
//       navigate('/dashboard');
      
//       return response.data;
//     } catch (err) {
//       console.error('Login error:', err);
//       const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register new user
//   const register = async (userData) => {
//     try {
//       clearError();
//       setLoading(true);
      
//       if (!userData.email || !userData.password || !userData.name) {
//         throw new Error('Name, email and password are required');
//       }
      
//       // Prepare registration data
//       const registrationData = {
//         name: userData.name,
//         email: userData.email,
//         password: userData.password,
//         userType: userData.userType || 'individual',
//       };
      
//       // Add business-specific data if userType is business
//       if (userData.userType === 'business') {
//         if (!userData.businessName) {
//           throw new Error('Business name is required');
//         }
        
//         registrationData.businessName = userData.businessName;
//         registrationData.businessSize = userData.businessSize;
        
//         // Add additional business fields if provided
//         if (userData.website) registrationData.website = userData.website;
//         if (userData.industry) registrationData.industry = userData.industry;
//         if (userData.plan) registrationData.plan = userData.plan;
//         if (userData.teamSize) registrationData.teamSize = userData.teamSize;
//         if (userData.apiAccess !== undefined) registrationData.apiAccess = userData.apiAccess;
//       }
      
//       // Send registration request
//       const response = await api.post('/api/auth/register', registrationData);
      
//       if (!response.data || !response.data.token) {
//         throw new Error('Invalid response from server');
//       }
      
//       // Save token to local storage
//       localStorage.setItem('token', response.data.token);
      
//       // Set token in axios header
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
//       // Set user data
//       setUser(response.data.data);
      
//       // Redirect to dashboard or welcome page based on user type
//       if (userData.userType === 'business') {
//         navigate('/dashboard?welcome=business');
//       } else {
//         navigate('/dashboard?welcome=individual');
//       }
      
//       return response.data;
//     } catch (err) {
//       console.error('Registration error:', err);
//       const errorMessage = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout user
//   const logout = async () => {
//     try {
//       setLoading(true);
      
//       // Call logout API
//       await api.post('/api/auth/logout');
//     } catch (err) {
//       console.error('Logout error:', err);
//       // Continue with logout even if API call fails
//     } finally {
//       // Remove token from local storage
//       localStorage.removeItem('token');
      
//       // Remove token from axios header
//       delete api.defaults.headers.common['Authorization'];
      
//       // Clear user data
//       setUser(null);
//       setLoading(false);
      
//       // Redirect to login page
//       navigate('/login');
//     }
//   };

//   // Value object
//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     clearError,
//     initialLoadComplete,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// } 



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
      
      // Redirect to dashboard
      navigate('/dashboard');
      
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
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
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
      
      // Call logout API
      await api.post('/api/auth/logout');
      
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 