import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth-utils';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, MessageCircle, Zap, BarChart2, Plus, ArrowRight } from 'lucide-react';

/**
 * Dashboard Page Component
 * 
 * The main dashboard view for authenticated users
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    documents: 0,
    models: 0,
    chats: 0,
    storage: '0 MB',
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch actual data from the backend
        // For now, we'll just simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock dashboard data
        setStats({
          documents: 12,
          models: 3,
          chats: 27,
          storage: '258.4 MB',
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Recent activity list
  const recentActivity = [
    { id: 1, type: 'chat', title: 'Q4 Financial Analysis', date: '2 hours ago' },
    { id: 2, type: 'upload', title: 'Annual Report 2023.pdf', date: '1 day ago' },
    { id: 3, type: 'model', title: 'Legal Document Model', date: '3 days ago' },
    { id: 4, type: 'chat', title: 'Marketing Strategy Discussion', date: '5 days ago' },
  ];

  // Quick actions
  const quickActions = [
    { 
      title: 'Upload Document', 
      icon: <FileText className="h-5 w-5" />, 
      description: 'Add a new document to your library',
      link: '/documents/upload',
    },
    { 
      title: 'Start New Chat', 
      icon: <MessageCircle className="h-5 w-5" />, 
      description: 'Begin a conversation with your AI models',
      link: '/chat/new',
    },
    { 
      title: 'Train Model', 
      icon: <Zap className="h-5 w-5" />, 
      description: 'Create a new AI model from your documents',
      link: '/models/new',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="mt-1 text-gray-600">
          Here's an overview of your AI Document Chat workspace.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                stats.documents
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Total documents uploaded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">AI Models</CardTitle>
            <Zap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                stats.models
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Trained AI models</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                stats.chats
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Chat sessions started</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Storage Used</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                stats.storage
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Of your storage quota</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions and recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="block">
                <Card className="h-full transition-all hover:shadow-md hover:border-indigo-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        {action.icon}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mt-4">{action.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Recent activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <Link to="/activity" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((item) => (
                  <li key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {item.type === 'chat' && <MessageCircle className="h-5 w-5 text-blue-500" />}
                        {item.type === 'upload' && <FileText className="h-5 w-5 text-green-500" />}
                        {item.type === 'model' && <Zap className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 