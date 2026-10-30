import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { PREVIEW_MODE, previewView } from '@/lib/preview';

export type UserRole = 'member' | 'companion' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  city: string | null;
  province: string | null;
  avatar_url: string | null;
  verification_status: VerificationStatus;
  interested_in: ('women' | 'men' | 'trans' | 'everyone')[] | null;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
  dob: string; // YYYY-MM-DD
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  isSubscribed: boolean;
  isCompanion: boolean;
  isAdmin: boolean;
  walletBalance: number;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (input: SignupInput) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadAccount = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setIsSubscribed(false);
      setWalletBalance(0);
      return;
    }
    const [p, s, w] = await Promise.all([
      supabase.from('profiles')
        .select('id, role, display_name, city, province, avatar_url, verification_status, interested_in')
        .eq('id', userId).maybeSingle(),
      supabase.from('subscriptions').select('status, current_period_end').eq('user_id', userId).maybeSingle(),
      supabase.from('wallets').select('balance_credits').eq('user_id', userId).maybeSingle(),
    ]);
    setProfile((p.data as Profile) ?? null);
    const sub = s.data;
    setIsSubscribed(
      !!sub && sub.status === 'active' &&
      (!sub.current_period_end || new Date(sub.current_period_end) > new Date()),
    );
    setWalletBalance(Number(w.data?.balance_credits ?? 0));
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadAccount(data.session?.user.id).catch(() => undefined);
      if (active) setLoading(false);
    }).catch(() => active && setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // defer to avoid deadlocking inside the auth callback
      setTimeout(() => { loadAccount(next?.user.id).catch(() => undefined); }, 0);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadAccount]);

  const login: AuthContextType['login'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signup: AuthContextType['signup'] = async ({ email, password, name, dob }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, dob },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) return { error: error.message };
    return { needsEmailConfirmation: !data.session };
  };

  const logout = async () => { await supabase.auth.signOut(); };
  const refresh = useCallback(() => loadAccount(session?.user.id), [loadAccount, session]);

  const value = useMemo<AuthContextType>(() => {
    const u = session?.user;
    // Temporary preview mode: no real session, show the full member/admin experience with sample data.
    if (PREVIEW_MODE && !u && previewView() === 'member') {
      return {
        user: { id: 'preview', email: 'preview@cumpani.fun', name: 'Preview' },
        profile: {
          id: 'preview', role: 'admin', display_name: 'Preview', city: null, province: null, avatar_url: null,
          verification_status: 'verified', interested_in: null,
        } as Profile,
        session: null, loading, isAuthenticated: true, isVerified: true, isSubscribed: true,
        isCompanion: true, isAdmin: true, walletBalance: 0, login, signup, logout, refresh,
      };
    }
    const admin = profile?.role === 'admin';
    return {
      user: u ? { id: u.id, email: u.email ?? '', name: profile?.display_name ?? u.email ?? '' } : null,
      profile,
      session,
      loading,
      isAuthenticated: !!u,
      isVerified: admin || profile?.verification_status === 'verified',
      isSubscribed: admin || isSubscribed,
      isCompanion: admin || profile?.role === 'companion',
      isAdmin: admin,
      walletBalance,
      login, signup, logout, refresh,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile, isSubscribed, walletBalance, loading, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
