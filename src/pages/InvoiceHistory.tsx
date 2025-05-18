
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { File, ArrowRight, Loader2 } from 'lucide-react';

type Invoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  client_name: string;
  total_amount: number;
  created_at: string;
};

const InvoiceHistory = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetchingInvoices, setFetchingInvoices] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's invoices from Supabase
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        setFetchingInvoices(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setInvoices(data || []);
      } catch (err: any) {
        console.error('Error fetching invoices:', err);
        setError(err.message || 'Failed to fetch invoices');
        toast.error(`Error loading invoices: ${err.message || 'Unknown error'}`);
      } finally {
        setFetchingInvoices(false);
      }
    };
    
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice History</h1>
            <p className="text-gray-500">View and manage your past invoices</p>
          </div>
          <Link to="/create-invoice">
            <Button className="bg-billflow-600 hover:bg-billflow-700">Create New Invoice</Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingInvoices ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-billflow-600" />
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center p-8">
                <p className="mb-4">You haven't created any invoices yet.</p>
                <Link to="/create-invoice">
                  <Button>Create Your First Invoice</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{invoice.client_name}</TableCell>
                        <TableCell className="text-right">${Number(invoice.total_amount).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/invoice/${invoice.id}`}>
                              <Button variant="outline" size="sm">
                                View <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceHistory;
