import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { companionProfiles as sampleProfiles } from '@/data/companions';
import type { CompanionProfile } from '@/types/companion';

/**
 * Approved companion profiles from Supabase (RLS limits this to verified, subscribed members).
 * Falls back to clearly-labelled sample profiles while the directory is empty.
 */
interface CompanionRow {
  user_id: string; username: string; bio: string | null; city: string; province: string;
  photos: string[] | null; blur_path: string | null; is_available: boolean; is_sample: boolean;
  presents_as: 'women' | 'men' | 'trans' | null; orientation_tags: string[] | null;
  profile: { display_name: string; dob: string } | null;
}

export const useCompanions = () =>
  useQuery({
    queryKey: ['companions'],
    staleTime: 60_000,
    queryFn: async (): Promise<CompanionProfile[]> => {
      if (!isSupabaseConfigured) return sampleProfiles;
      const { data, error } = await supabase
        .from('companion_profiles')
        .select('user_id, username, bio, city, province, photos, blur_path, is_available, is_sample, presents_as, orientation_tags, profile:profiles!companion_profiles_user_id_fkey(display_name, dob)')
        .eq('moderation', 'approved')
        .limit(200);
      if (error) throw error;
      if (!data?.length) return sampleProfiles;
      return Promise.all(
        (data as unknown as CompanionRow[]).map(async (r) => {
          const path: string | undefined = r.photos?.[0];
          const url = path ? (await supabase.storage.from('avatars').createSignedUrl(path, 3600)).data?.signedUrl : undefined;
          const age = r.profile?.dob ? Math.floor((Date.now() - new Date(r.profile.dob).getTime()) / 31557600000) : 21;
          return {
            id: r.user_id, name: r.profile?.display_name ?? r.username, username: `@${r.username}`, age,
            city: r.city, province: r.province, bio: r.bio ?? '', profileImage: url ?? '/placeholder.svg',
            images: url ? [url] : [],
            blurImage: r.blur_path ? supabase.storage.from('profile-blur').getPublicUrl(r.blur_path).data.publicUrl : undefined, availability: r.is_available ? 'Available' : 'Unavailable',
            isAvailable: r.is_available, isSample: r.is_sample,
            presentsAs: r.presents_as ?? undefined, orientationTags: r.orientation_tags ?? [],
          } satisfies CompanionProfile;
        }),
      );
    },
  });
