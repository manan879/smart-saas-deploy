
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InvoiceDetailsFormProps {
  invoiceNumber: string;
  invoiceDate: string;
  setInvoiceDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
}

export const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  invoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          type="text"
          id="invoiceNumber"
          value={invoiceNumber}
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
  );
};
