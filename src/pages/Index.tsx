import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import ReelsCarousel from '@/components/ReelsCarousel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanions } from '@/hooks/useCompanions';
import { useFeaturedCompanions } from '@/hooks/useFeaturedCompanions';
import CountdownChip from '@/components/CountdownChip';
import { companionPhase, effectiveNow, memberPhase, COMPANION_SIGNUP_OPENS } from '@/lib/launch';
import { useOrientation } from '@/contexts/OrientationContext';
import {
  ArrowRight, BadgeCheck, Heart, Lock, LockKeyhole, MapPin, MessageCircle,
  ShieldCheck, Sparkles, UserRoundCheck, Wallet,
} from 'lucide-react';

const trustPoints = [
  { icon: ShieldCheck, title: 'Verified companions', text: 'Real people. Profiles reviewed before they go live.' },
  { icon: LockKeyhole, title: 'Private by design', text: 'Your privacy matters. Always.' },
  { icon: Heart, title: 'Content on your terms', text: 'Discover approved posts and exclusive creator content.' },
  { icon: MessageCircle, title: 'South African community', text: 'Connect with people and creators across the country.' },
];

const safetyItems: { icon: typeof BadgeCheck; title: string; text: string; badge?: string }[] = [
  { icon: BadgeCheck, title: '21+ age checks', text: 'Adults only. Always.' },
  { icon: UserRoundCheck, title: 'Identity checks', text: 'Profiles are reviewed.' },
  { icon: MessageCircle, title: 'Private messaging', text: 'Chat with confidence.' },
  { icon: ShieldCheck, title: 'Content moderation', text: 'Hate, outing threats and blackmail are reviewed first.' },
  { icon: LockKeyhole, title: 'Privacy first', badge: 'LGBT-Inclusive', text: 'POPIA-aligned. Your preferences stay private.' },
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { data: members = [] } = useCompanions();
  const { data: teasers = [] } = useFeaturedCompanions(12);
  const { matches } = useOrientation();
  const now = effectiveNow();
  const live = memberPhase(now) === 'live';
  const phase = companionPhase(now);
  const opens = COMPANION_SIGNUP_OPENS.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', timeZone: 'Africa/Johannesburg' });
  const joinHref = live ? '/signup' : '/early-access';
  // Logged-out visitors only ever receive the pre-blurred teaser images.
  const companions = isAuthenticated ? members : teasers;
  const featured = companions
    .filter((person) => matches(person.presentsAs ? [person.presentsAs] : undefined))
    .slice(0, 6);

  const profileHref = (id: string) => (isAuthenticated ? `/companion/${id}` : joinHref);

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white">
      <PageShell hero={
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-neutral-950 text-white">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-[center_38%] opacity-70"
            style={{ backgroundImage: "url('/cumpanibanner2.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/35" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" aria-hidden="true" />
          <div className="container-blog grid min-h-[590px] items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:py-20">
            <div className="max-w-2xl space-y-6">
              <CountdownChip />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-500">Real people. Real connections. LGBT-friendly.</p>
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                Meet verified companions &amp; explore <span className="text-pink-500">exclusive content.</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Cumpani is South Africa’s social and dating platform for adults 21+. Discover verified companions,
                connect with creators and explore approved content in a private, respectful environment.
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button size="lg" className="h-12 rounded-full bg-pink-600 px-7 text-white shadow-[0_8px_30px_rgba(219,39,119,0.25)] hover:bg-pink-500" asChild>
                  <Link to={isAuthenticated ? '/companions' : joinHref}>
                    {isAuthenticated ? 'Explore companions' : live ? 'Join now (21+)' : 'Get early access (21+)'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-black/20 px-7 text-white hover:bg-white hover:text-black" asChild>
                  <Link to={isAuthenticated ? '/companions' : '/become-companion'}>
                    {isAuthenticated ? 'Browse the platform' : phase === 'soon' ? `Companions & creators: opens ${opens}` : 'Apply as a companion or creator'}
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-white/60">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-pink-500" /> Verified profiles</span>
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-pink-500" /> Private by design</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-pink-500" /> Made for South Africa</span>
              </div>
            </div>
            <div className="hidden space-y-7 lg:block">
              {trustPoints.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <Icon className="mt-0.5 h-7 w-7 shrink-0 text-pink-500" strokeWidth={1.6} aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <section className="py-3 sm:py-6" aria-labelledby="featured-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-pink-500">Discover your people</p>
              <h2 id="featured-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Featured companions</h2>
              <p className="mt-2 text-sm text-white/60">Profiles from across South Africa. Verified and ready to connect.</p>
            </div>
            <Link to={isAuthenticated ? '/companions' : joinHref} className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-pink-500 transition-colors hover:text-pink-300 sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {featured.map((person) => (
              <Link key={person.id} to={profileHref(person.id)} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:bg-white/[0.06]">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                  <img src={isAuthenticated ? person.profileImage : (person.blurImage ?? '/placeholder.svg')} alt={isAuthenticated ? `${person.name}, ${person.city}` : `Profile preview in ${person.city}`} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isAuthenticated ? '' : 'scale-110'}`} />
                  {!isAuthenticated && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] text-white backdrop-blur"><Lock className="h-3 w-3" aria-hidden="true" /> Join to view</span>
                    </span>
                  )}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2 py-1 text-[10px] font-semibold text-white">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-bold text-white">{person.name}{isAuthenticated ? `, ${person.age}` : ''}</h3>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-white/55"><MapPin className="h-3 w-3 shrink-0" />{person.city}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/65"><span className="h-1.5 w-1.5 rounded-full bg-pink-500" />{person.isAvailable ? 'Available now' : 'Check availability'}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to={isAuthenticated ? '/companions' : joinHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pink-500 sm:hidden">
            View all companions <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <ReelsCarousel />

        <section className="my-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/40">
          <div className="grid items-center gap-7 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-10">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-pink-500">The companion partner programme</p>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">Create. Connect. <span className="text-pink-500">Earn.</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                Build a verified presence, connect with members and share approved content on your terms.
                Track your activity and earnings from your companion dashboard.
              </p>
              <Button asChild size="lg" className="mt-6 h-11 rounded-full bg-pink-600 px-6 text-white hover:bg-pink-500">
                <Link to="/become-companion">Become a companion <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="hidden h-36 w-36 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/10 lg:flex">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/10">
                <Sparkles className="h-10 w-10 text-pink-500" strokeWidth={1.4} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { icon: BadgeCheck, title: 'Get verified', text: 'Build trust with members' },
              { icon: MessageCircle, title: 'Connect', text: 'Keep conversations in-app' },
              { icon: Wallet, title: 'Earn credits', text: 'Monetise approved activity' },
              { icon: Heart, title: 'Stay in control', text: 'Share content on your terms' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-neutral-950/90 p-4 sm:p-5">
                <Icon className="mb-3 h-5 w-5 text-pink-500" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-10" aria-labelledby="safety-heading">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-pink-500">Your safety comes first</p>
            <h2 id="safety-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">A safer space for genuine connections.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              Cumpani is an LGBT-friendly community. Because LGBT people are more often targeted by bad actors, extra privacy and safety protections are built in.{' '}
              <Link to="/safety" className="font-semibold text-pink-500 underline underline-offset-4">Visit the Safety Centre</Link>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {safetyItems.map(({ icon: Icon, title, text, badge }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto mb-3 h-7 w-7 text-pink-500" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                {badge && <span className="mt-1 inline-block rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">{badge}</span>}
                <p className="mt-1 text-xs text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-8 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h2 className="font-bold text-white">South Africa’s social and dating platform for adults.</h2>
              <p className="mt-1 text-sm text-white/55">Real people. Real connections. Always 21+.</p>
            </div>
          </div>
          <Button asChild className="h-11 w-full rounded-full bg-pink-600 px-6 text-white hover:bg-pink-500 sm:w-auto">
            <Link to={isAuthenticated ? '/companions' : joinHref}>{live || isAuthenticated ? 'Join Cumpani' : 'Get early access'} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </section>

        <Disclaimer className="mt-8" />
      </PageShell>
    </div>
  );
};

export default Index;
