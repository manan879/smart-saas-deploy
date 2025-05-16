
import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Replace with your actual Supabase URL and anon key
// These would typically come from environment variables
const supabaseUrl = 'https://hcnzobkudvosqfzwwegg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbnpvYmt1ZHZvc3FmendlZ2ciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY2ODUzODI0MSwic3ViIjoiZTUzMmQ0ZmYtNWE1Yy00NWI5LTkxNmMtMWYyOGM2ZmNjNzc4In0.sFaG7o0CDJa31r1jw1c_nMVefSiWCyzaUl2JsJVP_G0';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Authentication error. Please try again.');
      }
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      }
      
      setLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      toast.success('Sign-up successful! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      supabase,
      signIn,
      signUp,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
