
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PLAN_LIMITS, getUserPlan } from '@/utils/subscriptionUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type PlanLimitCheckerProps = {
  children: React.ReactNode;
};

export const PlanLimitChecker = ({ children }: PlanLimitCheckerProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkLimits = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user's plan
        const plan = await getUserPlan(user.id);
        setUserPlan(plan);
        
        // Get invoice count
        const { count, error } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setInvoiceCount(count || 0);
        
        // Check if user has reached their plan limit
        const planLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
        if (count !== null && count >= planLimit) {
          setShowLimitDialog(true);
        }
        
      } catch (err) {
        console.error('Error checking plan limits:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkLimits();
  }, [user]);

  const handleUpgrade = () => {
    setShowLimitDialog(false);
    navigate('/pricing');
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Limit Reached</DialogTitle>
            <DialogDescription>
              You've reached your limit of {PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]} invoices for your {userPlan} plan.
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Upgrade your plan to create more invoices and unlock additional features.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLimitDialog(false)}>
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade}>
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
