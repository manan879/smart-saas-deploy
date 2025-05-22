
import { v4 as uuidv4 } from 'uuid';
import { LineItem } from '@/components/invoice/LineItemForm';

export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${randomNumber}`;
};

export const calculateTotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
};

export const createEmptyLineItem = (): LineItem => {
  return { id: uuidv4(), description: '', quantity: 1, unitPrice: 0 };
};
