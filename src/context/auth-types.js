import { createContext } from 'react';

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