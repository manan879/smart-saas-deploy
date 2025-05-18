
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadInvoiceButton } from '@/components/InvoicePdfGenerator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

// Define the invoice data type
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

type Invoice = {
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
  items: any;
  tax_rate: number;
  notes: string;
};

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading, user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoice details from Supabase
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setInvoice(data);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        setError(err.message || 'Failed to fetch invoice');
        toast.error(`Error loading invoice: ${err.message || 'Unknown error'}`);
      }
    };

    fetchInvoice();
  }, [id, user]);

  const parseInvoiceItems = (items: any): InvoiceItem[] => {
    if (!items) return [];
    
    try {
      if (typeof items === 'string') {
        items = JSON.parse(items);
      }
      
      return Array.isArray(items) ? items.map(item => ({
        id: item.id || '',
        description: item.description || '',
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0
      })) : [];
    } catch (e) {
      console.error("Error parsing invoice items:", e);
      return [];
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/auth" />;
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invoice Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested invoice does not exist.</p>
            <Link to="/invoice-history">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoice History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return <div className="flex items-center justify-center h-screen">Loading invoice...</div>;
  }

  const invoiceData: InvoiceData = {
    invoiceNumber: invoice?.invoice_number || '',
    invoiceDate: invoice?.invoice_date || '',
    dueDate: invoice?.due_date || '',
    companyName: invoice?.company_name || '',
    companyAddress: invoice?.company_address || '',
    companyEmail: invoice?.company_email || '',
    companyPhone: invoice?.company_phone || '',
    clientName: invoice?.client_name || '',
    clientAddress: invoice?.client_address || '',
    clientEmail: invoice?.client_email || '',
    clientPhone: invoice?.client_phone || '',
    items: parseInvoiceItems(invoice?.items),
    taxRate: Number(invoice?.tax_rate) || 0,
    notes: invoice?.notes || ''
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice Details</h1>
            <p className="text-gray-500">View and manage your invoice details</p>
          </div>
          <DownloadInvoiceButton invoiceData={invoiceData} />
        </div>

        <Card className="border-billflow-500">
          <CardHeader className="bg-billflow-500 text-white">
            <CardTitle>Invoice #{invoice.invoice_number}</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Company Information</h2>
                    <p>Name: {invoice.company_name}</p>
                    <p>Address: {invoice.company_address}</p>
                    <p>Email: {invoice.company_email}</p>
                    <p>Phone: {invoice.company_phone}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Client Information</h2>
                    <p>Name: {invoice.client_name}</p>
                    <p>Address: {invoice.client_address}</p>
                    <p>Email: {invoice.client_email}</p>
                    <p>Phone: {invoice.client_phone}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
                  <p>Invoice Date: {format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
                  <p>Due Date: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Items</h2>
                  <ul>
                    {parseInvoiceItems(invoice.items).map((item) => (
                      <li key={item.id} className="mb-2">
                        {item.description} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Notes</h2>
                  <p>{invoice.notes || 'No notes provided.'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetail;
