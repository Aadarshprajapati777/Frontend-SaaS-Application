import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/auth-utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Key, Plus, Trash2, Copy, MessageSquare, Link, RefreshCw, Eye, EyeOff, 
  Clock, AlertTriangle, FileCode, Shield, Globe, Code, Database, Bot, ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * API Keys & Integration Page
 * 
 * Allows business users to manage API keys, view integration options,
 * and access embedding code for chat widgets
 */
export default function ApiKeysPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState([]);
  const [showSecret, setShowSecret] = useState({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermission, setNewKeyPermission] = useState('read');
  const [newKeyExpiration, setNewKeyExpiration] = useState('30days');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('keys');
  const [embedCode, setEmbedCode] = useState('');

  // Mock API key data
  const mockApiKeys = useMemo(() => [
    {
      id: 'pk_1a2b3c4d5e6f',
      name: 'Production API Key',
      prefix: 'pk_1a2b',
      secret: '••••••••••••••••••••••••••••••',
      fullSecret: 'sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s',
      permission: 'full',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      expiresAt: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(), // 305 days from now
      status: 'active'
    },
    {
      id: 'pk_7g8h9i0j1k2l',
      name: 'Chat Widget Key',
      prefix: 'pk_7g8h',
      secret: '••••••••••••••••••••••••••••••',
      fullSecret: 'sk_7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
      permission: 'limited',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(), // 335 days from now
      status: 'active'
    },
    {
      id: 'pk_3m4n5o6p7q8r',
      name: 'Test Environment',
      prefix: 'pk_3m4n',
      secret: '••••••••••••••••••••••••••••••',
      fullSecret: 'sk_3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g',
      permission: 'read',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      expiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(), // 320 days from now
      status: 'active'
    }
  ], []);

  // The widget embed code sample
  const widgetEmbedCode = `<!-- AI Document Chat Widget -->
<script type="text/javascript">
  (function(w, d, s, o) {
    const j = d.createElement(s);
    j.async = true;
    j.src = 'https://cdn.ai-document-chat.com/widget.js';
    j.onload = function() {
      w.AiDocChat.init({
        selector: '#ai-doc-chat-widget',
        apiKey: '${apiKeys[1]?.prefix || 'YOUR_API_KEY'}',
        theme: 'light',
        models: ['gpt-3.5', 'gpt-4'],
        defaultModel: 'gpt-3.5',
        businessId: '${user?.businessId || 'YOUR_BUSINESS_ID'}',
      });
    };
    d.getElementsByTagName('head')[0].appendChild(j);
  })(window, document, 'script');
</script>
<div id="ai-doc-chat-widget"></div>
`;

  // REST API example code
  const restApiExample = `import axios from 'axios';

// Make a request to get document information
const getDocumentInfo = async (documentId) => {
  try {
    const response = await axios.get(
      \`https://api.ai-document-chat.com/v1/documents/\${documentId}\`,
      {
        headers: {
          'Authorization': 'Bearer ${apiKeys[0]?.prefix || 'YOUR_API_KEY'}',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Create a chat completion
const createChatCompletion = async (modelId, messages) => {
  try {
    const response = await axios.post(
      'https://api.ai-document-chat.com/v1/chat/completions',
      {
        model: modelId,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': 'Bearer ${apiKeys[0]?.prefix || 'YOUR_API_KEY'}',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating chat completion:', error);
    throw error;
  }
};`;


  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        // In a production app, this would use the real API
        // const response = await apiKeysAPI.getApiKeys();
        // setApiKeys(response.data);
        
        // For now, simulate API delay with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setApiKeys(mockApiKeys);
        
        // Set the embed code
        setEmbedCode(widgetEmbedCode);
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
        setError('Failed to load API keys. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, [user, mockApiKeys, widgetEmbedCode]);

  // Toggle showing secret key
  const toggleShowSecret = (keyId) => {
    setShowSecret(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // Copy to clipboard
  const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text).then(() => {
      // In a real app, show a toast notification
      console.log(message);
      alert(message);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Create a new API key
  const handleCreateKey = async (e) => {
    e.preventDefault();
    
    if (!newKeyName.trim()) {
      return;
    }
    
    try {
      setIsCreatingKey(true);
      
      // In a production app, this would call the real API
      // const response = await apiService.createApiKey({
      //   name: newKeyName,
      //   permission: newKeyPermission,
      //   expiration: newKeyExpiration
      // });
      
      // For demo purposes, add the new key to the local state
      const expirationDays = {
        '30days': 30,
        '90days': 90,
        '180days': 180,
        '365days': 365
      };
      
      const randomPrefix = 'pk_' + Math.random().toString(36).substring(2, 6);
      const randomSecret = 'sk_' + Math.random().toString(36).substring(2, 30);
      
      const newKey = {
        id: randomPrefix,
        name: newKeyName,
        prefix: randomPrefix,
        secret: '••••••••••••••••••••••••••••••',
        fullSecret: randomSecret,
        permission: newKeyPermission,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        expiresAt: new Date(Date.now() + expirationDays[newKeyExpiration] * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
      
      // Show the secret initially
      setShowSecret(prev => ({
        ...prev,
        [newKey.id]: true
      }));
      
      setApiKeys(prev => [newKey, ...prev]);
      setNewKeyName('');
      setNewKeyPermission('read');
      setNewKeyExpiration('30days');
      
      // In a real app, show success message with a toast notification
      console.log(`Created new API key: ${newKey.prefix}`);
      
      // Show the newly created key's secret
      setTimeout(() => {
        alert(`Your new API key: ${randomSecret}\n\nMake sure to copy this key now. You won't be able to see it again!`);
      }, 500);
      
    } catch (err) {
      console.error('Failed to create API key:', err);
      // Show error message
    } finally {
      setIsCreatingKey(false);
    }
  };

  // Revoke an API key
  const handleRevokeKey = async (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      try {
        // In a production app, call the API
        // await apiService.revokeApiKey(keyId);
        
        // Update local state
        setApiKeys(prev => 
          prev.map(key => 
            key.id === keyId 
              ? { ...key, status: 'revoked' } 
              : key
          )
        );
        
        // Show success message
        console.log(`Revoked API key ${keyId}`);
      } catch (err) {
        console.error('Failed to revoke API key:', err);
        // Show error message
      }
    }
  };

  // Format permission label
  const formatPermission = (permission) => {
    switch (permission) {
      case 'full':
        return 'Full Access';
      case 'limited':
        return 'Limited Access';
      case 'read':
        return 'Read Only';
      default:
        return permission;
    }
  };

  // Get permission badge color
  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'full':
        return 'bg-purple-100 text-purple-800';
      case 'limited':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="mb-4">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Loading API keys...</h3>
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
          <h3 className="text-lg font-medium text-gray-900">Error Loading API Keys</h3>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys & Integration</h1>
            <p className="mt-1 text-gray-600">
              Manage API keys and access integration options
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for different API resources */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="keys" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="widget" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat Widget
          </TabsTrigger>
          <TabsTrigger value="rest" className="flex items-center">
            <Code className="h-4 w-4 mr-2" />
            REST API
          </TabsTrigger>
        </TabsList>
        
        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-6">
          {/* API Keys Warning */}
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>API Key Security</AlertTitle>
            <AlertDescription>
              API keys provide access to your account. Keep them secure and never share them in public repositories or client-side code.
            </AlertDescription>
          </Alert>
          
          {/* Create API Key Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New API Key</CardTitle>
              <CardDescription>
                Create API keys to authenticate requests to the API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      required
                      disabled={isCreatingKey}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keyPermission">Permission</Label>
                    <Select 
                      value={newKeyPermission} 
                      onValueChange={setNewKeyPermission}
                      disabled={isCreatingKey}
                    >
                      <SelectTrigger id="keyPermission">
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read Only</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {newKeyPermission === 'read' && "Can only read data, no modifications"}
                      {newKeyPermission === 'limited' && "Can read data and use chat, no admin functions"}
                      {newKeyPermission === 'full' && "Full access to all API endpoints"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keyExpiration">Expiration</Label>
                    <Select 
                      value={newKeyExpiration} 
                      onValueChange={setNewKeyExpiration}
                      disabled={isCreatingKey}
                    >
                      <SelectTrigger id="keyExpiration">
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="180days">180 days</SelectItem>
                        <SelectItem value="365days">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim() || isCreatingKey}
                className="ml-auto"
              >
                {isCreatingKey ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* API Keys Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                {apiKeys.filter(k => k.status === 'active').length} active keys
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {showSecret[key.id] ? key.fullSecret : key.secret}
                          </code>
                          <button
                            onClick={() => toggleShowSecret(key.id)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            title={showSecret[key.id] ? "Hide key" : "Show key"}
                          >
                            {showSecret[key.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(
                              showSecret[key.id] ? key.fullSecret : key.prefix,
                              `Copied ${showSecret[key.id] ? 'full key' : 'key prefix'} to clipboard!`
                            )}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPermissionColor(key.permission)}`}>
                          {formatPermission(key.permission)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(key.expiresAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {key.status === 'active' && (
                          <Button
                            onClick={() => handleRevokeKey(key.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No API keys found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Chat Widget Tab */}
        <TabsContent value="widget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed Chat Widget</CardTitle>
              <CardDescription>
                Add our AI document chat widget to your website with a simple code snippet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium">Widget Preview</span>
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="bg-white p-4 h-64 flex flex-col">
                  <div className="flex-1">
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center p-6">
                        <MessageSquare className="h-12 w-12 text-indigo-100 mx-auto mb-4" />
                        <h3 className="text-gray-900 font-medium mb-1">Chat Widget</h3>
                        <p className="text-gray-500 text-sm">
                          Embed this widget on your website to provide document-based AI chat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="embedCode" className="text-base font-medium">
                    Embed Code
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(embedCode, 'Widget code copied to clipboard!')}
                    className="text-sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Code
                  </Button>
                </div>
                <Textarea
                  id="embedCode"
                  value={embedCode}
                  readOnly
                  className="font-mono text-sm h-60"
                />
                <p className="text-sm text-gray-500">
                  Add this code to your website where you want the chat widget to appear.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium flex items-center text-blue-800">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Widget Configuration Options
                </h3>
                <div className="mt-3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="widgetTheme">Theme</Label>
                      <Select defaultValue="light">
                        <SelectTrigger id="widgetTheme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Theme</SelectItem>
                          <SelectItem value="dark">Dark Theme</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="widgetPosition">Position</Label>
                      <Select defaultValue="bottom-right">
                        <SelectTrigger id="widgetPosition">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="inline">Inline (Container)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="widgetAutoOpen" className="flex-1">Auto-open on page load</Label>
                        <Switch id="widgetAutoOpen" />
                      </div>
                      <p className="text-xs text-gray-500">
                        Open the chat widget automatically when the page loads.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="widgetCustomization" className="flex-1">Enable customization</Label>
                        <Switch id="widgetCustomization" defaultChecked />
                      </div>
                      <p className="text-xs text-gray-500">
                        Allow users to select different AI models.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
              <span className="text-sm text-gray-500">
                Using API Key: <code className="bg-gray-100 px-1 py-0.5 rounded">{apiKeys[1]?.prefix || 'No key available'}</code>
              </span>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
              >
                View Documentation
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* REST API Tab */}
        <TabsContent value="rest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>REST API Reference</CardTitle>
              <CardDescription>
                Use our REST API to integrate AI document chat capabilities into your applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Database className="h-4 w-4 mr-2 text-indigo-600" />
                      Documents API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <ul className="space-y-1">
                      <li className="text-gray-700">Upload documents</li>
                      <li className="text-gray-700">List documents</li>
                      <li className="text-gray-700">Update metadata</li>
                      <li className="text-gray-700">Delete documents</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-indigo-600" />
                      Models API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <ul className="space-y-1">
                      <li className="text-gray-700">Create models</li>
                      <li className="text-gray-700">Train custom models</li>
                      <li className="text-gray-700">Get model status</li>
                      <li className="text-gray-700">Delete models</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                      Chat API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <ul className="space-y-1">
                      <li className="text-gray-700">Send chat messages</li>
                      <li className="text-gray-700">Get completions</li>
                      <li className="text-gray-700">Stream responses</li>
                      <li className="text-gray-700">Get chat history</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="apiExample" className="text-base font-medium">
                    Example Code (JavaScript)
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(restApiExample, 'Example code copied to clipboard!')}
                    className="text-sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Code
                  </Button>
                </div>
                <Textarea
                  id="apiExample"
                  value={restApiExample}
                  readOnly
                  className="font-mono text-sm h-80"
                />
              </div>
              
              <div className="p-4 rounded-lg border border-indigo-100 bg-indigo-50">
                <h3 className="text-indigo-800 font-medium mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                  API Base URLs
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-indigo-800">Production:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-sm">https://api.ai-document-chat.com/v1</code>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-800">Sandbox:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-sm">https://sandbox-api.ai-document-chat.com/v1</code>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3 flex justify-end">
              <Button variant="outline" asChild>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Full API Documentation
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 