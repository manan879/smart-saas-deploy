
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const DataExport = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const exportData = async (format: 'json' | 'csv' | 'pdf') => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch all invoices for the user
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("No invoices to export");
        return;
      }
      
      let content: string;
      let filename: string;
      let type: string;
      
      // Format data based on export type
      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = `invoices_export_${new Date().toISOString().split('T')[0]}.json`;
        type = 'application/json';
      } else if (format === 'csv') {
        // Simple CSV conversion
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(invoice => 
          Object.values(invoice).map(val => 
            typeof val === 'object' ? JSON.stringify(val) : val
          ).join(',')
        );
        content = [headers, ...rows].join('\n');
        filename = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
        type = 'text/csv';
      } else {
        // For PDF, we'll just show a message that it's not implemented
        toast.info("PDF export will be available in a future update");
        setLoading(false);
        return;
      }
      
      // Create download link
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported invoices as ${format.toUpperCase()}`);
      
    } catch (err: any) {
      console.error('Error exporting data:', err);
      toast.error(`Export failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-300">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Your Invoice Data</DialogTitle>
          <DialogDescription>
            Choose a format to export your invoice data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => exportData('json')}
            className="flex flex-col items-center justify-center h-24 space-y-2"
          >
            <FileJson className="h-8 w-8" />
            <span>JSON</span>
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => exportData('csv')}
            className="flex flex-col items-center justify-center h-24 space-y-2"
          >
            <File className="h-8 w-8" />
            <span>CSV</span>
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => exportData('pdf')}
            className="flex flex-col items-center justify-center h-24 space-y-2"
          >
            <FileText className="h-8 w-8" />
            <span>PDF (All)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
