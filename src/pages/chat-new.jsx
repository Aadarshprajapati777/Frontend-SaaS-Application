import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/auth-utils';
import { ArrowLeft, Bot, MessageSquare, RefreshCw, Zap } from 'lucide-react';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from '../components/ui/use-toast';

/**
 * NewChatPage Component
 * 
 * Allows users to start a new conversation with an AI model
 */
export default function NewChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: _user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    initialMessage: '',
    modelId: '',
  });
  
  // Extract query params
  const searchParams = new URLSearchParams(location.search);
  const preSelectedModelId = searchParams.get('model');
  
  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        
        // In a real app, this would call an API
        // const response = await api.get('/models');
        // setModels(response.data);
        
        // For demo purposes, use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        setModels([
          {
            id: 'model-1',
            name: 'Customer Support Assistant',
            type: 'custom',
            description: 'Trained on company support documentation and FAQs',
          },
          {
            id: 'model-3',
            name: 'Technical Documentation Bot',
            type: 'custom',
            description: 'Answers questions from product manuals and technical specifications',
          },
          {
            id: 'gpt-3.5',
            name: 'GPT-3.5',
            type: 'system',
            description: 'General-purpose language model with strong capabilities across tasks',
          },
          {
            id: 'gpt-4',
            name: 'GPT-4',
            type: 'system',
            description: 'Advanced language model with enhanced reasoning abilities',
          },
          {
            id: 'model-2',
            name: 'Legal Document Analyzer',
            type: 'custom',
            description: 'Specialized in contract analysis and legal terminology',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available models. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Set pre-selected model if provided in URL
  useEffect(() => {
    if (preSelectedModelId && !formData.modelId) {
      setFormData(prev => ({ ...prev, modelId: preSelectedModelId }));
    }
  }, [preSelectedModelId, formData.modelId, models]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle model selection
  const handleModelSelect = (modelId) => {
    setFormData(prev => ({
      ...prev,
      modelId
    }));
  };
  
  // Get model color based on type
  const getModelTypeStyle = (type) => {
    return type === 'custom' 
      ? 'border-l-4 border-purple-500' 
      : 'border-l-4 border-indigo-500';
  };
  
  // Submit the new chat
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.initialMessage || !formData.modelId) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all fields to start a new chat.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to create the chat
      // const response = await api.post('/chats', formData);
      // const chatData = response.data;
      
      // Simulate API delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: 'Chat created',
        description: 'Your new chat has been created successfully.',
        variant: 'success',
      });
      
      // Redirect to the chat page
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast({
        title: 'Error creating chat',
        description: 'There was an error creating your chat. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/chat')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Conversations
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Conversation</h1>
            <p className="mt-1 text-gray-600">
              Start a new chat with one of your AI models
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Start Conversation</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Chat title (optional) */}
            <div className="space-y-2">
              <Label htmlFor="title">Conversation Title (Optional)</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="E.g., Product Questions"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Leave blank to auto-generate based on the conversation
              </p>
            </div>
            
            {/* Model selection */}
            <div className="space-y-2">
              <Label className="mb-3 block">
                Select AI Model <span className="text-red-500">*</span>
              </Label>
              
              {loadingModels ? (
                <div className="flex items-center justify-center py-6">
                  <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin mr-2" />
                  <p className="text-gray-600">Loading models...</p>
                </div>
              ) : (
                <RadioGroup
                  value={formData.modelId}
                  onValueChange={handleModelSelect}
                  className="space-y-3"
                >
                  {models.map((model) => (
                    <div 
                      key={model.id}
                      className={`
                        relative flex items-center rounded-md border p-3 
                        ${formData.modelId === model.id ? 'ring-2 ring-indigo-600' : 'hover:border-gray-400'} 
                        ${getModelTypeStyle(model.type)}
                      `}
                    >
                      <RadioGroupItem 
                        value={model.id} 
                        id={`model-${model.id}`}
                        className="absolute opacity-0"
                        disabled={isLoading}
                      />
                      <label 
                        htmlFor={`model-${model.id}`} 
                        className="flex flex-1 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <Bot className={`h-5 w-5 mr-3 ${model.type === 'custom' ? 'text-purple-600' : 'text-indigo-600'}`} />
                          <div>
                            <p className="font-medium">
                              {model.name}
                              <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                {model.type === 'custom' ? 'Custom' : 'System'}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">{model.description}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
            
            {/* Initial message */}
            <div className="space-y-2">
              <Label htmlFor="initialMessage">
                Initial Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="initialMessage"
                name="initialMessage"
                value={formData.initialMessage}
                onChange={handleInputChange}
                placeholder="What would you like to ask?"
                rows={5}
                disabled={isLoading}
                className="resize-none"
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/chat')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Starting Chat...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Conversation
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 