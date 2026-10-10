import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const initialRecoveryParams =
  typeof window === 'undefined'
    ? null
    : new URLSearchParams(window.location.hash.replace(/^#/, ''));
const initialRecoveryAccessToken = initialRecoveryParams?.get('access_token') ?? null;
const initialRecoveryLink = initialRecoveryParams?.get('type') === 'recovery';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  passwordRecovery: boolean;
  clearPasswordRecovery: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search,
        );
      } else if (event === 'SIGNED_OUT') {
        setPasswordRecovery(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;

      setSession(data.session);
      setLoading(false);

      // The SDK may finish parsing the recovery URL before this component's
      // listener is registered. The captured token lets us recognize that
      // already-established session without trusting a stale URL or session.
      const sessionMatchesRecoveryLink =
        initialRecoveryLink &&
        initialRecoveryAccessToken &&
        data.session?.access_token === initialRecoveryAccessToken;

      if (sessionMatchesRecoveryLink) {
        setPasswordRecovery(true);
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        passwordRecovery,
        clearPasswordRecovery: () => setPasswordRecovery(false),
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
