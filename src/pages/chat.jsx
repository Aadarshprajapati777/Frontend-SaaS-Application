import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatDate } from '../lib/utils';
import { 
  MessageSquare, Plus, Search, RefreshCw, AlertTriangle, 
  Bot, Calendar, Clock, Trash2, MoreHorizontal, Star, StarOff, 
  Calendar as CalendarIcon, ArrowUpDown, Copy
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { toast } from '../components/ui/use-toast';

/**
 * ChatListPage Component
 * 
 * Displays a list of user's previous chat conversations
 */
export default function ChatListPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // Mock chat data wrapped in useMemo to prevent recreation on each render
  const mockChats = useMemo(() => [
    {
      id: 'chat-1',
      title: 'Product Development Discussion',
      model: 'Customer Support Assistant',
      modelId: 'model-1',
      modelType: 'custom',
      lastMessage: 'Based on the specifications, I recommend focusing on the core features first.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      messageCount: 24,
      isFavorite: true,
    },
    {
      id: 'chat-2',
      title: 'Annual Report Analysis',
      model: 'GPT-4',
      modelId: 'gpt-4',
      modelType: 'system',
      lastMessage: 'The financial results show a 15% increase in revenue compared to last year.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      messageCount: 18,
      isFavorite: false,
    },
    {
      id: 'chat-3',
      title: 'Customer Feedback Summary',
      model: 'Technical Documentation Bot',
      modelId: 'model-3',
      modelType: 'custom',
      lastMessage: 'The most common issue reported by customers relates to the checkout process.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      messageCount: 12,
      isFavorite: true,
    },
    {
      id: 'chat-4',
      title: 'Meeting Notes from September 15',
      model: 'GPT-3.5',
      modelId: 'gpt-3.5',
      modelType: 'system',
      lastMessage: 'The team agreed to postpone the product launch until Q1 next year.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      messageCount: 8,
      isFavorite: false,
    },
    {
      id: 'chat-5',
      title: 'Legal Contract Review',
      model: 'Legal Document Analyzer',
      modelId: 'model-2',
      modelType: 'custom',
      lastMessage: 'Clause 3.4 contains ambiguous language that should be clarified before signing.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      messageCount: 15,
      isFavorite: false,
    },
  ], []);
  
  // Fetch chats data
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would make an API call to fetch chats
        // const response = await api.get('/chats');
        // const data = response.data;
        
        // Simulate API delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setChats(mockChats);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError('Failed to load chats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [mockChats]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle favorite status
  const toggleFavorite = (chatId) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, isFavorite: !chat.isFavorite } : chat
      )
    );
    
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      toast({
        title: chat.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: `"${chat.title}" has been ${chat.isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };
  
  // Delete chat
  const deleteChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    // Optimistically remove the chat from the UI
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    toast({
      title: 'Chat deleted',
      description: `"${chat.title}" has been deleted.`,
    });
    
    // In a real app, you would call the API to delete the chat
    // try {
    //   await api.delete(`/chats/${chatId}`);
    // } catch (error) {
    //   // If the API call fails, add the chat back
    //   setChats(prevChats => [...prevChats, chat]);
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to delete chat. Please try again.',
    //     variant: 'destructive',
    //   });
    // }
  };
  
  // Change sort order
  const changeSortBy = (value) => {
    setSortBy(value);
  };
  
  // Get model badge style
  const getModelBadgeStyle = (modelType) => {
    return modelType === 'custom' 
      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
      : 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  };
  
  // Sort and filter chats
  const filteredAndSortedChats = chats
    .filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortBy === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'z-a') {
        return b.title.localeCompare(a.title);
      } else if (sortBy === 'favorites') {
        return b.isFavorite - a.isFavorite;
      }
      return 0;
    });
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
            <p className="mt-1 text-gray-600">
              View and manage your chat conversations
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/chat/new">
                <Plus className="h-5 w-5 mr-2" />
                New Conversation
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex whitespace-nowrap">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortBy === 'recent' && 'Most Recent'}
              {sortBy === 'oldest' && 'Oldest First'}
              {sortBy === 'a-z' && 'A to Z'}
              {sortBy === 'z-a' && 'Z to A'}
              {sortBy === 'favorites' && 'Favorites First'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeSortBy('recent')}>
              Most Recent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeSortBy('oldest')}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeSortBy('a-z')}>
              A to Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeSortBy('z-a')}>
              Z to A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeSortBy('favorites')}>
              Favorites First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chat list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="text-center">
            <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load conversations</h3>
          <p className="text-gray-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredAndSortedChats.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations found</h3>
          {searchQuery ? (
            <p className="text-gray-500 mb-4">Try adjusting your search query</p>
          ) : (
            <>
              <p className="text-gray-500 mb-4">Start a new conversation to get help from your AI models</p>
              <Button asChild>
                <Link to="/chat/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Start a Conversation
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedChats.map((chat) => (
            <Card key={chat.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-1 text-gray-500 hover:text-amber-500"
                      onClick={() => toggleFavorite(chat.id)}
                      title={chat.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {chat.isFavorite ? (
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                    <Link to={`/chat/${chat.id}`} className="hover:underline">
                      <CardTitle className="text-lg">{chat.title}</CardTitle>
                    </Link>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/chat/${chat.id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Continue Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFavorite(chat.id)}>
                        {chat.isFavorite ? (
                          <>
                            <StarOff className="h-4 w-4 mr-2" />
                            Remove from Favorites
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Bot className="h-4 w-4 mr-1" />
                    <Link to={`/models/${chat.modelId}`} className="mr-2">
                      <Badge variant="outline" className={getModelBadgeStyle(chat.modelType)}>
                        {chat.model}
                      </Badge>
                    </Link>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-2">{formatDate(chat.updatedAt)}</span>
                    <span className="mx-2">•</span>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{chat.messageCount} messages</span>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-1">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      <Link to={`/chat/${chat.id}`}>
                        Continue conversation
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 