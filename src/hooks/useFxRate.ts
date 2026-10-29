import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/** Live ZAR-per-USD rate from the fx-rate Edge Function (cached server-side for 5 min). */
export const useFxRate = () =>
  useQuery({
    queryKey: ['fx-rate'],
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fx-rate');
      if (error) throw error;
      return data as { zarPerUsd: number; asOf: string };
    },
  });
