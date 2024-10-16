'use client';
import {Session, User} from '@supabase/supabase-js';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {supabaseClient} from '@/lib/supabase-client';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
});

export const AuthProvider = ({children}: AuthProviderProps) => {
  const supabase = supabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });
    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      },
    );
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);
  return (
    <AuthContext.Provider value={{user: user, session: session}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
