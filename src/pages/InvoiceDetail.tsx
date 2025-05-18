
import React, { useEffect, useState } from 'react';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { DownloadInvoiceButton } from '@/components/InvoicePdfGenerator';
import { ArrowLeft, Loader2, Trash } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  client_name: string;
  client_address: string;
  client_email: string;
  client_phone: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  created_at: string;
}

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('Invoice not found');
        }
        
        setInvoice(data as InvoiceData);
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        setError(err.message || 'Failed to fetch invoice details');
        toast.error(`Error: ${err.message || 'Failed to load invoice'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);

  // Function to delete the invoice
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Invoice deleted successfully');
      navigate('/invoice-history');
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      toast.error(`Failed to delete invoice: ${err.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Prepare invoice data for PDF
  const getInvoiceDataForPdf = () => {
    if (!invoice) return null;
    
    return {
      invoiceNumber: invoice.invoice_number,
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      companyName: invoice.company_name,
      companyAddress: invoice.company_address,
      companyEmail: invoice.company_email,
      companyPhone: invoice.company_phone,
      clientName: invoice.client_name,
      clientAddress: invoice.client_address,
      clientEmail: invoice.client_email,
      clientPhone: invoice.client_phone,
      items: invoice.items,
      taxRate: invoice.tax_rate,
      notes: invoice.notes
    };
  };

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
        <div className="mb-6">
          <Link to="/invoice-history" className="flex items-center text-gray-600 hover:text-billflow-600 mb-4">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Invoice History
          </Link>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-20">
              <Loader2 className="h-10 w-10 animate-spin text-billflow-600" />
            </div>
          ) : error ? (
            <Card className="w-full">
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardContent>
            </Card>
          ) : invoice ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h1>
                  <p className="text-gray-500">
                    Created: {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {getInvoiceDataForPdf() && (
                    <DownloadInvoiceButton invoiceData={getInvoiceDataForPdf()!} />
                  )}
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium">{invoice.company_name}</p>
                        <p className="text-sm">{invoice.company_address}</p>
                        <p className="text-sm">{invoice.company_email}</p>
                        <p className="text-sm">{invoice.company_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-sm">{invoice.client_address}</p>
                        <p className="text-sm">{invoice.client_email}</p>
                        <p className="text-sm">{invoice.client_phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Invoice Number</p>
                        <p>{invoice.invoice_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Invoice Date</p>
                        <p>{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-semibold">${Number(invoice.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${Number(invoice.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax ({invoice.tax_rate}%):</span>
                          <span>${Number(invoice.tax_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                          <span>Total:</span>
                          <span>${Number(invoice.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
