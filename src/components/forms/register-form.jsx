import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { isValidEmail, getErrorMessage } from '../../lib/utils';

// Business plans data
const businessPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '49',
    features: [
      'Up to 5 team members',
      '100 document uploads',
      'Basic monitoring',
      '5 custom AI models',
      'Standard support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '99',
    features: [
      'Up to 15 team members',
      '500 document uploads',
      'Advanced monitoring',
      '15 custom AI models',
      'Priority support',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '249',
    features: [
      'Unlimited team members',
      'Unlimited document uploads',
      'Advanced monitoring & analytics',
      'Unlimited custom AI models',
      'Dedicated support',
      'API access with higher rate limits',
      'Custom integrations'
    ]
  }
];

// Industry options
const industryOptions = [
  { value: 'technology', label: 'Technology & IT' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'education', label: 'Education & Training' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting & Professional Services' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'nonprofit', label: 'Non-profit & NGO' },
  { value: 'other', label: 'Other' }
];

/**
 * RegisterForm Component
 * 
 * A form for user registration with validation
 */
export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'individual', // Default to individual
    businessName: '',
    businessSize: '',
    website: '', // New field for business website
    industry: '', // New field for business industry
    plan: 'starter', // Default business plan
    teamSize: '', // Estimated team size
    apiAccess: false, // Whether API access is needed
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, error, clearError } = useAuth();
  
  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear auth error when user types
    if (error) {
      clearError();
    }
  };

  // Handle radio button changes for user type
  const handleUserTypeChange = (e) => {
    const userType = e.target.value;
    setFormData((prev) => ({ ...prev, userType }));
    
    // Clear business-related errors if switching to individual
    if (userType === 'individual') {
      setValidationErrors((prev) => ({
        ...prev,
        businessName: '',
        businessSize: '',
        website: '',
        industry: '',
        plan: '',
        teamSize: ''
      }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Validate business fields if userType is 'business'
    if (formData.userType === 'business') {
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business name is required';
      }
      if (!formData.businessSize) {
        errors.businessSize = 'Business size is required';
      }
      if (formData.website && !formData.website.trim().startsWith('http')) {
        errors.website = 'Website must start with http:// or https://';
      }
      if (!formData.industry) {
        errors.industry = 'Please select your industry';
      }
      if (!formData.plan) {
        errors.plan = 'Please select a subscription plan';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Transform business size to backend format
  const mapBusinessSizeToBackendFormat = (sizeFrontend) => {
    const sizeMap = {
      '1-10': 'small',
      '11-50': 'small',
      '51-200': 'medium',
      '201-500': 'medium',
      '500+': 'large'
    };
    return sizeMap[sizeFrontend] || 'small';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a copy of the form data
      const userData = { ...formData };
      
      // If business type, map the size to backend format
      if (userData.userType === 'business' && userData.businessSize) {
        userData.businessSize = mapBusinessSizeToBackendFormat(userData.businessSize);
      }
      
      await register(userData);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration error:', getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-gray-600">
          Get started with AI Document Chat today!
        </p>
      </div>
      
      {/* Show auth error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={validationErrors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
            autoComplete="name"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={validationErrors.email ? "border-red-500" : ""}
            disabled={isSubmitting}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="•••••••••"
            className={validationErrors.password ? "border-red-500" : ""}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </span>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="individual"
                checked={formData.userType === 'individual'}
                onChange={handleUserTypeChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">Individual</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="business"
                checked={formData.userType === 'business'}
                onChange={handleUserTypeChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">Business</span>
            </label>
          </div>
        </div>
        
        {/* Business fields (conditional) */}
        {formData.userType === 'business' && (
          <>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className={validationErrors.businessName ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {validationErrors.businessName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.businessName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  validationErrors.industry ? "border-red-500" : "border-gray-300"
                } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                disabled={isSubmitting}
              >
                <option value="">Select your industry</option>
                {industryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {validationErrors.industry && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.industry}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website (optional)
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                className={validationErrors.website ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {validationErrors.website && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="businessSize" className="block text-sm font-medium text-gray-700 mb-1">
                Business Size
              </label>
              <select
                id="businessSize"
                name="businessSize"
                value={formData.businessSize}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  validationErrors.businessSize ? "border-red-500" : "border-gray-300"
                } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                disabled={isSubmitting}
              >
                <option value="">Select business size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
              {validationErrors.businessSize && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.businessSize}</p>
              )}
            </div>
            
            {/* Team size estimate */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Team Size (who will use the platform)
              </label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                disabled={isSubmitting}
              >
                <option value="">Select team size</option>
                <option value="1-5">1-5 members</option>
                <option value="6-15">6-15 members</option>
                <option value="16-30">16-30 members</option>
                <option value="31+">31+ members</option>
              </select>
            </div>
            
            {/* API access checkbox */}
            <div className="flex items-center">
              <input
                id="apiAccess"
                name="apiAccess"
                type="checkbox"
                checked={formData.apiAccess}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
              <label htmlFor="apiAccess" className="ml-2 block text-sm text-gray-700">
                I'll need API access for integration with our systems
              </label>
            </div>
            
            {/* Subscription plans */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subscription Plan
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {businessPlans.map((plan) => (
                  <div key={plan.id} className="relative">
                    <input
                      type="radio"
                      id={plan.id}
                      name="plan"
                      value={plan.id}
                      checked={formData.plan === plan.id}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={plan.id}
                      className={`flex flex-col h-full p-4 border rounded-lg cursor-pointer ${
                        formData.plan === plan.id
                          ? "border-indigo-500 ring-2 ring-indigo-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                      <span className="mt-1 flex items-baseline">
                        <span className="text-lg font-semibold text-gray-900">${plan.price}</span>
                        <span className="ml-1 text-sm text-gray-500">/mo</span>
                      </span>
                      <ul className="mt-4 space-y-2 text-xs text-gray-500">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-4 w-4 text-green-500 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
} 