import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { companionProfiles as samples } from '@/data/companions';
import type { CompanionProfile } from '@/types/companion';

interface Row { user_id: string; username: string; city: string; province: string; blur_path: string; is_available: boolean }

/** Logged-out safe: only names, city and the pre-blurred thumbnail are ever requested. */
export const useFeaturedCompanions = (limit = 6) =>
  useQuery({
    queryKey: ['featured-companions', limit],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<CompanionProfile[]> => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('featured_companions_public').select('*').limit(limit);
        if (data?.length) {
          return (data as Row[]).map((r) => ({
            id: r.user_id, name: r.username, username: `@${r.username}`, age: 21, city: r.city, province: r.province, bio: '',
            profileImage: '/placeholder.svg', images: [], availability: '', isAvailable: r.is_available,
            blurImage: supabase.storage.from('profile-blur').getPublicUrl(r.blur_path).data.publicUrl,
          }));
        }
      }
      return samples.slice(0, limit);
    },
  });
