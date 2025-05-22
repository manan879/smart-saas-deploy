
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type DashboardStats = {
  totalInvoices: number;
  paidInvoices: number;
  outstandingAmount: number;
};

export const DashboardStats = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          totalInvoices: 0,
          paidInvoices: 0,
          outstandingAmount: 0
        };
      }
      
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (!invoices || invoices.length === 0) {
        return {
          totalInvoices: 0,
          paidInvoices: 0,
          outstandingAmount: 0
        };
      }
      
      // Calculate statistics
      const total = invoices.length;
      
      // Consider an invoice "paid" if the due date is in the past
      const paid = invoices.filter(inv => new Date(inv.due_date) < new Date()).length;
      
      // Calculate total outstanding amount (for unpaid invoices)
      const outstanding = invoices
        .filter(inv => new Date(inv.due_date) >= new Date())
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0);
      
      return {
        totalInvoices: total,
        paidInvoices: paid,
        outstandingAmount: outstanding
      };
    },
    enabled: !!user
  });

  if (isLoading) {
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
          <div className="text-3xl font-bold">{stats?.totalInvoices || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Outstanding Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${(stats?.outstandingAmount || 0).toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Paid Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.paidInvoices || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};
