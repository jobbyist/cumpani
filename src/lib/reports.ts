import { supabase } from '@/lib/supabase';

export const REPORT_CATEGORIES = [
  { value: 'hate_harassment', label: 'Hate or harassment' },
  { value: 'outing_threat', label: 'Threat to out me or someone' },
  { value: 'blackmail_extortion', label: 'Blackmail or extortion' },
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'underage', label: 'Appears underage' },
  { value: 'other', label: 'Something else' },
] as const;

/** Simple category + reason prompt (a dialog can replace this later). Returns true if a report was filed. */
export const fileReport = async (reporterId: string, targetType: 'post' | 'profile', targetId: string): Promise<boolean | null> => {
  const menu = REPORT_CATEGORIES.map((c, i) => `${i + 1}. ${c.label}`).join('\n');
  const pick = window.prompt(`What are you reporting?\n${menu}\n\nEnter a number (1-${REPORT_CATEGORIES.length}):`);
  if (!pick) return null;
  const cat = REPORT_CATEGORIES[Number(pick) - 1];
  if (!cat) return null;
  const reason = window.prompt('Add details (optional):') ?? '';
  const { error } = await supabase.from('reports').insert({
    reporter_id: reporterId, target_type: targetType, target_id: targetId, category: cat.value, reason: reason.trim() || cat.label,
  });
  return !error;
};
