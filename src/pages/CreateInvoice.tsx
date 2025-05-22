import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceLimitWarning } from '@/components/InvoiceLimitWarning';
import { getUserPlan, PLAN_LIMITS } from '@/utils/subscriptionUtils';
import { useQuery } from '@tanstack/react-query';

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

const CreateInvoice = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }]);
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

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${randomNumber}`;
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
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
      const totalAmount = calculateTotal();
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            user_id: user.id,
            invoice_number: invoiceNumber,
            invoice_date: invoiceDate,
            due_date: dueDate,
            client_name: clientName,
            client_email: clientEmail,
            line_items: lineItems,
            notes: notes,
            terms: terms,
            total_amount: totalAmount,
          },
        ]);

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
          remainingInvoices={planLimit - invoiceCount} 
        />
        
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    type="text"
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    type="date"
                    id="invoiceDate"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    type="email"
                    id="clientEmail"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Line Items</Label>
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <Input
                        type="text"
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                      <Input
                        type="number"
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                      <Input
                        type="number"
                        id={`unitPrice-${item.id}`}
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(item.id)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>

              <div>
                <p className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</p>
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
