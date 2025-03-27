import { useContext } from 'react';
import { AuthContext } from './auth-types';

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 