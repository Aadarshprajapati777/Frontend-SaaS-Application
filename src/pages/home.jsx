import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FileText, MessageCircle, Zap, Shield, Users, CreditCard } from 'lucide-react';

// Feature items for the landing page
const features = [
  {
    name: 'Document Management',
    description: 'Upload, organize, and search through your documents with ease.',
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
  },
  {
    name: 'AI-Powered Chat',
    description: 'Chat with your documents using advanced AI to extract insights and answer questions.',
    icon: <MessageCircle className="h-6 w-6 text-indigo-600" />,
  },
  {
    name: 'Custom AI Models',
    description: 'Train specialized AI models on your specific documents and knowledge domains.',
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
  },
  {
    name: 'Secure & Private',
    description: 'Enterprise-grade security keeps your sensitive documents and data protected.',
    icon: <Shield className="h-6 w-6 text-indigo-600" />,
  },
  {
    name: 'Team Collaboration',
    description: 'Share knowledge and insights with your team through collaborative workspaces.',
    icon: <Users className="h-6 w-6 text-indigo-600" />,
  },
  {
    name: 'Simple Pricing',
    description: 'Transparent, usage-based pricing with no hidden fees or long-term commitments.',
    icon: <CreditCard className="h-6 w-6 text-indigo-600" />,
  },
];

/**
 * Home / Landing Page Component
 */
export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-blue-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Chat with Your Documents Using Powerful AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Upload your documents, train custom AI models, and get instant insights through natural conversation. Transform how you interact with your documents.
              </p>
              <div className="mt-10 flex items-center gap-x-6 sm:justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/pricing" className="text-base font-semibold leading-7 text-gray-900">
                  View pricing <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1573164574001-518958d9baa2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                  alt="AI Document Chat Interface"
                  className="w-full h-auto object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/0"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="font-mono text-sm text-green-400">AI: How can I help you with these documents?</div>
                  <div className="mt-3 font-mono text-xs text-gray-300">Based on your uploaded financial reports, I can answer questions about quarterly trends, risk factors, or help you extract specific data.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to get insights from your documents
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines document management, AI training, and conversational interfaces
              to transform how you work with documents.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    {feature.icon}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to transform how you work with documents?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of users who are already saving time and uncovering insights with AI Document Chat.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link
                to="/demo"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                See live demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 