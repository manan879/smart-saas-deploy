
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PLAN_LIMITS } from '@/utils/subscriptionUtils';

type InvoiceLimitWarningProps = {
  currentPlan: string;
  invoiceCount: number;
  remainingInvoices: number;
};

export const InvoiceLimitWarning = ({ currentPlan, invoiceCount, remainingInvoices }: InvoiceLimitWarningProps) => {
  const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];
  
  if (remainingInvoices <= 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invoice Limit Reached</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span>You've reached your limit of {planLimit} invoices for your {currentPlan} plan.</span>
          <Link to="/pricing">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Upgrade Plan
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (remainingInvoices <= 2) {
    return (
      <Alert className="mb-6 border-amber-500">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-500">Almost at Limit</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span>You have {remainingInvoices} invoice{remainingInvoices === 1 ? '' : 's'} remaining on your {currentPlan} plan.</span>
          <Link to="/pricing">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              View Plans
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
