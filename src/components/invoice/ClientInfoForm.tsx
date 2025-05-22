
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientInfoFormProps {
  clientName: string;
  setClientName: (value: string) => void;
  clientEmail: string;
  setClientEmail: (value: string) => void;
}

export const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
}) => {
  return (
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
  );
};
