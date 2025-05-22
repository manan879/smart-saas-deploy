
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
      
      // If user signs out, redirect to home page
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate('/');
      }
    });

    // If user is already authenticated on component mount, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAuthenticated]);

  // Component doesn't render anything
  return null;
};

export default AuthRedirectHandler;
