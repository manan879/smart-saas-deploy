
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceLimitWarning } from '@/components/InvoiceLimitWarning';
import { getUserPlan, PLAN_LIMITS, getRemainingInvoices } from '@/utils/subscriptionUtils';
import { useQuery } from '@tanstack/react-query';
import { LineItemForm, LineItem } from '@/components/invoice/LineItemForm';
import { ClientInfoForm } from '@/components/invoice/ClientInfoForm';
import { InvoiceDetailsForm } from '@/components/invoice/InvoiceDetailsForm';
import { InvoiceNotesForm } from '@/components/invoice/InvoiceNotesForm';
import { generateInvoiceNumber, calculateTotal, createEmptyLineItem } from '@/utils/invoiceUtils';

const CreateInvoice = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([createEmptyLineItem()]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [invoiceCount, setInvoiceCount] = useState(0);
  
  // Get user's plan
  const { data: userPlan = 'free' } = useQuery({
    queryKey: ['userPlan', user?.id],
    queryFn: async () => {
      if (!user) return 'free';
      return getUserPlan(user.id);
    },
    enabled: !!user
  });
  
  // Get remaining invoices
  const { data: remainingInvoices = 0 } = useQuery({
    queryKey: ['remainingInvoices', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return getRemainingInvoices(user.id);
    },
    enabled: !!user
  });
  
  const planLimit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS];

  useEffect(() => {
    document.title = 'Create Invoice | BillFlow';
    if (!isAuthenticated && !loading) {
      navigate('/auth');
    }

    // Generate a unique invoice number
    setInvoiceNumber(generateInvoiceNumber());
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date().toISOString().split('T')[0]);
    
    const fetchInvoiceCount = async () => {
      if (!user) return;
      
      try {
        const { count, error } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) throw error;
        setInvoiceCount(count || 0);
      } catch (error) {
        console.error('Error fetching invoice count:', error);
        toast.error('Failed to load invoice count.');
      }
    };
    
    fetchInvoiceCount();
  }, [isAuthenticated, loading, navigate, user]);

  const addLineItem = () => {
    setLineItems([...lineItems, createEmptyLineItem()]);
  };

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create an invoice.');
      return;
    }
    
    if (invoiceCount >= planLimit) {
      toast.error(`You have reached your invoice limit for the ${userPlan} plan. Please upgrade to create more invoices.`);
      return;
    }

    try {
      const totalAmount = calculateTotal(lineItems);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          due_date: dueDate,
          client_name: clientName,
          client_email: clientEmail,
          items: lineItems, // Storing as JSONB in the database
          notes: notes,
          total_amount: totalAmount,
        });

      if (error) {
        console.error('Error creating invoice:', error);
        toast.error('Failed to create invoice. Please try again.');
        return;
      }

      toast.success('Invoice created successfully!');
      navigate('/invoice-history');
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Failed to create invoice. Please try again.');
    }
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
        <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
        
        <InvoiceLimitWarning 
          currentPlan={userPlan} 
          invoiceCount={invoiceCount} 
          remainingInvoices={remainingInvoices} 
        />
        
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <InvoiceDetailsForm
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
                setInvoiceDate={setInvoiceDate}
                dueDate={dueDate}
                setDueDate={setDueDate}
              />

              <ClientInfoForm
                clientName={clientName}
                setClientName={setClientName}
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
              />

              <LineItemForm
                lineItems={lineItems}
                updateLineItem={updateLineItem}
                removeLineItem={removeLineItem}
                addLineItem={addLineItem}
              />

              <InvoiceNotesForm
                notes={notes}
                setNotes={setNotes}
                terms={terms}
                setTerms={setTerms}
              />

              <div>
                <p className="text-xl font-bold">Total: ${calculateTotal(lineItems).toFixed(2)}</p>
              </div>

              <Button type="submit" className="bg-billflow-600 hover:bg-billflow-700">
                Create Invoice
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
