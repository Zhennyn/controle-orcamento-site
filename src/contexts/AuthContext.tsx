
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserPlan = "free" | "premium";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan>("free");
  const navigate = useNavigate();

  // Check user subscription status with Stripe
  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {},
      });
      
      if (error) throw error;
      
      if (data?.premium) {
        setUserPlan('premium');
      } else {
        setUserPlan('free');
      }
    } catch (error: any) {
      console.error("Erro ao verificar assinatura:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check for premium status in user metadata
          const isPremium = session.user?.user_metadata?.premium === true;
          setUserPlan(isPremium ? 'premium' : 'free');
          
          // Also verify with Stripe to be sure
          try {
            await checkSubscription();
          } catch (error) {
            console.error("Erro ao verificar assinatura no login:", error);
          }
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check for premium status in user metadata
        const isPremium = session.user?.user_metadata?.premium === true;
        setUserPlan(isPremium ? 'premium' : 'free');
        
        // Also verify with Stripe
        try {
          await checkSubscription();
        } catch (error) {
          console.error("Erro ao verificar assinatura na inicialização:", error);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for payment success or cancel URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success("Pagamento processado com sucesso!");
      toast("Verificando status da assinatura...");
      checkSubscription().then(() => {
        // Remove the query parameter
        navigate('/dashboard', { replace: true });
      });
    } else if (paymentStatus === 'cancel') {
      toast("Pagamento cancelado", {
        description: "Você pode tentar novamente quando quiser."
      });
      // Remove the query parameter
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        // Check if user is premium
        const isPremium = data.user?.user_metadata?.premium === true;
        setUserPlan(isPremium ? 'premium' : 'free');
        
        // Verify with Stripe
        await checkSubscription();
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            premium: false
          },
        },
      });
      
      if (!error && data.user) {
        setUserPlan("free");
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const value = {
    user,
    session,
    loading,
    userPlan,
    setUserPlan,
    signIn,
    signUp,
    signOut,
    checkSubscription
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
