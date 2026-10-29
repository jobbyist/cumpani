// Uploads processed reels (see scripts/prepare-reels.sh) and inserts 5 approved rows.
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-reels.mjs ./reels-out
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const dir = process.argv[2] ?? './reels-out';
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1); }
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// reels 1-4: Ebony (shown to viewers interested in women), reel 5: Trans. Edit tags/audiences in the admin console.
const reels = [
  { n: 1, tags: ['Ebony'], aud: ['women'] }, { n: 2, tags: ['Ebony'], aud: ['women'] }, { n: 3, tags: ['Ebony'], aud: ['women'] },
  { n: 4, tags: ['Ebony'], aud: ['women'] }, { n: 5, tags: ['Trans'], aud: ['trans'] },
];

for (const r of reels) {
  const full = `featured/reel${r.n}.mp4`;
  const prev = `featured/reel${r.n}-preview.mp4`;
  for (const [bucket, name, file] of [['reels', full, `reel${r.n}.mp4`], ['reels-preview', prev, `reel${r.n}-preview.mp4`]]) {
    const body = await readFile(path.join(dir, file));
    const { error } = await sb.storage.from(bucket).upload(name, body, { contentType: 'video/mp4', upsert: true });
    if (error) throw error;
  }
  const { error } = await sb.from('reels').upsert(
    { id: `00000000-0000-4000-8000-00000000000${r.n}`, title: `Featured reel ${r.n}`, tags: r.tags,
      audiences: r.aud, video_path: full, preview_path: prev, moderation: 'approved', sort_order: r.n },
    { onConflict: 'id' });
  if (error) throw error;
  console.log(`seeded reel ${r.n} [${r.tags.join(', ')}]`);
}
