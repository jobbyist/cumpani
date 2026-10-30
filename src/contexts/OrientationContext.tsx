import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type Interest = 'women' | 'men' | 'trans' | 'everyone';
export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'trans', label: 'Trans' },
];

const KEY = 'cumpani_interest_v1';

interface OrientationContextType {
  interest: Interest;
  setInterest: (v: Interest) => void;
  /** true when an item with these audiences should be shown to the current selection */
  matches: (audiences?: readonly string[] | null) => boolean;
}

const OrientationContext = createContext<OrientationContextType | undefined>(undefined);

export const useOrientation = () => {
  const ctx = useContext(OrientationContext);
  if (!ctx) throw new Error('useOrientation must be used within OrientationProvider');
  return ctx;
};

/**
 * "I'm interested in" filter. Sexual orientation is special personal information (POPIA), so the choice is
 * kept in this browser only. It is written to the profile only after the member consented to special-
 * personal-information processing at signup, and is never inferred.
 */
export const OrientationProvider = ({ children }: { children: ReactNode }) => {
  const { profile, user } = useAuth();
  const [interest, setInterestState] = useState<Interest>('everyone');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Interest | null;
      if (saved && INTEREST_OPTIONS.some((o) => o.value === saved)) setInterestState(saved);
    } catch { /* storage unavailable */ }
  }, []);

  // Adopt the saved profile preference when signing in on a fresh browser.
  useEffect(() => {
    const first = profile?.interested_in?.[0];
    try {
      if (first && !localStorage.getItem(KEY)) setInterestState(first);
    } catch { /* ignore */ }
  }, [profile]);

  const setInterest = useCallback((v: Interest) => {
    setInterestState(v);
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    if (user) {
      // Persist to the profile only if the member has recorded consent; failures are non-fatal.
      void (async () => {
        const { data } = await supabase.from('consents').select('id')
          .eq('user_id', user.id).eq('kind', 'special_personal_information').eq('granted', true).limit(1);
        if (data?.length) await supabase.from('profiles').update({ interested_in: [v] }).eq('id', user.id);
      })();
    }
  }, [user]);

  const matches = useCallback(
    (audiences?: readonly string[] | null) =>
      interest === 'everyone' || !audiences?.length || audiences.includes('everyone') || audiences.includes(interest),
    [interest],
  );

  const value = useMemo(() => ({ interest, setInterest, matches }), [interest, setInterest, matches]);
  return <OrientationContext.Provider value={value}>{children}</OrientationContext.Provider>;
};
