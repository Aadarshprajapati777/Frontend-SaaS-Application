import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Plus, Search, Filter, SortAsc, SortDesc, RefreshCw, AlertTriangle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { formatDate } from '../lib/utils';

/**
 * Documents Page
 * 
 * Displays a list of uploaded documents and provides functionality 
 * to search, filter, and manage documents
 */
export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('uploadedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Wrap documents sample data in useMemo to prevent recreation on each render
  const mockDocuments = useMemo(() => [
    {
      id: 'doc-1',
      name: 'Annual Report 2023.pdf',
      type: 'pdf',
      size: 2500000,
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      tags: ['report', 'finance']
    },
    {
      id: 'doc-2',
      name: 'Product Specifications.docx',
      type: 'docx',
      size: 1200000,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      tags: ['product', 'specifications']
    },
    {
      id: 'doc-3',
      name: 'Meeting Notes September.txt',
      type: 'txt',
      size: 45000,
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      tags: ['meeting', 'notes']
    },
    {
      id: 'doc-4',
      name: 'Customer Feedback Analysis.pdf',
      type: 'pdf',
      size: 1850000,
      uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      tags: ['customer', 'feedback', 'analysis']
    },
    {
      id: 'doc-5',
      name: 'Legal Contract Template.docx',
      type: 'docx',
      size: 980000,
      uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'processing',
      tags: ['legal', 'contract']
    }
  ], []); // Empty dependency array means this is created only once

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // In a production app, this would call an API
        // const response = await api.get('/documents');
        // setDocuments(response.data);
        
        // For demo purposes, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocuments(mockDocuments);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setError('Failed to load documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [mockDocuments]);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Change sort field
  const changeSortBy = (field) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'size') {
        return sortDirection === 'asc' 
          ? a.size - b.size
          : b.size - a.size;
      } else {
        // Default sort by date
        return sortDirection === 'asc' 
          ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
          : new Date(b.uploadedAt) - new Date(a.uploadedAt);
      }
    });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="mt-1 text-gray-600">
              Upload and manage your documents
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/documents/upload">
                <Plus className="h-5 w-5 mr-2" />
                Upload Document
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => changeSortBy('name')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Name
              </Button>
              <Button variant="outline" onClick={() => changeSortBy('date')}>
                <SortDesc className="h-4 w-4 mr-2" />
                Date
              </Button>
              <Button variant="outline" onClick={() => changeSortBy('size')}>
                <Filter className="h-4 w-4 mr-2" />
                Size
              </Button>
            </div>
          </div>

          {/* Document list */}
          {loading ? (
            <div className="flex justify-center py-10">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load documents</h3>
              <p className="text-gray-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedDocuments.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
              {searchQuery ? (
                <p className="text-gray-500">Try adjusting your search query</p>
              ) : (
                <p className="text-gray-500">Upload your first document to get started</p>
              )}
              {!searchQuery && (
                <Button 
                  className="mt-4"
                  asChild
                >
                  <Link to="/documents/upload">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(doc.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(doc.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          doc.status === 'processed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'processed' ? 'Processed' : 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-900"
                          asChild
                        >
                          <Link to={`/documents/${doc.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 