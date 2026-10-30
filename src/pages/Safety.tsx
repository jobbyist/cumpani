import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { ShieldCheck, EyeOff, Flag, LogOut, HeartHandshake, Phone } from 'lucide-react';
import { COMPANY } from '@/lib/company';

const measures = [
  { icon: EyeOff, title: 'Privacy first', text: 'Your "I\'m interested in" choice stays in your browser unless you consent to saving it, is never shown on your profile, and never appears in notifications or emails.' },
  { icon: ShieldCheck, title: 'Verified companions', text: 'Companions pass ID and age checks before their profile goes live. Identity documents are stored privately and deleted within 30 days.' },
  { icon: Flag, title: 'Priority reporting', text: 'Reports of hate, threats to out someone, blackmail or extortion, and underage users are reviewed first.' },
  { icon: LogOut, title: 'Quick exit', text: 'The Quick exit button on every page (or pressing Esc three times) leaves Cumpani immediately.' },
];

const risks = [
  'Threats to out you to family, employers or communities, or demands for money to stay silent.',
  'Fake profiles ("catfishing") used to lure people to unsafe meetings.',
  'Requests to move to other apps, share photos or send money before you trust someone.',
  'Hate-motivated harassment or violence against LGBT people.',
];

const steps = [
  'Meet in a public place first, tell a trusted friend where you are going, and arrange your own transport.',
  'Never send money, ID documents or intimate photos to someone you have not verified. Keep chats on Cumpani so reports work.',
  'If someone threatens to out you or demands money, do not pay. Screenshot it, block them, and report it as "Threat to out me" or "Blackmail / extortion".',
  'Use a strong password and turn on two-factor authentication where offered.',
  'On a shared device, browse in a private window. Quick exit leaves the site and clears what Cumpani saved in your browser, but it cannot erase your browser\'s back-button history.',
  'If you are in danger, leave and call the police.',
];

const Safety = () => (
  <PageShell narrow>
    <header className="mb-8 space-y-3">
      <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <HeartHandshake className="h-4 w-4" aria-hidden="true" /> LGBT-Inclusive
      </p>
      <h1 className="text-4xl font-bold">Your safety comes first</h1>
      <p className="text-lg text-muted-foreground">
        Cumpani is an LGBT-friendly community. People in the LGBT community are more often targeted by bad actors, so privacy
        and safety protections are built in for everyone and prioritised for those most at risk.
      </p>
    </header>

    <section className="mb-10 grid gap-4 sm:grid-cols-2">
      {measures.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-xl border border-border bg-card p-5">
          <Icon className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="mb-1 font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </section>

    <section className="mb-10 space-y-3">
      <h2 className="text-2xl font-semibold">Risks to watch for</h2>
      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">{risks.map((r) => <li key={r}>{r}</li>)}</ul>
    </section>

    <section className="mb-10 space-y-3">
      <h2 className="text-2xl font-semibold">How to stay safe</h2>
      <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </section>

    <section className="mb-10 space-y-3">
      <h2 className="flex items-center gap-2 text-2xl font-semibold"><Phone className="h-5 w-5" aria-hidden="true" /> Get help</h2>
      <ul className="space-y-2 text-muted-foreground">
        <li><strong className="text-foreground">Police emergency:</strong> 10111</li>
        <li><strong className="text-foreground">GBV Command Centre (24 hours, free):</strong> 0800 428 428. Services have been interrupted before, so if it does not connect, call the police.</li>
        <li><strong className="text-foreground">Triangle Project helpline (Cape Town, 1pm to 9pm daily):</strong> 021 712 6699</li>
        <li><strong className="text-foreground">Report to Cumpani:</strong> use the report button, or email {COMPANY.supportEmail}</li>
      </ul>
    </section>

    <Disclaimer className="mb-6" />
    <Button asChild variant="outline"><Link to="/community-guidelines">Community guidelines</Link></Button>
  </PageShell>
);

export default Safety;
