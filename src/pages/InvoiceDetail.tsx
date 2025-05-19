
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DownloadInvoiceButton } from '@/components/InvoicePdfGenerator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { getUserPlan } from '@/utils/subscriptionUtils';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

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
  subtotal: number;
  totalAmount: number;
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
  tax_amount: number;
  subtotal: number;
  total_amount: number;
  notes: string;
};

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch user plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;
      
      try {
        const plan = await getUserPlan(user.id);
        setUserPlan(plan);
      } catch (err) {
        console.error('Error fetching user plan:', err);
      }
    };
    
    fetchUserPlan();
  }, [user]);

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
          setEditedInvoice(data);
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

  const canEdit = userPlan === 'pro' || userPlan === 'elite';

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset to original
      setEditedInvoice(invoice);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedInvoice || !user || !id) return;
    
    try {
      setIsSaving(true);
      
      // Calculate new totals
      const items = parseInvoiceItems(editedInvoice.items);
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const taxAmount = subtotal * (Number(editedInvoice.tax_rate) / 100);
      const totalAmount = subtotal + taxAmount;
      
      const updatedInvoice = {
        ...editedInvoice,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('invoices')
        .update(updatedInvoice)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setInvoice(updatedInvoice);
      setEditedInvoice(updatedInvoice);
      setIsEditing(false);
      
      toast.success('Invoice updated successfully');
      
    } catch (err: any) {
      console.error('Error updating invoice:', err);
      toast.error(`Failed to update invoice: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Invoice deleted successfully');
      navigate('/invoice-history');
      
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      toast.error(`Failed to delete invoice: ${err.message || 'Unknown error'}`);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleItemChange = (itemId: string, field: string, value: any) => {
    if (!editedInvoice) return;
    
    const items = parseInvoiceItems(editedInvoice.items);
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    
    setEditedInvoice({
      ...editedInvoice,
      items: JSON.stringify(updatedItems)
    });
  };

  const handleAddItem = () => {
    if (!editedInvoice) return;
    
    const items = parseInvoiceItems(editedInvoice.items);
    const newItem = { id: uuidv4(), description: '', quantity: 1, price: 0 };
    
    setEditedInvoice({
      ...editedInvoice,
      items: JSON.stringify([...items, newItem])
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!editedInvoice) return;
    
    const items = parseInvoiceItems(editedInvoice.items);
    const filteredItems = items.filter(item => item.id !== itemId);
    
    setEditedInvoice({
      ...editedInvoice,
      items: JSON.stringify(filteredItems)
    });
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedInvoice) return;
    
    setEditedInvoice({
      ...editedInvoice,
      [field]: value
    });
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

  if (!invoice || !editedInvoice) {
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
    notes: invoice?.notes || '',
    subtotal: Number(invoice?.subtotal) || 0,
    totalAmount: Number(invoice?.total_amount) || 0
  };

  const currentItems = parseInvoiceItems(editedInvoice.items);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/invoice-history">
              <Button variant="outline" size="sm" className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Invoice Details</h1>
              <p className="text-gray-500">View and manage your invoice details</p>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && !isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEditToggle}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            
            {isEditing && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEditToggle}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </>
            )}
            
            <DownloadInvoiceButton invoiceData={invoiceData} />
            
            {canEdit && !isEditing && (
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Invoice</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this invoice? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center p-4 mt-2 bg-amber-50 border border-amber-200 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <p className="text-sm text-amber-800">This will permanently delete invoice #{invoice.invoice_number}.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteInvoice}>
                      Delete Invoice
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card className="border-blue-500">
          <CardHeader className="bg-blue-500 text-white">
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
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="company_name">Name</Label>
                          <Input 
                            id="company_name" 
                            value={editedInvoice.company_name} 
                            onChange={e => handleInputChange('company_name', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="company_address">Address</Label>
                          <Input 
                            id="company_address" 
                            value={editedInvoice.company_address || ''} 
                            onChange={e => handleInputChange('company_address', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="company_email">Email</Label>
                          <Input 
                            id="company_email" 
                            value={editedInvoice.company_email || ''} 
                            onChange={e => handleInputChange('company_email', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="company_phone">Phone</Label>
                          <Input 
                            id="company_phone" 
                            value={editedInvoice.company_phone || ''} 
                            onChange={e => handleInputChange('company_phone', e.target.value)} 
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>Name: {invoice.company_name}</p>
                        <p>Address: {invoice.company_address}</p>
                        <p>Email: {invoice.company_email}</p>
                        <p>Phone: {invoice.company_phone}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Client Information</h2>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="client_name">Name</Label>
                          <Input 
                            id="client_name" 
                            value={editedInvoice.client_name} 
                            onChange={e => handleInputChange('client_name', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="client_address">Address</Label>
                          <Input 
                            id="client_address" 
                            value={editedInvoice.client_address || ''} 
                            onChange={e => handleInputChange('client_address', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="client_email">Email</Label>
                          <Input 
                            id="client_email" 
                            value={editedInvoice.client_email || ''} 
                            onChange={e => handleInputChange('client_email', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="client_phone">Phone</Label>
                          <Input 
                            id="client_phone" 
                            value={editedInvoice.client_phone || ''} 
                            onChange={e => handleInputChange('client_phone', e.target.value)} 
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>Name: {invoice.client_name}</p>
                        <p>Address: {invoice.client_address}</p>
                        <p>Email: {invoice.client_email}</p>
                        <p>Phone: {invoice.client_phone}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoice_number">Invoice Number</Label>
                        <Input 
                          id="invoice_number" 
                          value={editedInvoice.invoice_number} 
                          onChange={e => handleInputChange('invoice_number', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="invoice_date">Invoice Date</Label>
                        <Input 
                          id="invoice_date" 
                          type="date"
                          value={editedInvoice.invoice_date} 
                          onChange={e => handleInputChange('invoice_date', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input 
                          id="due_date" 
                          type="date"
                          value={editedInvoice.due_date} 
                          onChange={e => handleInputChange('due_date', e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>Invoice Date: {format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
                      <p>Due Date: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Items</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Quantity</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                          {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {(isEditing ? currentItems : parseInvoiceItems(invoice.items)).map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-4 py-2">
                              {isEditing ? (
                                <Input 
                                  value={item.description} 
                                  onChange={e => handleItemChange(item.id, 'description', e.target.value)} 
                                />
                              ) : (
                                item.description
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  value={item.quantity} 
                                  onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} 
                                  className="w-20 ml-auto"
                                />
                              ) : (
                                item.quantity
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  value={item.price} 
                                  onChange={e => handleItemChange(item.id, 'price', Number(e.target.value))} 
                                  className="w-24 ml-auto"
                                />
                              ) : (
                                `$${item.price.toFixed(2)}`
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            {isEditing && (
                              <td className="px-4 py-2 text-right">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={currentItems.length <= 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {isEditing && (
                      <Button 
                        onClick={handleAddItem} 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Item
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span>Tax Rate:</span>
                          <Input 
                            type="number" 
                            value={editedInvoice.tax_rate || 0} 
                            onChange={e => handleInputChange('tax_rate', Number(e.target.value))} 
                            className="w-16 mx-2 h-7"
                          />
                          <span>%</span>
                        </div>
                      ) : (
                        `Tax (${invoice.tax_rate}%):`
                      )}
                    </span>
                    <span>${invoice.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${invoice.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Notes</h2>
                  {isEditing ? (
                    <Textarea 
                      value={editedInvoice.notes || ''} 
                      onChange={e => handleInputChange('notes', e.target.value)} 
                      className="h-24"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded">{invoice.notes || 'No notes provided.'}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2 bg-gray-50">
              <Button 
                variant="outline" 
                onClick={handleEditToggle}
              >
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetail;
