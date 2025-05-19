
import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { ClientManagement } from '@/components/ClientManagement';
import { InvoiceTemplates } from '@/components/InvoiceTemplates';
import { DataExport } from '@/components/DataExport';
import { PlanLimitChecker } from '@/components/PlanLimitChecker';
import { getUserPlan } from '@/utils/subscriptionUtils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard | BillFlow';
  }, []);

  // Get user's plan
  const { data: userPlan = 'free' } = useQuery({
    queryKey: ['userPlan', user?.id],
    queryFn: async () => {
      if (!user) return 'free';
      return getUserPlan(user.id);
    },
    enabled: !!user
  });

  // Get recent invoices
  const { data: recentInvoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['recentInvoices', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/auth" />;
  }

  return (
    <PlanLimitChecker>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-sm text-blue-600">Current Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <Link to="/create-invoice">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </Link>
              
              <InvoiceTemplates />
              <DataExport />
              <ClientManagement />
            </div>
          </div>
          
          {/* Dashboard Stats */}
          <DashboardStats />
          
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Manage your recently created invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInvoices ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="mt-2">Loading invoices...</p>
                </div>
              ) : recentInvoices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <p className="mb-4">You don't have any invoices yet.</p>
                  <Link to="/create-invoice">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Invoice #</th>
                        <th className="text-left py-3 px-4">Client</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice: any) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{invoice.invoice_number}</td>
                          <td className="py-3 px-4">{invoice.client_name}</td>
                          <td className="py-3 px-4">
                            {new Date(invoice.invoice_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">${Number(invoice.total_amount).toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">
                            <Link to={`/invoice/${invoice.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {recentInvoices.length > 0 && (
                    <div className="pt-4 text-center">
                      <Link to="/invoice-history">
                        <Button variant="ghost">View All Invoices</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Testimonials/Reviews Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src="https://i.pravatar.cc/100?img=1" 
                        alt="Avatar" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=John+D&background=random";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">John Doe</h4>
                      <p className="text-sm text-gray-500">Small Business Owner</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700">"BillFlow has simplified our invoicing process tremendously. It's intuitive and saves us hours every month."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src="https://i.pravatar.cc/100?img=5" 
                        alt="Avatar" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=Sarah+J&background=random";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">Freelance Designer</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700">"I love how professional my invoices look now. My clients pay faster and the whole experience is seamless."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PlanLimitChecker>
  );
};

export default Dashboard;
