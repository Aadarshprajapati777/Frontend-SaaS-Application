import React from 'react';
import { LoginForm } from '../components/forms/login-form';

/**
 * Login Page
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <LoginForm />
    </div>
  );
} 