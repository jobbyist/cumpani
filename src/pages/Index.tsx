import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import HeroVideo from '@/components/HeroVideo';
import ReelsCarousel from '@/components/ReelsCarousel';
import LocationCarousel from '@/components/LocationCarousel';
import { Button } from '@/components/ui/button';
import { Shield, Lock, MessageCircle, Users, BadgeCheck, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: BadgeCheck, title: 'Verified profiles', text: 'Identity and age checks before any profile goes live.' },
  { icon: MessageCircle, title: 'Real-time messaging', text: 'Chat with members and companions. Credits unlock messaging.' },
  { icon: Users, title: 'Community feed', text: 'Share posts and join conversations with the community.' },
  { icon: Wallet, title: 'Credit wallet', text: 'Top up in rand through PayPal and unlock extra features.' },
  { icon: Lock, title: 'Private', text: 'POPIA-aligned handling of your personal information.' },
  { icon: Shield, title: 'Safety tools', text: 'Report and block tools, with active moderation.' },
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  return (
    <PageShell hero={<HeroVideo>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
          Meet verified people across South Africa
        </h1>
        <p className="text-lg text-white/90 drop-shadow">
          Cumpani is a members-only social and dating platform for adults aged 21+. Verified profiles, private
          messaging and a respectful community.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Button size="lg" asChild><Link to="/companions">Browse profiles</Link></Button>
          ) : (
            <Button size="lg" asChild><Link to="/signup">Join Cumpani</Link></Button>
          )}
          <Button size="lg" variant="outline" asChild
            className="border-white bg-transparent text-white hover:bg-white hover:text-black">
            <Link to="/how-it-works">How it works</Link>
          </Button>
        </div>
    </HeroVideo>}>

      <ReelsCarousel />

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Across South Africa</h2>
        <LocationCarousel />
      </section>

      <section className="py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="py-8 text-center space-y-3">
        <h2 className="text-2xl font-bold">Are you a companion?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a verified profile, post content, chat with members and earn credits through the platform.
        </p>
        <Button asChild variant="outline"><Link to="/become-companion">Apply as a companion</Link></Button>
      </section>

      <Disclaimer className="mt-6" />
    </PageShell>
  );
};

export default Index;
