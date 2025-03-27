import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Settings, FileText, 
  MessageSquare, Zap, Users, CreditCard, PieChart, Key, Building } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../context/auth-utils';

// Function to get navigation items based on user type
const getNavItems = (user) => {
  // Base navigation items for all users
  const baseItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'AI Models',
      href: '/models',
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: 'Chat',
      href: '/chat',
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];

  // Items for all users but with different permissions/limits
  const commonItems = [
    {
      title: 'Billing',
      href: '/billing',
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  // Business-only navigation items
  const businessItems = [
    {
      title: 'Team Management',
      href: '/team',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Usage Monitor',
      href: '/usage',
      icon: <PieChart className="h-5 w-5" />
    },
    {
      title: 'API Integration',
      href: '/api-keys',
      icon: <Key className="h-5 w-5" />
    }
  ];

  // Return different navigation items based on user type
  if (!user) return baseItems;
  
  if (user.userType === 'business') {
    return [...baseItems, ...businessItems, ...commonItems];
  }
  
  return [...baseItems, ...commonItems];
};

/**
 * AppShell Component
 * 
 * The main layout component for the authenticated application with a responsive sidebar
 */
export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Get navigation items based on user type
  const navItems = getNavItems(user);
  
  // Check if there's a welcome parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const welcome = params.get('welcome');
    
    if (welcome) {
      // You could show a welcome notification or modal here
      console.log(`Welcome ${welcome} user!`);
      
      // Remove the welcome parameter from URL
      const newUrl = `${location.pathname}${location.search.replace(`welcome=${welcome}`, '').replace(/^\?&/, '?').replace(/[?&]$/, '')}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = () => {
    // Call logout API and clear local storage
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-indigo-700 text-white transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 py-3 border-b border-indigo-800">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="ml-2 text-xl font-semibold">AI Doc Chat</span>
          </div>
          <button 
            className="lg:hidden text-indigo-300 hover:text-white"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-indigo-800 text-white font-medium"
                      : "text-indigo-100 hover:bg-indigo-600"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Account type indicator for business accounts */}
          {user && user.userType === 'business' && (
            <div className="mt-6 pt-6 border-t border-indigo-800">
              <div className="px-4 py-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-indigo-300" />
                  <span className="ml-2 text-xs font-semibold text-indigo-300">BUSINESS ACCOUNT</span>
                </div>
                <div className="mt-1 text-xs text-indigo-200">
                  {user.plan && (
                    <span className="bg-indigo-900 px-2 py-1 rounded text-xs capitalize">
                      {user.plan === 'starter' ? 'Starter Plan' : 
                       user.plan === 'professional' ? 'Pro Plan' : 
                       user.plan === 'enterprise' ? 'Enterprise Plan' : 'Free Plan'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-indigo-800">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* User menu */}
            <div className="ml-auto relative">
              <button
                className="flex items-center space-x-2 text-sm bg-gray-100 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={toggleUserMenu}
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </div>
                <span className="text-gray-700">{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50">
                  <NavLink
                    to="/settings/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2 inline-block" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2 inline-block" />
                    Settings
                  </NavLink>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2 inline-block" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 