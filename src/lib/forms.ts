import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { COMPANY } from '@/lib/company';

export type FailReason = 'duplicate' | 'closed' | 'unavailable' | 'invalid';
export interface SubmitResult { ok: boolean; reason?: FailReason }

/** Maps a Supabase error to a user-facing reason. Never reports success on failure. */
const classify = (error: { code?: string; message?: string } | null): SubmitResult => {
  if (!error) return { ok: true };
  if (error.code === '23505') return { ok: false, reason: 'duplicate' };
  if (error.code === '42501') return { ok: false, reason: 'closed' };
  if (error.code === '23514' || error.code === '23502') return { ok: false, reason: 'invalid' };
  return { ok: false, reason: 'unavailable' };
};

export const submitWaitlist = async (v: { name: string; email: string; city: string; marketing: boolean }): Promise<SubmitResult> => {
  if (!isSupabaseConfigured) return { ok: false, reason: 'unavailable' };
  const { error } = await supabase.from('early_access_signups').insert({
    name: v.name.trim(), email: v.email.trim().toLowerCase(), city: v.city.trim() || null, marketing_consent: v.marketing,
  });
  return classify(error);
};

export const submitApplication = async (v: {
  name: string; email: string; dob: string; city: string; role: 'companion' | 'creator'; links: string;
}): Promise<SubmitResult> => {
  if (!isSupabaseConfigured) return { ok: false, reason: 'unavailable' };
  const { error } = await supabase.from('companion_applications').insert({
    name: v.name.trim(), email: v.email.trim().toLowerCase(), dob: v.dob, city: v.city.trim() || null,
    role: v.role, links: v.links.trim() || null, consent: true,
  });
  return classify(error);
};

export const FAIL_MESSAGES: Record<'duplicate' | 'closed' | 'unavailable' | 'invalid', string> = {
  duplicate: 'This email is already registered. Thank you, we have you on the list.',
  closed: 'Applications are not open right now.',
  invalid: 'Please check your details and try again.',
  unavailable: `We could not save your details right now. Please email ${COMPANY.supportEmail} and we will add you manually.`,
};
