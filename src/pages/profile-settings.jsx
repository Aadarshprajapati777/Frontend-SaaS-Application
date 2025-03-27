import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Camera, CheckCircle, RefreshCw, Save } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

/**
 * ProfileSettingsPage Component
 * 
 * Allows users to view and update their profile settings
 */
export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    company: user?.company || '',
    role: user?.role || 'developer',
    timezone: user?.timezone || 'UTC',
    emailNotifications: user?.emailNotifications ?? true,
  });
  
  // Used in the avatar upload logic (currently commented out in handleSubmit)
  const [_avatarFile, set_AvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  
  // Initialize form with user data when it's available
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        role: user.role || 'developer',
        timezone: user.timezone || 'UTC',
        emailNotifications: user.emailNotifications ?? true,
      });
      
      setAvatarPreview(user.avatarUrl || '');
    }
  }, [user]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle switch changes
  const handleSwitchChange = (name, checked) => {
    setProfileForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      set_AvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real app, you would upload the avatar if changed
      // let avatarUrl = user?.avatarUrl;
      // if (avatarFile) {
      //   const formData = new FormData();
      //   formData.append('avatar', avatarFile);
      //   const response = await api.post('/users/avatar', formData);
      //   avatarUrl = response.data.url;
      // }
      
      // Then update the user profile with all data
      // const payload = {
      //   ...profileForm,
      //   avatarUrl,
      // };
      // await api.put('/users/profile', payload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profileForm.name) return 'U';
    
    const nameParts = profileForm.name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };
  
  // List of timezones (simplified for demo)
  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
        </div>
      </div>
      
      {/* Profile form */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="text-lg bg-indigo-100 text-indigo-800">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Profile Photo</p>
                <p className="text-sm text-gray-500">
                  This will be displayed on your profile and in chat conversations
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={loading}
                    />
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        set_AvatarFile(null);
                        setAvatarPreview('');
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      disabled={loading}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  Contact support to change your email address
                </p>
              </div>
              
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleInputChange}
                  placeholder="A brief description about yourself"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Work info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company or Organization</Label>
                <Input
                  id="company"
                  name="company"
                  value={profileForm.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={profileForm.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                  disabled={loading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="customer_support">Customer Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profileForm.timezone}
                  onValueChange={(value) => handleSelectChange('timezone', value)}
                  disabled={loading}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications and updates via email
                  </p>
                </div>
                <Switch
                  checked={profileForm.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-3 border-t">
            <div className="flex justify-end ml-auto">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 