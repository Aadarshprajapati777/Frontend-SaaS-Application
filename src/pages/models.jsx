import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Bot, Plus, Search, RefreshCw, AlertTriangle, 
  Zap, Book, Clock, Settings, Brain, CheckCircle2 
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../lib/utils';

/**
 * Models Page
 * 
 * Displays available AI models and allows users to create new models
 */
export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Wrap model sample data in useMemo to prevent recreation on each render
  const mockModels = useMemo(() => [
    {
      id: 'model-1',
      name: 'Customer Support Assistant',
      description: 'Trained on company support documentation and FAQs',
      type: 'custom',
      status: 'active',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      documentCount: 15,
      accuracy: 0.92,
    },
    {
      id: 'model-2',
      name: 'Legal Document Analyzer',
      description: 'Specialized in contract analysis and legal terminology',
      type: 'custom',
      status: 'training',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: null,
      documentCount: 32,
      accuracy: null,
      trainingProgress: 65,
    },
    {
      id: 'model-3',
      name: 'Technical Documentation Bot',
      description: 'Answers questions from product manuals and technical specifications',
      type: 'custom',
      status: 'active',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      documentCount: 28,
      accuracy: 0.89,
    },
    {
      id: 'gpt-3.5',
      name: 'GPT-3.5',
      description: 'General-purpose language model with strong capabilities across a wide range of tasks',
      type: 'system',
      status: 'active',
      createdAt: null,
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      documentCount: null,
      accuracy: null,
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Advanced language model with enhanced reasoning and comprehension abilities',
      type: 'system',
      status: 'active',
      createdAt: null,
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      documentCount: null,
      accuracy: null,
    }
  ], []); // Empty dependency array means this is created only once

  // Fetch models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // In a production app, this would call an API
        // const response = await api.get('/models');
        // setModels(response.data);
        
        // For demo purposes, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setModels(mockModels);
      } catch (err) {
        console.error('Failed to fetch models:', err);
        setError('Failed to load models. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [mockModels]);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter models based on search query
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get model status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get model type color
  const getTypeColor = (type) => {
    return type === 'custom' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-indigo-100 text-indigo-800';
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Models</h1>
            <p className="mt-1 text-gray-600">
              Manage and create custom AI models for your documents
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/models/new">
                <Plus className="h-5 w-5 mr-2" />
                Create New Model
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search models..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Models grid */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="text-center">
            <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading models...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load models</h3>
          <p className="text-gray-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No models found</h3>
          {searchQuery ? (
            <p className="text-gray-500 mb-4">Try adjusting your search query</p>
          ) : (
            <>
              <p className="text-gray-500 mb-4">Create your first custom model to get started</p>
              <Button asChild>
                <Link to="/models/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Model
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="overflow-hidden">
              <div className={`h-2 ${model.type === 'custom' ? 'bg-purple-500' : 'bg-indigo-500'}`}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <div className="flex items-center">
                    <Badge 
                      variant="outline" 
                      className={`mr-2 ${getTypeColor(model.type)}`}
                    >
                      {model.type === 'custom' ? 'Custom' : 'System'}
                    </Badge>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status === 'active' ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                      ) : model.status === 'training' ? (
                        <><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Training</>
                      ) : (
                        model.status.charAt(0).toUpperCase() + model.status.slice(1)
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                
                {/* Model stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {model.type === 'custom' && (
                    <>
                      <div className="flex items-center">
                        <Book className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{model.documentCount} Documents</span>
                      </div>
                      {model.accuracy && (
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{(model.accuracy * 100).toFixed(0)}% Accuracy</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {model.createdAt && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Created {formatDate(model.createdAt, 'MMM d')}</span>
                    </div>
                  )}
                  
                  {model.lastUsed && (
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Last used {formatDate(model.lastUsed, 'MMM d')}</span>
                    </div>
                  )}
                </div>
                
                {/* Training progress */}
                {model.status === 'training' && model.trainingProgress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Training Progress</span>
                      <span>{model.trainingProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${model.trainingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="mt-6 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/chat/new?model=${model.id}`}>
                      <Bot className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                  
                  {model.type === 'custom' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/models/${model.id}`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 