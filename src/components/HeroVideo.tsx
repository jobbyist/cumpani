import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Sources { mp4?: string; webm?: string }

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

/**
 * Full-bleed hero. The looping background video is only fetched for signed-in, verified, subscribed members,
 * from the private `hero` storage bucket (RLS-protected). Everyone else gets the gradient only.
 */
const HeroVideo = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isVerified, isSubscribed } = useAuth();
  const reduced = useReducedMotion();
  const [sources, setSources] = useState<Sources>({});
  const allowed = isAuthenticated && isVerified && isSubscribed && !reduced;

  useEffect(() => {
    if (!allowed) { setSources({}); return; }
    let cancelled = false;
    (async () => {
      const sign = async (name: string) =>
        (await supabase.storage.from('hero').createSignedUrl(name, 3600)).data?.signedUrl;
      const [mp4, webm] = await Promise.all([sign('hero.mp4'), sign('hero.webm')]);
      if (!cancelled) setSources({ mp4, webm });
    })().catch(() => undefined);
    return () => { cancelled = true; };
  }, [allowed]);

  const hasVideo = allowed && (sources.mp4 || sources.webm);

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      {hasVideo && (
        <video
          autoPlay loop muted playsInline preload="metadata" aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          onError={() => setSources({})}
        >
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
        </video>
      )}
      {/* black -> pink gradient keeps the text legible over any frame */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/85 via-black/65 to-primary/70" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
      <div className="container-blog flex min-h-[70vh] items-center justify-center py-16 text-center">
        <div className="max-w-3xl space-y-5">{children}</div>
      </div>
    </section>
  );
};

export default HeroVideo;
