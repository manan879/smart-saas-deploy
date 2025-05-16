
import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Invoice item type
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const CreateInvoice = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Invoice details state
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().substring(6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Due in 30 days by default
    return date.toISOString().split('T')[0];
  });
  
  // Company information
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  
  // Client information
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  // Items, tax rate, and notes
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uuidv4(), description: '', quantity: 1, price: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Add a new item to the invoice
  const addItem = () => {
    setItems([...items, { id: uuidv4(), description: '', quantity: 1, price: 0 }]);
  };
  
  // Remove an item from the invoice
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast.error('Invoice must have at least one item');
    }
  };
  
  // Update an item's property
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };
  
  // Calculate tax amount
  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (taxRate / 100);
  };
  
  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally send the data to our backend via Supabase
    // For now, let's just show a success message
    toast.success('Invoice created successfully!');
    
    // You could add PDF generation and download here
    // For now, we'll just navigate back to the dashboard
    setTimeout(() => navigate('/dashboard'), 1500);
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create New Invoice</h1>
            <p className="text-gray-500">Fill out the form below to create a new invoice</p>
          </div>
          <div className="space-x-2">
            <Link to="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="invoice-form">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input 
                    id="invoiceNumber" 
                    value={invoiceNumber} 
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input 
                      id="invoiceDate" 
                      type="date" 
                      value={invoiceDate} 
                      onChange={(e) => setInvoiceDate(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Bill From</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Address</Label>
                    <Input 
                      id="companyAddress" 
                      value={companyAddress} 
                      onChange={(e) => setCompanyAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input 
                        id="companyEmail" 
                        type="email" 
                        value={companyEmail} 
                        onChange={(e) => setCompanyEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Phone</Label>
                      <Input 
                        id="companyPhone" 
                        value={companyPhone} 
                        onChange={(e) => setCompanyPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Bill To</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input 
                      id="clientName" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">Address</Label>
                    <Input 
                      id="clientAddress" 
                      value={clientAddress} 
                      onChange={(e) => setClientAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input 
                        id="clientEmail" 
                        type="email" 
                        value={clientEmail} 
                        onChange={(e) => setClientEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input 
                        id="clientPhone" 
                        value={clientPhone} 
                        onChange={(e) => setClientPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Invoice Items</h3>
              
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>
                
                {/* Items */}
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <Input 
                        value={item.description} 
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                        placeholder="Item description" 
                        required 
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        min="1"
                        value={item.quantity} 
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                        required 
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.price} 
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} 
                        required 
                      />
                    </div>
                    <div className="col-span-1">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-right">
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                <div>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="mt-2"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              
              {/* Totals */}
              <div className="mt-8 border-t pt-4">
                <div className="flex justify-end space-y-2">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Tax Rate (%):</span>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate} 
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
                        className="w-20 ml-2" 
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes"
                placeholder="Payment terms, delivery information, etc."
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Link to="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-billflow-600 hover:bg-billflow-700">
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
