import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock, Volume2, VolumeX } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOrientation } from '@/contexts/OrientationContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Reel {
  id: string; title: string; tags: string[]; audiences: string[];
  video_path: string; preview_path: string;
}

/** Placeholders shown until the reels table is seeded / Supabase is configured. */
const PLACEHOLDERS: Reel[] = [
  ...['Ebony', 'Ebony', 'Ebony', 'Ebony', 'Trans'].map((t, i) => ({
    id: `placeholder-${i}`, title: `Featured reel ${i + 1}`, tags: [t], audiences: [t === 'Trans' ? 'trans' : 'women'], video_path: '', preview_path: '',
  })),
];

const ReelCard = ({ reel, full }: { reel: Reel; full: string | undefined }) => {
  const { isAuthenticated } = useAuth();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const preview = reel.preview_path
    ? supabase.storage.from('reels-preview').getPublicUrl(reel.preview_path).data.publicUrl
    : undefined;
  const src = full ?? preview;
  const locked = !full;

  // Play only while the card is on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => undefined); else v.pause();
    }, { threshold: 0.6 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-primary/60">
      {src && (
        <video ref={ref} src={src} loop muted={muted || locked} playsInline preload="metadata"
          aria-label={reel.title} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {reel.tags.map((t) => <Badge key={t} className="bg-black/60 text-white backdrop-blur hover:bg-black/60">{t}</Badge>)}
      </div>
      {!locked && (
        <button type="button" onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur">
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
      {locked && (
        <div className="absolute inset-x-3 bottom-3 space-y-2 text-center text-white">
          <Lock className="mx-auto h-5 w-5" aria-hidden="true" />
          <p className="text-xs">{isAuthenticated ? 'Activate membership to watch' : 'Join to watch in full'}</p>
          <Button size="sm" asChild><Link to={isAuthenticated ? '/membership' : '/signup'}>{isAuthenticated ? 'Membership' : 'Join Cumpani'}</Link></Button>
        </div>
      )}
    </div>
  );
};

const ReelsCarousel = () => {
  const { isAuthenticated, isVerified, isSubscribed } = useAuth();
  const { matches } = useOrientation();
  const canWatch = isAuthenticated && isVerified && isSubscribed;

  const { data } = useQuery({
    queryKey: ['reels', canWatch],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      if (!isSupabaseConfigured) return PLACEHOLDERS;
      const { data: rows, error } = await supabase.from('reels')
        .select('id, title, tags, audiences, video_path, preview_path')
        .eq('moderation', 'approved').order('sort_order').order('created_at', { ascending: false }).limit(20);
      if (error || !rows?.length) return PLACEHOLDERS;
      const full: Record<string, string> = {};
      if (canWatch) {
        await Promise.all(rows.map(async (r) => {
          const { data: s } = await supabase.storage.from('reels').createSignedUrl(r.video_path, 3600);
          if (s?.signedUrl) full[r.id] = s.signedUrl;
        }));
      }
      return rows.map((r) => ({ ...r, __full: full[r.id] })) as (Reel & { __full?: string })[];
    },
  });

  const reels = (data ?? PLACEHOLDERS).filter((r) => matches(r.audiences));
  if (reels.length === 0) return null;

  return (
    <section id="reels" aria-label="Featured reels" className="scroll-mt-24 py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold">Featured reels</h2>
        <p className="text-xs text-muted-foreground">Adult content · 21+</p>
      </div>
      <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {reels.map((r) => (
            <CarouselItem key={r.id} className="basis-[68%] pl-3 sm:basis-[42%] md:basis-[30%] lg:basis-[22%]">
              <ReelCard reel={r} full={(r as Reel & { __full?: string }).__full} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ReelsCarousel;
