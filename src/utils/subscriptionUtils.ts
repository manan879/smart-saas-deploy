
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
    const planLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
    
    // If invoice count is 0, always allow creating invoices
    if (invoiceCount === 0) return true;
    
    return invoiceCount < planLimit;
  } catch (error) {
    console.error('Error checking invoice limit:', error);
    return false;
  }
};

// Get remaining invoices user can create
export const getRemainingInvoices = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  try {
    // Get user's plan
    const plan = await getUserPlan(userId);
    const planLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
    
    // Get current invoice count
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // If user has no invoices yet, return the full plan limit
    const currentCount = count || 0;
    
    // Calculate remaining invoices
    return planLimit - currentCount;
  } catch (error) {
    console.error('Error calculating remaining invoices:', error);
    return 0;
  }
};

// Check if a user already has invoices
export const userHasInvoices = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking if user has invoices:', error);
    return false;
  }
};

// Update user's subscription plan
export const updateUserPlan = async (userId: string, plan: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // First check if the user already has a subscription
    const { data, error: fetchError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means not found, which is expected if user doesn't have a subscription yet
      throw fetchError;
    }
    
    if (data) {
      // Update existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ user_id: userId, plan, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user plan:', error);
    return false;
  }
};
