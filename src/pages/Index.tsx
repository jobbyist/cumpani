import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import HeroVideo from '@/components/HeroVideo';
import CountdownChip from '@/components/CountdownChip';
import ReelsCarousel from '@/components/ReelsCarousel';
import LocationCarousel from '@/components/LocationCarousel';
import CompanionCard from '@/components/CompanionCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeOff, BadgeCheck, Flag, LogOut, MessageCircle, Users, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeaturedCompanions } from '@/hooks/useFeaturedCompanions';
import { companionPhase, effectiveNow, memberPhase, COMPANION_SIGNUP_OPENS } from '@/lib/launch';

const safety = [
  { icon: EyeOff, title: 'Privacy first', badge: 'LGBT-Inclusive', text: 'Your preferences stay private and are never shown on your profile or in notifications.' },
  { icon: BadgeCheck, title: 'Verified companions', text: 'ID and age checks before any profile goes live.' },
  { icon: Flag, title: 'Priority reporting', text: 'Hate, outing threats and blackmail are reviewed first.' },
  { icon: LogOut, title: 'Quick exit', text: 'Leave the site instantly from any page with one tap.' },
];

const features = [
  { icon: MessageCircle, title: 'Real-time messaging', text: 'Chat with members and companions. Credits unlock messaging.' },
  { icon: Users, title: 'Community feed', text: 'Share posts and join conversations with the community.' },
  { icon: Wallet, title: 'Credit wallet', text: 'Top up in rand through PayPal and unlock extra features.' },
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { data: featured } = useFeaturedCompanions(6);
  const now = effectiveNow();
  const phase = companionPhase(now);
  const live = memberPhase(now) === 'live';
  const opens = COMPANION_SIGNUP_OPENS.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', timeZone: 'Africa/Johannesburg' });

  return (
    <PageShell hero={
      <HeroVideo>
        <CountdownChip />
        <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl">
          South Africa's verified, LGBT-friendly dating and creator community
        </h1>
        <p className="text-lg text-white/90 drop-shadow">
          Verified companions and content creators, private messaging and a respectful community for adults aged 21+.
          {live ? '' : ' Launching 1 December 2026.'}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Button size="lg" asChild><Link to="/companions">Browse profiles</Link></Button>
          ) : live ? (
            <Button size="lg" asChild><Link to="/signup">Join Cumpani</Link></Button>
          ) : (
            <Button size="lg" asChild><Link to="/early-access">Get early access</Link></Button>
          )}
          <Button size="lg" variant="outline" asChild
            className="border-white bg-transparent text-white hover:bg-white hover:text-black">
            <Link to="/become-companion">
              {phase === 'soon' ? `Companions & creators: opens ${opens}` : 'Apply as a companion or creator'}
            </Link>
          </Button>
        </div>
      </HeroVideo>
    }>
      <section aria-labelledby="safety-heading" className="py-10">
        <div className="mb-6 text-center">
          <h2 id="safety-heading" className="text-sm font-semibold uppercase tracking-widest text-primary">Your safety comes first</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            We're an LGBT-friendly community. People in the LGBT community are more often targeted by bad actors,
            so protections are built in and prioritised. <Link to="/safety" className="underline">Visit the Safety Centre</Link>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {safety.map(({ icon: Icon, title, badge, text }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mb-1 flex flex-wrap items-center gap-2 font-semibold">
                {title}
                {badge && <Badge className="border-0 bg-gradient-to-r from-pink-500 via-amber-400 to-sky-500 text-xs text-white">{badge}</Badge>}
              </h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <ReelsCarousel />

      {featured && featured.length > 0 && (
        <section aria-label="Featured companions" className="py-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Featured companions</h2>
            {!isAuthenticated && <p className="text-xs text-muted-foreground">Photos unlock for members</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {featured.map((c) => <CompanionCard key={c.id} companion={c} locked={!isAuthenticated} />)}
          </div>
        </section>
      )}

      <section className="py-8">
        <h2 className="mb-6 text-center text-2xl font-bold">Across South Africa</h2>
        <LocationCarousel />
      </section>

      <section className="grid gap-6 py-8 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mb-1 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3 py-8 text-center">
        <h2 className="text-2xl font-bold">Are you a companion or creator?</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Applications are open 2 November to 1 December 2026. Create a verified profile, post content, chat with members and earn credits.
        </p>
        <Button asChild variant="outline"><Link to="/become-companion">Learn more and apply</Link></Button>
      </section>

      <Disclaimer className="mt-6" />
    </PageShell>
  );
};

export default Index;
