import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { InvoicePdfGenerator } from '@/components/InvoicePdfGenerator';
import { toast } from 'sonner';
import { ArrowLeft, Printer, Download, FileText, Edit, File } from 'lucide-react';
import { getUserPlan } from '@/utils/subscriptionUtils';
import { useQuery } from '@tanstack/react-query';

type Invoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  client_name: string;
  client_email: string;
  client_address: string;
  client_phone: string;
  line_items: any[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total_amount: number;
  notes: string;
  terms: string;
  user_id: string;
  created_at: string;
};

const InvoiceDetail = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Invoice Detail | BillFlow`;
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

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError('Invoice ID is missing.');
        setLoadingInvoice(false);
        return;
      }
      
      try {
        setLoadingInvoice(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError('Invoice not found.');
          return;
        }
        
        setInvoice(data);
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        setError(err.message || 'Failed to fetch invoice');
        toast.error(`Error loading invoice: ${err.message || 'Unknown error'}`);
      } finally {
        setLoadingInvoice(false);
      }
    };
    
    fetchInvoice();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/auth" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
            <p className="text-red-500">{error}</p>
            <Link to="/invoice-history">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoice History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {loadingInvoice ? (
          <div className="flex items-center justify-center h-48">
            <p>Loading invoice details...</p>
          </div>
        ) : invoice ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h1>
                <p className="text-gray-500">
                  Created on {new Date(invoice.invoice_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-600">Current Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</p>
              </div>
              
              <div className="space-x-2">
                <Link to={`/create-invoice?invoiceId=${invoice.id}`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                </Link>
                <InvoicePdfGenerator invoiceData={invoice}>
                  <Button>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </InvoicePdfGenerator>
                <InvoicePdfGenerator invoiceData={invoice}>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </InvoicePdfGenerator>
                <Link to="/invoice-history">
                  <Button variant="ghost">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to History
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>View the details of this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                    <p><strong>Name:</strong> {invoice.client_name}</p>
                    <p><strong>Email:</strong> {invoice.client_email}</p>
                    <p><strong>Phone:</strong> {invoice.client_phone}</p>
                    <p><strong>Address:</strong> {invoice.client_address}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Invoice Summary</h3>
                    <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                    <p><strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}</p>
                    <p><strong>Tax ({invoice.tax_rate}%):</strong> ${invoice.tax_amount.toFixed(2)}</p>
                    <p><strong>Discount ({invoice.discount_rate}%):</strong> -${invoice.discount_amount.toFixed(2)}</p>
                    <h4 className="text-xl font-bold mt-2">Total: ${invoice.total_amount.toFixed(2)}</h4>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Line Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.line_items && invoice.line_items.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{item.description}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">${item.price.toFixed(2)}</td>
                            <td className="text-right py-2">${(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                  <p>{invoice.notes || 'No notes provided.'}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
                  <p>{invoice.terms || 'No terms and conditions provided.'}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p>Invoice not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
