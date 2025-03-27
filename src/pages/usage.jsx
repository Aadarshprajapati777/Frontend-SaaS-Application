import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FileText, MessageSquare, Bot, Database, RefreshCw,
  AlertTriangle, Clock, DownloadCloud
} from 'lucide-react';
import { format } from 'date-fns';

// Sample usage data (replace with API calls in production)
const generateMockData = (days, baseValue, variance) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return {
      date: format(date, 'MMM dd'),
      value: Math.max(0, baseValue + Math.floor(Math.random() * variance * 2) - variance)
    };
  });
};

// Usage model types for pie chart
const MODEL_TYPES = [
  { name: 'GPT-3.5', value: 45, color: '#0088FE' },
  { name: 'GPT-4', value: 30, color: '#00C49F' },
  { name: 'Claude', value: 15, color: '#FFBB28' },
  { name: 'Custom Model', value: 10, color: '#FF8042' }
];

/**
 * Usage Monitor Page
 * 
 * Displays usage statistics and limits for the business account
 * including document uploads, token usage, and API calls
 */
export default function UsageMonitorPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState(null);
  const [error, setError] = useState(null);
  
  // Generate mock usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // In production, fetch from API
        // const response = await api.getUsageStats(timeRange);
        // setUsageData(response.data);
        
        // Mock data for demonstration
        const dayCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        
        const mockUsageData = {
          documents: {
            total: 142,
            limit: 250,
            recent: generateMockData(dayCount, 5, 3)
          },
          tokens: {
            input: 250000,
            output: 150000,
            limit: 500000,
            recent: generateMockData(dayCount, 14000, 8000)
          },
          apiCalls: {
            total: 1892,
            limit: 5000,
            recent: generateMockData(dayCount, 60, 40)
          },
          models: {
            created: 3,
            limit: 5,
            usage: MODEL_TYPES
          }
        };
        
        setUsageData(mockUsageData);
      } catch (err) {
        console.error('Failed to fetch usage data:', err);
        setError('Failed to load usage statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsageData();
  }, [timeRange, user]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage of usage against limit
  const calculateUsagePercentage = (used, limit) => {
    const percentage = (used / limit) * 100;
    return Math.min(100, Math.round(percentage));
  };

  // Return JSX for a usage bar indicator
  const UsageBar = ({ used, limit, warningThreshold = 80, criticalThreshold = 95 }) => {
    const percentage = calculateUsagePercentage(used, limit);
    let barColor = 'bg-green-500';
    
    if (percentage >= criticalThreshold) {
      barColor = 'bg-red-500';
    } else if (percentage >= warningThreshold) {
      barColor = 'bg-yellow-500';
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span>{formatNumber(used)} used</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          Limit: {formatNumber(limit)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="mb-4">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Loading usage data...</h3>
          <p className="text-gray-500 mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="mb-4">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error Loading Data</h3>
          <p className="text-gray-500 mt-1 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usage Monitor</h1>
            <p className="mt-1 text-gray-600">
              Track your resource usage and limits
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setTimeRange('7d')}
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
            >
              7 Days
            </Button>
            <Button
              onClick={() => setTimeRange('30d')}
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
            >
              30 Days
            </Button>
            <Button
              onClick={() => setTimeRange('90d')}
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
            >
              90 Days
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Documents Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Documents</CardTitle>
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(usageData.documents.total)}</div>
            <UsageBar 
              used={usageData.documents.total} 
              limit={usageData.documents.limit} 
            />
          </CardContent>
        </Card>

        {/* Token Usage Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Tokens Used</CardTitle>
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(usageData.tokens.input + usageData.tokens.output)}</div>
            <UsageBar 
              used={usageData.tokens.input + usageData.tokens.output} 
              limit={usageData.tokens.limit} 
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Input: {formatNumber(usageData.tokens.input)}</span>
              <span>Output: {formatNumber(usageData.tokens.output)}</span>
            </div>
          </CardContent>
        </Card>

        {/* API Calls Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">API Calls</CardTitle>
              <Database className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(usageData.apiCalls.total)}</div>
            <UsageBar 
              used={usageData.apiCalls.total} 
              limit={usageData.apiCalls.limit} 
            />
          </CardContent>
        </Card>

        {/* Models Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">AI Models</CardTitle>
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usageData.models.created}</div>
            <UsageBar 
              used={usageData.models.created} 
              limit={usageData.models.limit} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Token Usage Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Token Usage Over Time</CardTitle>
            <CardDescription>Daily token consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usageData.tokens.recent}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickMargin={10}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Tokens']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Usage Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Model Usage Distribution</CardTitle>
            <CardDescription>Token usage by model type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData.models.usage}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {usageData.models.usage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Usage']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Documents and model interactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DownloadCloud className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-900">Document Upload</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2023_Financial_Report.pdf
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Jane Smith
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Today, 9:41 AM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    12,456
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-900">Chat Session</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Customer Service Model
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Michael Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Yesterday, 3:22 PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    8,721
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-900">Model Training</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Legal Document Analyzer
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.name || 'Business Owner'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Aug 12, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    45,290
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-900">API Integration</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Helpdesk System
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    API Key (Jane)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Aug 10, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3,129
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DownloadCloud className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-900">Document Upload</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Product_Manual_v2.docx
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Michael Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Aug 8, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    9,872
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center py-4 border-t border-gray-200">
            <Button variant="outline" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              View Full Activity Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Upgrade Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-medium text-gray-900">
              Need More Resources?
            </h3>
            <p className="text-gray-600 mt-1">
              Upgrade your plan to increase your usage limits and access advanced features.
            </p>
          </div>
          <Button>
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
} 