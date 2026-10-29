import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Story {
  id: string;
  kind: 'popular' | 'promoted' | 'highlight';
  caption: string | null;
  url: string;
  authorName: string;
}

interface StoryRow {
  id: string; kind: Story['kind']; caption: string | null; media_path: string; author: { display_name: string } | null;
}

const KIND_LABEL: Record<Story['kind'], string> = {
  popular: 'Popular',
  promoted: 'Promoted',
  highlight: 'Highlight',
};

const STORY_MS = 5000;

/** Instagram-style stories strip. Only approved, unexpired stories are returned (enforced by RLS). */
const StoriesBar = () => {
  const { isAuthenticated, isVerified } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !isVerified) { setStories([]); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('stories')
        .select('id, kind, caption, media_path, author:profiles!stories_author_id_fkey(display_name)')
        .eq('moderation', 'approved')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(30);
      if (cancelled || !data) return;
      const signed = await Promise.all(
        (data as unknown as StoryRow[]).map(async (row) => {
          const { data: s } = await supabase.storage.from('stories').createSignedUrl(row.media_path, 3600);
          return {
            id: row.id, kind: row.kind, caption: row.caption,
            url: s?.signedUrl ?? '', authorName: row.author?.display_name ?? 'Cumpani',
          } as Story;
        }),
      );
      if (!cancelled) setStories(signed.filter((s) => s.url));
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, isVerified]);

  const close = useCallback(() => { setActive(null); setProgress(0); }, []);
  const next = useCallback(() => {
    setProgress(0);
    setActive((i) => (i === null ? null : i + 1 < stories.length ? i + 1 : null));
  }, [stories.length]);

  useEffect(() => {
    if (active === null) return;
    const started = Date.now();
    const t = setInterval(() => {
      const p = Math.min(100, ((Date.now() - started) / STORY_MS) * 100);
      setProgress(p);
      if (p >= 100) next();
    }, 80);
    return () => clearInterval(t);
  }, [active, next]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, next]);

  if (stories.length === 0) return null;
  const current = active !== null ? stories[active] : null;

  return (
    <section aria-label="Stories" className="py-4">
      <Carousel opts={{ align: 'start', dragFree: true }}>
        <CarouselContent className="-ml-3">
          {stories.map((s, i) => (
            <CarouselItem key={s.id} className="basis-auto pl-3">
              <button type="button" onClick={() => setActive(i)} className="flex w-[72px] flex-col items-center gap-1.5">
                <span className="rounded-full bg-gradient-to-tr from-primary via-pink-500 to-amber-400 p-[2.5px]">
                  <img src={s.url} alt="" loading="lazy"
                    className="h-16 w-16 rounded-full border-2 border-background object-cover" />
                </span>
                <span className="w-full truncate text-center text-[11px] text-muted-foreground">{s.authorName}</span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={`Story by ${current.authorName}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={next}>
          <div className="relative h-full w-full max-w-md">
            <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
              {stories.map((s, i) => (
                <div key={s.id} className="h-0.5 flex-1 overflow-hidden rounded bg-white/30">
                  <div className="h-full bg-white" style={{ width: i < (active ?? 0) ? '100%' : i === active ? `${progress}%` : '0%' }} />
                </div>
              ))}
            </div>
            <div className="absolute left-3 top-6 z-10 text-sm text-white">
              <span className="font-semibold">{current.authorName}</span>{' '}
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase">{KIND_LABEL[current.kind]}</span>
            </div>
            <button type="button" aria-label="Close story" onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute right-3 top-5 z-10 text-white"><X className="h-6 w-6" /></button>
            <img src={current.url} alt={current.caption ?? ''} className="h-full w-full object-contain" />
            {current.caption && (
              <p className="absolute inset-x-0 bottom-8 px-6 text-center text-white drop-shadow">{current.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default StoriesBar;
