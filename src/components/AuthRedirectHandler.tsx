
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      // If user signs in, redirect to dashboard
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate('/dashboard');
      }
      
      // If user signs up (custom event handling)
      if (event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'email' && 
          new Date(session?.user?.created_at as string).getTime() > Date.now() - 60000) {
        console.log("User signed up, redirecting to create invoice");
        navigate('/create-invoice');
      }
      
      // If user signs out, redirect to home page
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate('/');
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Component doesn't render anything
  return null;
};

export default AuthRedirectHandler;
