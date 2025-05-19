
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type DashboardStats = {
  totalInvoices: number;
  paidInvoices: number;
  outstandingAmount: number;
};

export const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    paidInvoices: 0,
    outstandingAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all invoices for the user
        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (invoices) {
          // Calculate statistics
          const total = invoices.length;
          
          // For this example, we'll consider an invoice "paid" if the due date is in the past
          // In a real app, you might have a "status" field to track this
          const paid = invoices.filter(inv => new Date(inv.due_date) < new Date()).length;
          
          // Calculate total outstanding amount (for unpaid invoices)
          const outstanding = invoices
            .filter(inv => new Date(inv.due_date) >= new Date())
            .reduce((sum, inv) => sum + Number(inv.total_amount), 0);
          
          setStats({
            totalInvoices: total,
            paidInvoices: paid,
            outstandingAmount: outstanding
          });
        }
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalInvoices}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Outstanding Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${stats.outstandingAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Paid Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.paidInvoices}</div>
        </CardContent>
      </Card>
    </div>
  );
};
