import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { FileText, Upload, X, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

/**
 * Document Upload Page
 * 
 * Allows users to upload new documents to the system
 */
export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handles file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadError(null);
    }
  };

  // Handles drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadError(null);
    }
  };

  // Prevents default drag behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clears selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validates form
  const validateForm = () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return false;
    }
    
    if (!fileName.trim()) {
      setUploadError('Please provide a name for the document');
      return false;
    }
    
    // Check file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds the maximum limit of 50MB');
      return false;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError('File type not supported. Please upload PDF, DOCX, or TXT files');
      return false;
    }
    
    setUploadError(null);
    return true;
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // In a real application, use FormData to send the file to the server
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', fileName);
      formData.append('description', description);
      
      if (tags.trim()) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        tagArray.forEach(tag => formData.append('tags[]', tag));
      }
      
      // Simulate file upload with progress
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 1;
          
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Simulate server processing
            setTimeout(() => {
              setUploadSuccess(true);
              setIsUploading(false);
              
              // Navigate back to documents page after successful upload
              setTimeout(() => {
                navigate('/documents');
              }, 2000);
            }, 1000);
          }
          
          setUploadProgress(progress);
        }, 300);
      };
      
      // In a production app, replace with actual API call:
      // const response = await api.post('/documents/upload', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(percentCompleted);
      //   }
      // });
      
      // Simulate server delay
      setTimeout(() => {
        simulateUpload();
      }, 500);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload document. Please try again.');
      setIsUploading(false);
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
            onClick={() => navigate('/documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Documents
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
            <p className="mt-1 text-gray-600">
              Upload a new document to your library
            </p>
          </div>
        </div>
      </div>

      {/* Upload form */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File upload area */}
            <div>
              <Label className="mb-2 block">Document File</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  selectedFile ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {!selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-700">
                        Drag and drop your file here, or{' '}
                        <span 
                          className="text-indigo-600 cursor-pointer hover:underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supported file types: PDF, DOCX, TXT (Max size: 50MB)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <FileText className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        <p className="font-medium text-gray-800">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-gray-500 hover:text-red-600"
                        onClick={handleClearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document name */}
            <div>
              <Label htmlFor="fileName">Document Name</Label>
              <Input
                id="fileName"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter document name"
                required
                className="mt-1"
                disabled={isUploading}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description of the document"
                className="mt-1 h-24"
                disabled={isUploading}
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter comma-separated tags (e.g., report, finance)"
                className="mt-1"
                disabled={isUploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Error message */}
            {uploadError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{uploadError}</p>
              </div>
            )}

            {/* Success message */}
            {uploadSuccess && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>Document uploaded successfully! Redirecting to documents page...</p>
              </div>
            )}

            {/* Upload progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/documents')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || uploadSuccess}
              className="flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 