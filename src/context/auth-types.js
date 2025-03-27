import { createContext } from 'react';

/**
 * @deprecated This file is deprecated. 
 * Please import the AuthContext directly from auth-context.jsx instead.
 * This file is kept for backward compatibility only.
 */

// Create context
export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  clearError: () => {},
  initialLoadComplete: false,
}); 