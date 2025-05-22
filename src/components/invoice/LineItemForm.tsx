
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

interface LineItemFormProps {
  lineItems: LineItem[];
  updateLineItem: (id: string, field: string, value: string | number) => void;
  removeLineItem: (id: string) => void;
  addLineItem: () => void;
}

export const LineItemForm: React.FC<LineItemFormProps> = ({
  lineItems,
  updateLineItem,
  removeLineItem,
  addLineItem,
}) => {
  return (
    <div>
      <Label>Line Items</Label>
      {lineItems.map((item) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor={`description-${item.id}`}>Description</Label>
            <Input
              type="text"
              id={`description-${item.id}`}
              value={item.description}
              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
            <Input
              type="number"
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
            <Input
              type="number"
              id={`unitPrice-${item.id}`}
              value={item.unitPrice}
              onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(item.id)}>
              <Trash className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={addLineItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Line Item
      </Button>
    </div>
  );
};
