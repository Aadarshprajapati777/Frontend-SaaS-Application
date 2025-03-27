import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../components/ui/use-toast';
import { ArrowLeft, FileText, Paperclip, Plus, RefreshCw, Save, Terminal, Trash, Zap } from 'lucide-react';

/**
 * Create Model Page
 * 
 * Allows users to create and configure new AI models
 */
export default function CreateModelPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modelDetails, setModelDetails] = useState({
    name: '',
    description: '',
    baseModel: 'gpt-3.5',
    temperature: 0.7,
    maxLength: 1024,
    useSystemPrompt: true,
    systemPrompt: 'You are an AI assistant trained on specific documents. Answer questions based on the provided documents only.',
  });
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentTab, setCurrentTab] = useState('details');
  
  // Fetch available documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real app, this would call an API
        // const response = await api.get('/documents');
        // setAvailableDocuments(response.data);
        
        // For demo purposes, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock document data
        setAvailableDocuments([
          { id: 'doc-1', name: 'Annual Report 2023.pdf', type: 'pdf', uploadedAt: new Date().toISOString() },
          { id: 'doc-2', name: 'Product Specifications.docx', type: 'docx', uploadedAt: new Date().toISOString() },
          { id: 'doc-3', name: 'Meeting Notes September.txt', type: 'txt', uploadedAt: new Date().toISOString() },
          { id: 'doc-4', name: 'Customer Feedback Analysis.pdf', type: 'pdf', uploadedAt: new Date().toISOString() },
          { id: 'doc-5', name: 'Legal Contract Template.docx', type: 'docx', uploadedAt: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchDocuments();
  }, []);
  
  // Toggle document selection
  const toggleDocumentSelection = (document) => {
    setSelectedDocuments(prevSelected => {
      if (prevSelected.some(doc => doc.id === document.id)) {
        return prevSelected.filter(doc => doc.id !== document.id);
      } else {
        return [...prevSelected, document];
      }
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModelDetails(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name, checked) => {
    setModelDetails(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle slider changes
  const handleSliderChange = (name, value) => {
    setModelDetails(prev => ({ ...prev, [name]: value[0] }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setModelDetails(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!modelDetails.name.trim()) {
      errors.name = 'Model name is required';
    }
    
    if (selectedDocuments.length === 0) {
      errors.documents = 'At least one document must be selected';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show tab with errors
      if (validationErrors.name) {
        setCurrentTab('details');
      } else if (validationErrors.documents) {
        setCurrentTab('documents');
      }
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call an API
      // const payload = {
      //   ...modelDetails,
      //   documentIds: selectedDocuments.map(doc => doc.id),
      // };
      // const response = await api.post('/models', payload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success message
      toast({
        title: 'Model created',
        description: `${modelDetails.name} is now being trained. This may take a few minutes.`,
        variant: 'success',
      });
      
      // Redirect to models page
      navigate('/models');
    } catch (error) {
      console.error('Failed to create model:', error);
      toast({
        title: 'Error',
        description: 'Failed to create model. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
            onClick={() => navigate('/models')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Models
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Model</h1>
            <p className="mt-1 text-gray-600">
              Train a custom AI model on your documents
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="details">
                  Details
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  Advanced Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Model Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Model Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={modelDetails.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Customer Support Assistant"
                    disabled={isSubmitting}
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={modelDetails.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this model is for"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="baseModel">Base Model</Label>
                  <Select 
                    value={modelDetails.baseModel} 
                    onValueChange={(value) => handleSelectChange('baseModel', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="baseModel">
                      <SelectValue placeholder="Select a base model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5">GPT-3.5 (Fast, Efficient)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Advanced Reasoning)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    The foundation model that will be fine-tuned with your documents
                  </p>
                </div>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>
                      Selected Documents <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-sm text-gray-500">
                      {selectedDocuments.length} selected
                    </span>
                  </div>
                  
                  {validationErrors.documents && (
                    <p className="text-red-500 text-sm mb-4">{validationErrors.documents}</p>
                  )}
                  
                  <div className="border rounded-md divide-y">
                    {availableDocuments.length === 0 ? (
                      <div className="p-4 text-center">
                        <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-500">Loading documents...</p>
                      </div>
                    ) : (
                      availableDocuments.map(document => (
                        <div key={document.id} className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox
                              id={`doc-${document.id}`}
                              checked={selectedDocuments.some(doc => doc.id === document.id)}
                              onCheckedChange={() => toggleDocumentSelection(document)}
                              disabled={isSubmitting}
                              className="mr-3"
                            />
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-500 mr-2" />
                              <label 
                                htmlFor={`doc-${document.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {document.name}
                              </label>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {document.type}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to="/documents/upload">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload New Document
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Advanced Settings Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Temperature: {modelDetails.temperature.toFixed(1)}</Label>
                    </div>
                    <Slider
                      value={[modelDetails.temperature]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => handleSliderChange('temperature', value)}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>More deterministic</span>
                      <span>More creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Max Length: {modelDetails.maxLength}</Label>
                    </div>
                    <Slider
                      value={[modelDetails.maxLength]}
                      min={256}
                      max={4096}
                      step={256}
                      onValueChange={(value) => handleSliderChange('maxLength', value)}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Shorter responses</span>
                      <span>Longer responses</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useSystemPrompt"
                        checked={modelDetails.useSystemPrompt}
                        onCheckedChange={(checked) => handleCheckboxChange('useSystemPrompt', checked)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="useSystemPrompt">Use system prompt</Label>
                    </div>
                    
                    {modelDetails.useSystemPrompt && (
                      <div className="mt-2">
                        <Textarea
                          id="systemPrompt"
                          name="systemPrompt"
                          value={modelDetails.systemPrompt}
                          onChange={handleInputChange}
                          placeholder="System instructions for the model"
                          disabled={isSubmitting}
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Instructions that define how the model responds
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/models')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <div className="flex space-x-2">
              {currentTab !== 'details' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentTab(prev => {
                    if (prev === 'documents') return 'details';
                    if (prev === 'advanced') return 'documents';
                    return prev;
                  })}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              
              {currentTab !== 'advanced' ? (
                <Button
                  type="button"
                  onClick={() => setCurrentTab(prev => {
                    if (prev === 'details') return 'documents';
                    if (prev === 'documents') return 'advanced';
                    return prev;
                  })}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Create Model
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 