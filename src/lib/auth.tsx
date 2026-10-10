import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { recoveryLinkAtStartup, supabase } from '@/lib/supabase';

const clearRecoveryUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('recovery');
  url.hash = '';
  window.history.replaceState(null, document.title, url.pathname + url.search);
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  passwordRecovery: boolean;
  clearPasswordRecovery: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, inviteCode: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(recoveryLinkAtStartup);

  useEffect(() => {
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      if (event === 'PASSWORD_RECOVERY' || (recoveryLinkAtStartup && newSession)) {
        // A recovery redirect can emit SIGNED_IN after URL detection; the startup
        // marker preserves the intent if that event races with getSession().
        setPasswordRecovery(true);
        clearRecoveryUrl();
      } else if (event === 'SIGNED_OUT' && !recoveryLinkAtStartup) {
        setPasswordRecovery(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;

      setSession(data.session);
      setLoading(false);

      // The recovery marker is captured before the Supabase client initializes.
      // Only an established session can enter the password form.
      if (recoveryLinkAtStartup && data.session) {
        setPasswordRecovery(true);
        clearRecoveryUrl();
      }
    }).catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return { error: error?.message ?? null };
    } catch {
      return { error: 'Não foi possível conectar. Confira sua conexão e tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string, inviteCode: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), password,
        options: { data: { invite_code: inviteCode.trim() } },
      });
      return { error: error ? 'Não foi possível criar a conta. Confira o convite e o e-mail; se persistir, procure o proprietário.' : null };
    } catch {
      return { error: 'Não foi possível conectar. Tente novamente em alguns minutos.' };
    }
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
        clearPasswordRecovery: () => {
          clearRecoveryUrl();
          setPasswordRecovery(false);
        },
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

