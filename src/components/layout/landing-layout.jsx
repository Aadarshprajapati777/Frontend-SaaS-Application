import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * LandingLayout Component
 * 
 * The layout for unauthenticated pages with navigation and footer
 */
export function LandingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Bharat AI</span>
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex sm:items-center sm:space-x-8">
              <NavLink
                to="/features"
                className={({ isActive }) => cn(
                  "text-sm font-medium transition-colors hover:text-indigo-600",
                  isActive ? "text-indigo-600" : "text-gray-700"
                )}
              >
                Features
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) => cn(
                  "text-sm font-medium transition-colors hover:text-indigo-600",
                  isActive ? "text-indigo-600" : "text-gray-700"
                )}
              >
                Pricing
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => cn(
                  "text-sm font-medium transition-colors hover:text-indigo-600",
                  isActive ? "text-indigo-600" : "text-gray-700"
                )}
              >
                About
              </NavLink>
              <NavLink 
                to="/login" 
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Log in
              </NavLink>
              <NavLink to="/register">
                <Button size="sm">Sign up</Button>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <NavLink
                to="/features"
                className={({ isActive }) => cn(
                  "block px-4 py-2 text-base font-medium",
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={toggleMobileMenu}
              >
                Features
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) => cn(
                  "block px-4 py-2 text-base font-medium",
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={toggleMobileMenu}
              >
                Pricing
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => cn(
                  "block px-4 py-2 text-base font-medium",
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={toggleMobileMenu}
              >
                About
              </NavLink>
              <NavLink
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="block px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Sign up
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="mt-8 flex justify-center space-x-6">
            {/* Social links */}
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} AI Doc Chat SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 