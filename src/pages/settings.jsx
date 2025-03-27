import React, { useState } from 'react';
import { useAuth } from '../context/auth-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { AlertCircle, CheckCircle, Copy, CreditCard, LogOut, Save, User, Shield, Bell, Key } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

/**
 * Settings Page
 * 
 * Allows users to manage their account settings, notifications, and billing
 */
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form states for different settings tabs
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || 'developer'
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enable2FA: user?.has2FA || false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    securityAlerts: true,
    usageReports: false,
    productNews: true
  });
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle security form changes
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle 2FA toggle
  const handleToggle2FA = (checked) => {
    setSecurityForm(prev => ({
      ...prev,
      enable2FA: checked
    }));
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (setting, checked) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };
  
  // Handle profile save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle security save
  const handleSecuritySave = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset password fields
      setSecurityForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Success
      toast({
        title: "Security settings updated",
        description: securityForm.newPassword 
          ? "Your password has been changed successfully." 
          : "Security settings have been updated.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to update security settings:", err);
      toast({
        title: "Update failed",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle notification settings save
  const handleNotificationSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to update notification settings:", err);
      toast({
        title: "Update failed",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };
  
  // Copy API key to clipboard
  const copyApiKey = () => {
    navigator.clipboard.writeText('sk_test_123456789abcdefghijklmno');
    toast({
      title: "API key copied",
      description: "API key has been copied to clipboard.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account preferences and settings
        </p>
      </div>
      
      {/* Settings tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSave}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company or Organization</Label>
                  <Input 
                    id="company" 
                    name="company"
                    value={profileForm.company}
                    onChange={handleProfileChange}
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={profileForm.role} 
                    onValueChange={(value) => setProfileForm(prev => ({...prev, role: value}))}
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
                
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Active
                    </Badge>
                    
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {user?.plan || 'Business'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                
                <Button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Security tab */}
        <TabsContent value="security">
          <Card>
            <form onSubmit={handleSecuritySave}>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    placeholder="Enter a new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-factor authentication</Label>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch 
                      id="2fa"
                      checked={securityForm.enable2FA}
                      onCheckedChange={handleToggle2FA}
                    />
                  </div>
                  
                  {securityForm.enable2FA && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                        <p className="text-sm text-amber-800">
                          After saving, you'll need to scan a QR code with your authenticator app.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex">
                    <Input 
                      id="apiKey" 
                      value="sk_test_123456789abcdefghijklmno"
                      disabled
                      type="password"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      className="ml-2" 
                      onClick={copyApiKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Used for API access. Keep this secure and never share it.
                  </p>
                </div>
                
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit"
                  className="ml-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Update security settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Notifications tab */}
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleNotificationSave}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive a weekly summary of your activity
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Security alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified about security events related to your account
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Usage reports</Label>
                      <p className="text-sm text-gray-500">
                        Receive monthly reports about your API usage and costs
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.usageReports}
                      onCheckedChange={(checked) => handleNotificationChange('usageReports', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Product news</Label>
                      <p className="text-sm text-gray-500">
                        Stay updated on new features and improvements
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.productNews}
                      onCheckedChange={(checked) => handleNotificationChange('productNews', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit"
                  className="ml-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Save notification preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Billing tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription plan and payment methods
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Plan</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-blue-900">Business Plan</h4>
                      <p className="text-sm text-blue-700">
                        $99/month • Renews on Nov 15, 2023
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  
                  <div className="mt-3 space-y-2 text-sm text-blue-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Unlimited document uploads</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Up to 10 custom AI models</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Team management features</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Priority support</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Change Plan</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                
                <div className="border rounded-md">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded mr-3">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
              
              {/* Billing History */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing History</h3>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3 text-sm font-medium grid grid-cols-4">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="p-3 grid grid-cols-4 text-sm">
                      <div>Oct 15, 2023</div>
                      <div>Business Plan - Monthly</div>
                      <div>$99.00</div>
                      <div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 grid grid-cols-4 text-sm">
                      <div>Sep 15, 2023</div>
                      <div>Business Plan - Monthly</div>
                      <div>$99.00</div>
                      <div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 grid grid-cols-4 text-sm">
                      <div>Aug 15, 2023</div>
                      <div>Business Plan - Monthly</div>
                      <div>$99.00</div>
                      <div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  View All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 