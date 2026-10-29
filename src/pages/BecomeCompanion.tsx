import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { BadgeCheck, MessageCircle, Image, Wallet } from 'lucide-react';

const perks = [
  { icon: BadgeCheck, title: 'Verified profile', text: 'Complete ID and age verification once, then build a profile members can trust.' },
  { icon: MessageCircle, title: 'Chat with members', text: 'Private in-app messaging, so you never need to share personal contact details.' },
  { icon: Image, title: 'Post content', text: 'Share posts in the community feed and publish exclusive content for credits.' },
  { icon: Wallet, title: 'Earn credits', text: 'Earn a share of the credits members spend on your messages and content, with a dashboard to track it.' },
];

const BecomeCompanion = () => (
  <PageShell narrow>
    <div className="text-center mb-10 space-y-3">
      <h1 className="text-4xl font-bold">Become a companion</h1>
      <p className="text-lg text-muted-foreground">
        Create a verified profile on Cumpani, connect with members and share content on your terms.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 mb-10">
      {perks.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-xl border border-border bg-card p-6">
          <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
          <h2 className="font-semibold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>

    <section className="mb-10 space-y-2">
      <h2 className="text-2xl font-semibold">How to apply</h2>
      <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
        <li>Create an account (you must be 21 or older).</li>
        <li>On the verification page, tick "I am applying to be a companion" and upload your ID and a selfie.</li>
        <li>Once approved, set up your profile and start posting from your dashboard.</li>
      </ol>
    </section>

    <Disclaimer className="mb-8" />
    <div className="flex flex-wrap gap-3">
      <Button asChild size="lg"><Link to="/signup">Create an account</Link></Button>
      <Button asChild size="lg" variant="outline"><Link to="/verify">Go to verification</Link></Button>
    </div>
  </PageShell>
);

export default BecomeCompanion;
