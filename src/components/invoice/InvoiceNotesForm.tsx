
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InvoiceNotesFormProps {
  notes: string;
  setNotes: (value: string) => void;
  terms: string;
  setTerms: (value: string) => void;
}

export const InvoiceNotesForm: React.FC<InvoiceNotesFormProps> = ({
  notes,
  setNotes,
  terms,
  setTerms,
}) => {
  return (
    <>
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
    </>
  );
};
