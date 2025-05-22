
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const PricingFeature = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    <Check className="h-4 w-4 text-blue-500" />
    <span className="text-sm">{children}</span>
  </div>
);

const Pricing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe to a plan");
      navigate('/auth');
      return;
    }
    
    // In a real app, this would redirect to a payment processor
    toast.info(`This would connect to a payment gateway for the ${plan} plan. For now, consider yourself subscribed!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-3">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your invoicing needs. Upgrade anytime as your business grows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>For individuals just getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <PricingFeature>Create up to 10 invoices</PricingFeature>
              <PricingFeature>Basic invoice templates</PricingFeature>
              <PricingFeature>PDF downloads</PricingFeature>
              <PricingFeature>Email invoices</PricingFeature>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gray-500 hover:bg-gray-600"
                onClick={() => navigate('/auth')}
              >
                {isAuthenticated ? 'Current Plan' : 'Get Started Free'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-blue-300 shadow-md hover:shadow-xl transition-shadow duration-300 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">
              MOST POPULAR
            </div>
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>For small businesses</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <PricingFeature>Create up to 20 invoices</PricingFeature>
              <PricingFeature>Advanced invoice templates</PricingFeature>
              <PricingFeature>PDF downloads</PricingFeature>
              <PricingFeature>Email invoices</PricingFeature>
              <PricingFeature>Edit and modify invoices</PricingFeature>
              <PricingFeature>Invoice reminders</PricingFeature>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => handleSubscribe('pro')}
              >
                Subscribe to Pro
              </Button>
            </CardFooter>
          </Card>
          
          {/* Elite Plan */}
          <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Elite</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$50</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <PricingFeature>Create up to 50 invoices</PricingFeature>
              <PricingFeature>Premium invoice templates</PricingFeature>
              <PricingFeature>PDF downloads</PricingFeature>
              <PricingFeature>Email invoices</PricingFeature>
              <PricingFeature>Edit and modify invoices</PricingFeature>
              <PricingFeature>Invoice reminders</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Custom branding</PricingFeature>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => handleSubscribe('elite')}
              >
                Subscribe to Elite
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
