import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../components/ui/use-toast';
import { ArrowLeft, CreditCard, Download, RefreshCw, Wallet, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/auth-utils';

/**
 * BillingPage Component
 * 
 * Displays subscription plans, billing history, and payment methods
 */
export default function BillingPage() {
  const { user: _user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("subscription");
  const [billingData, setBillingData] = useState({
    subscription: null,
    invoices: [],
    paymentMethods: []
  });

  // Fetch billing data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would make API calls to fetch this data
        // const subscriptionData = await api.get('/billing/subscription');
        // const invoicesData = await api.get('/billing/invoices');
        // const paymentMethodsData = await api.get('/billing/payment-methods');
        
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setBillingData({
          subscription: {
            plan: 'professional',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            usage: {
              documentsProcessed: 45,
              documentsLimit: 100,
              storageUsed: 2.3,
              storageLimit: 10
            }
          },
          invoices: [
            {
              id: 'inv_123456',
              date: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000),
              amount: 49.99,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            },
            {
              id: 'inv_123455',
              date: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
              amount: 49.99,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            },
            {
              id: 'inv_123454',
              date: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
              amount: 49.99,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            }
          ],
          paymentMethods: [
            {
              id: 'pm_123456',
              type: 'card',
              brand: 'visa',
              last4: '4242',
              expMonth: 12,
              expYear: 2024,
              isDefault: true
            }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
        toast({
          title: 'Error loading billing information',
          description: 'Please try again later or contact support.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBillingData();
  }, []);
  
  // Format date to readable format
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate usage percentage
  const calculateUsagePercentage = (used, limit) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };
  
  // Determine color for usage bar
  const getUsageColor = (percentage) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Define subscription plans
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'For individuals starting with AI document processing',
      price: 19.99,
      priceId: 'price_basic_monthly',
      features: [
        '20 documents per month',
        '2GB storage',
        'Basic AI models',
        'Email support'
      ],
      isCurrent: billingData.subscription?.plan === 'basic'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For professionals with moderate document processing needs',
      price: 49.99,
      priceId: 'price_professional_monthly',
      features: [
        '100 documents per month',
        '10GB storage',
        'Advanced AI models',
        'Priority email support',
        'Document version history'
      ],
      isCurrent: billingData.subscription?.plan === 'professional',
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams and businesses with high-volume needs',
      price: 149.99,
      priceId: 'price_enterprise_monthly',
      features: [
        'Unlimited documents',
        '50GB storage',
        'All AI models including GPT-4',
        'Priority phone & email support',
        'Advanced analytics',
        'Team collaboration features',
        'API access'
      ],
      isCurrent: billingData.subscription?.plan === 'enterprise'
    }
  ];
  
  // Handle subscription change
  const handleChangePlan = async (planId) => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call to change the plan
      // await api.post('/billing/subscription', { planId });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the subscription in state
      setBillingData(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          plan: planId
        }
      }));
      
      // Success message
      toast({
        title: 'Subscription updated',
        description: `Your subscription has been updated to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to update subscription:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a new payment method
  const handleAddPaymentMethod = () => {
    // In a real app, this would open a Stripe Elements form or similar
    toast({
      title: 'Add payment method',
      description: 'This would open a Stripe Elements form in a real application.',
      variant: 'default',
    });
  };
  
  // Handle setting default payment method
  const handleSetDefaultPayment = async (paymentMethodId) => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call to set the default payment method
      // await api.post('/billing/payment-methods/default', { paymentMethodId });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payment methods in state
      setBillingData(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === paymentMethodId
        }))
      }));
      
      // Success message
      toast({
        title: 'Default payment method updated',
        description: 'Your default payment method has been updated.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to update payment method:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update payment method. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle removing a payment method
  const handleRemovePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call to remove the payment method
      // await api.delete(`/billing/payment-methods/${paymentMethodId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payment methods in state
      setBillingData(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(pm => pm.id !== paymentMethodId)
      }));
      
      // Success message
      toast({
        title: 'Payment method removed',
        description: 'Your payment method has been removed.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      toast({
        title: 'Removal failed',
        description: 'Failed to remove payment method. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            asChild
          >
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
            <p className="mt-1 text-gray-600">
              Manage your subscription plan, payment methods, and billing history
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        {/* Subscription tab */}
        <TabsContent value="subscription" className="space-y-6">
          {/* Current subscription */}
          {billingData.subscription && (
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Your current plan and usage details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {subscriptionPlans.find(p => p.id === billingData.subscription.plan)?.name || 'Unknown'} Plan
                    </h3>
                    <p className="text-sm text-gray-500">
                      Renews on {formatDate(billingData.subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <Badge 
                    variant={billingData.subscription.status === 'active' ? 'success' : 'destructive'}
                    className="capitalize"
                  >
                    {billingData.subscription.status}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Usage</h4>
                  
                  {/* Documents processed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p>Documents Processed</p>
                      <p className="font-medium">
                        {billingData.subscription.usage.documentsProcessed} / {billingData.subscription.usage.documentsLimit}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getUsageColor(calculateUsagePercentage(
                          billingData.subscription.usage.documentsProcessed,
                          billingData.subscription.usage.documentsLimit
                        ))}`} 
                        style={{ 
                          width: `${calculateUsagePercentage(
                            billingData.subscription.usage.documentsProcessed, 
                            billingData.subscription.usage.documentsLimit
                          )}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Storage used */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p>Storage Used</p>
                      <p className="font-medium">
                        {billingData.subscription.usage.storageUsed} GB / {billingData.subscription.usage.storageLimit} GB
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getUsageColor(calculateUsagePercentage(
                          billingData.subscription.usage.storageUsed,
                          billingData.subscription.usage.storageLimit
                        ))}`} 
                        style={{ 
                          width: `${calculateUsagePercentage(
                            billingData.subscription.usage.storageUsed, 
                            billingData.subscription.usage.storageLimit
                          )}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Available plans */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Plans</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-blue-500' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-blue-500 hover:bg-blue-600">Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.isCurrent ? (
                      <Button disabled className="w-full bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleChangePlan(plan.id)} 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : 'Switch to This Plan'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Payment Methods tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingData.paymentMethods.length > 0 ? (
                billingData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-4">
                        <CreditCard className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {method.brand} •••• {method.last4}
                          {method.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultPayment(method.id)}
                          disabled={loading}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        disabled={loading || (method.isDefault && billingData.paymentMethods.length > 1)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No payment methods</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't added any payment methods yet
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleAddPaymentMethod} 
                className="w-full mt-4"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingData.invoices.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billingData.invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(invoice.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={invoice.status === 'paid' ? 'success' : 'warning'}
                              className="capitalize"
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No invoices found</h3>
                  <p className="text-gray-500">
                    You don't have any invoices yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 