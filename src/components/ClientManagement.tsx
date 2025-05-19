
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Client = {
  name: string;
  email: string | null;
  address: string | null;
  phone: string | null;
  invoiceCount: number;
};

export const ClientManagement = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!user || !open) return;
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('client_name, client_email, client_address, client_phone')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          // Process the data to get unique clients with counts
          const clientMap = new Map<string, Client>();
          
          data.forEach(invoice => {
            const name = invoice.client_name;
            if (clientMap.has(name)) {
              const client = clientMap.get(name)!;
              client.invoiceCount += 1;
            } else {
              clientMap.set(name, {
                name,
                email: invoice.client_email,
                address: invoice.client_address,
                phone: invoice.client_phone,
                invoiceCount: 1
              });
            }
          });
          
          setClients(Array.from(clientMap.values()));
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    
    fetchClients();
  }, [user, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-300">
          <Users className="w-4 h-4 mr-2" />
          Manage Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Client Management</DialogTitle>
          <DialogDescription>
            View and manage your client information.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Client List</TabsTrigger>
            <TabsTrigger value="stats">Client Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="max-h-[60vh] overflow-y-auto">
            {clients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No clients found. Create an invoice to add clients.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client) => (
                  <Card key={client.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Email:</strong> {client.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
                      <p><strong>Address:</strong> {client.address || 'N/A'}</p>
                      <p><strong>Invoices:</strong> {client.invoiceCount}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="stats">
            <div className="text-center py-8 text-gray-500">
              Client statistics will be available in a future update.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
