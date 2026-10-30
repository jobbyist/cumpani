# Members-only hero video

The homepage hero plays a looping background video **only for signed-in, verified, subscribed members**.
Logged-out visitors see a pink/black gradient hero with no video.

The video is served from the **private** Supabase Storage bucket `hero` through a short-lived signed URL
(never from `public/`, which anyone could download). RLS allows reads only for verified members with an
active subscription, and writes only for admins.

## Setup
1. Apply `supabase/migrations/20261029000003_hero_bucket.sql`.
2. Compress the source: `scripts/prepare-hero-video.sh path/to/video.mp4 ./hero-out` (about 1 MB each, audio stripped).
3. Upload `hero.mp4` (and optionally `hero.webm`) to the `hero` bucket as an admin user (Supabase dashboard > Storage).
4. Confirm you hold the rights to the footage and the consent of everyone shown before publishing it. The source clip
   contains explicit adult content and third-party watermarks.
