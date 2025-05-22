
import { supabase } from "@/integrations/supabase/client";

// Maximum number of invoices allowed per plan
export const PLAN_LIMITS = {
  free: 5,
  pro: 20,
  elite: 50
};

// Pricing information for each plan
export const PLAN_PRICING = {
  free: 0,
  pro: 19,
  elite: 50
};

// Get user subscription plan
export const getUserPlan = async (userId: string): Promise<string> => {
  if (!userId) return 'free';
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data?.plan || 'free';
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return 'free';
  }
};

// Check if user can create more invoices
export const canCreateMoreInvoices = async (userId: string, invoiceCount: number): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const plan = await getUserPlan(userId);
    return invoiceCount < PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  } catch (error) {
    console.error('Error checking invoice limit:', error);
    return false;
  }
};

// Update user's subscription plan
export const updateUserPlan = async (userId: string, plan: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ plan, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user plan:', error);
    return false;
  }
};
