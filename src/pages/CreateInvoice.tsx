
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

const CreateInvoice = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ id: uuidv4(), description: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [invoiceCount, setInvoiceCount] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<string>('free');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }

    // Set default company name from user's email
    if (user?.email) {
      const domain = user.email.split('@')[1];
      setCompanyName(domain);
    }

    // Set default invoice date to today
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);

    // Generate a random invoice number
    setInvoiceNumber(generateInvoiceNumber());
    
    // Fetch user's invoice count and plan
    if (user) {
      fetchUserInvoiceCount();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserInvoiceCount = async () => {
    if (user) {
      try {
        // Fetch user's invoice count
        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setInvoiceCount(invoices?.length || 0);
        
        // Fetch user's plan (assuming you'll implement this later)
        // For now, default to free
        setUserPlan('free');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const generateInvoiceNumber = (): string => {
    const randomNumber = Math.floor(Math.random() * 10000);
    return `INV-${randomNumber.toString().padStart(4, '0')}`;
  };

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTaxRate(isNaN(value) ? 0 : value);
  };

  // Calculate subtotal and total whenever items or tax rate changes
  useEffect(() => {
    const calculatedSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setSubtotal(calculatedSubtotal);
    
    const taxAmount = calculatedSubtotal * (taxRate / 100);
    setTotalAmount(calculatedSubtotal + taxAmount);
  }, [items, taxRate]);

  const serializeInvoiceItems = (items: InvoiceItem[]) => {
    return JSON.stringify(items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price
    })));
  };

  const handleSaveInvoice = async () => {
    if (!user) {
      toast.error("You must be logged in to save an invoice");
      navigate('/auth');
      return;
    }

    // Check invoice limits based on plan
    const invoiceLimit = userPlan === 'free' ? 10 : userPlan === 'pro' ? 20 : 50;
    if (invoiceCount >= invoiceLimit) {
      toast.error(`You've reached your limit of ${invoiceLimit} invoices for your ${userPlan} plan. Please upgrade to create more.`);
      navigate('/pricing');
      return;
    }

    try {
      setSubmitting(true);
      
      // Calculate totals
      const taxAmount = subtotal * (taxRate / 100);
      
      // Create invoice object to save
      const invoiceData = {
        user_id: user.id,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: dueDate,
        company_name: companyName,
        company_address: companyAddress,
        company_email: companyEmail,
        company_phone: companyPhone,
        client_name: clientName,
        client_address: clientAddress,
        client_email: clientEmail,
        client_phone: clientPhone,
        items: serializeInvoiceItems(items),
        subtotal: subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes: notes
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData);
      
      if (error) {
        throw error;
      }
      
      toast.success("Invoice saved successfully!");
      setInvoiceCount(prevCount => prevCount + 1);
      
      // Clear form or redirect
      navigate('/invoice-history');
      
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      toast.error(`Error saving invoice: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // or a redirect, or an error message
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4">
        <Card className="border-blue-500">
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle>Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invoice Details */}
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  type="text"
                  id="invoiceNumber"
                  value={invoiceNumber}
                  className="border-blue-300"
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  type="date"
                  id="invoiceDate"
                  value={invoiceDate}
                  className="border-blue-300"
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  className="border-blue-300"
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {/* Company Details */}
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  type="text"
                  id="companyName"
                  value={companyName}
                  className="border-blue-300"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  type="text"
                  id="companyAddress"
                  value={companyAddress}
                  className="border-blue-300"
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  type="email"
                  id="companyEmail"
                  value={companyEmail}
                  className="border-blue-300"
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  type="tel"
                  id="companyPhone"
                  value={companyPhone}
                  className="border-blue-300"
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>

              {/* Client Details */}
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  type="text"
                  id="clientName"
                  value={clientName}
                  className="border-blue-300"
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Input
                  type="text"
                  id="clientAddress"
                  value={clientAddress}
                  className="border-blue-300"
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  type="email"
                  id="clientEmail"
                  value={clientEmail}
                  className="border-blue-300"
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Client Phone</Label>
                <Input
                  type="tel"
                  id="clientPhone"
                  value={clientPhone}
                  className="border-blue-300"
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center">
                  <div>
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      type="text"
                      id={`description-${item.id}`}
                      value={item.description}
                      className="border-blue-300"
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      className="border-blue-300"
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${item.id}`}>Price</Label>
                    <Input
                      type="number"
                      id={`price-${item.id}`}
                      value={item.price}
                      className="border-blue-300"
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="bg-blue-400 hover:bg-blue-500" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Subtotal, Tax Rate, Total and Notes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  type="text"
                  id="subtotal"
                  value={`$${subtotal.toFixed(2)}`}
                  className="border-blue-300 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  type="number"
                  id="taxRate"
                  value={taxRate}
                  className="border-blue-300"
                  onChange={handleTaxRateChange}
                />
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  type="text"
                  id="totalAmount"
                  value={`$${totalAmount.toFixed(2)}`}
                  className="border-blue-300 bg-gray-50 font-bold"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  className="border-blue-300"
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveInvoice}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Invoice'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
