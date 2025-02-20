import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, recordLogin } from '../supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session && session.user) {
        const flagKey = `loginRecorded-${session.user.id}`;
        if (!sessionStorage.getItem(flagKey) && session.user.email) {
          recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV)
            .catch((error) => {
              console.error('Failed to record login:', error);
            });
          sessionStorage.setItem(flagKey, 'true');
        }
      }
    });

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        const flagKey = `loginRecorded-${session.user.id}`;
        if (!sessionStorage.getItem(flagKey) && session.user.email) {
          recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV)
            .catch((error) => {
              console.error('Failed to record login:', error);
            });
          sessionStorage.setItem(flagKey, 'true');
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}