import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, MessageCircle, Image, Wallet, ShieldCheck, CheckCircle } from 'lucide-react';
import { submitApplication, FAIL_MESSAGES } from '@/lib/forms';
import { companionPhase, effectiveNow, COMPANION_SIGNUP_OPENS } from '@/lib/launch';
import { useToast } from '@/hooks/use-toast';

const perks = [
  { icon: BadgeCheck, title: 'Verified profile', text: 'Complete ID and age verification once, then build a profile members can trust.' },
  { icon: ShieldCheck, title: 'Safety first', text: 'Private messaging, block and report tools, and priority moderation. LGBT-inclusive and zero tolerance for outing or harassment.' },
  { icon: Image, title: 'Post content', text: 'Share posts in the community feed and publish exclusive content for credits.' },
  { icon: Wallet, title: 'Earn credits', text: 'Earn a share of the credits members spend on your messages and content.' },
];

const isOldEnough = (dob: string) => {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 21);
  return d <= cutoff;
};

const ApplicationForm = () => {
  const [f, setF] = useState({ name: '', email: '', dob: '', city: '', role: 'companion' as 'companion' | 'creator', links: '', consent: false, website: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.website) { setDone(true); return; }
    if (!isOldEnough(f.dob)) { toast({ title: 'You must be 21 or older', variant: 'destructive' }); return; }
    if (!f.consent) { toast({ title: 'Please accept the consent', variant: 'destructive' }); return; }
    setBusy(true);
    const res = await submitApplication(f);
    setBusy(false);
    if (res.ok || res.reason === 'duplicate') { setDone(true); return; }
    toast({ title: 'Could not submit', description: FAIL_MESSAGES[res.reason], variant: 'destructive' });
  };

  if (done) {
    return (
      <Card><CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-600" aria-hidden="true" />
        <p className="text-lg font-medium">Application received.</p>
        <p className="text-sm text-muted-foreground">We'll email you about verification. You'll be asked for an ID document and a selfie.</p>
      </CardContent></Card>
    );
  }
  return (
    <Card>
      <CardHeader><CardTitle>Apply to join as a verified companion or creator</CardTitle>
        <CardDescription>Applications are open until 1 December 2026. You must be 21 or older.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="ap-name">Name</Label>
              <Input id="ap-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required minLength={2} maxLength={80} autoComplete="name" /></div>
            <div className="space-y-2"><Label htmlFor="ap-email">Email</Label>
              <Input id="ap-email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required autoComplete="email" /></div>
            <div className="space-y-2"><Label htmlFor="ap-dob">Date of birth</Label>
              <Input id="ap-dob" type="date" value={f.dob} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setF({ ...f, dob: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="ap-city">City</Label>
              <Input id="ap-city" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} maxLength={60} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="ap-role">I want to join as</Label>
            <select id="ap-role" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value as 'companion' | 'creator' })}>
              <option value="companion">Companion</option><option value="creator">Content creator</option>
            </select></div>
          <div className="space-y-2"><Label htmlFor="ap-links">Links to your profiles or work (optional)</Label>
            <Textarea id="ap-links" value={f.links} onChange={(e) => setF({ ...f, links: e.target.value })} maxLength={1000} /></div>
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.consent} onCheckedChange={(v) => setF({ ...f, consent: v === true })} />
            <span>I am 21 or older. I consent to Cumpani processing my information to assess my application, including identity verification, as set out in the <Link to="/privacy" className="underline">Privacy Policy</Link>. I will not offer or solicit sexual services for payment.</span>
          </label>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Submitting...' : 'Submit application'}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const BecomeCompanion = () => {
  const phase = companionPhase(effectiveNow());
  return (
    <PageShell narrow>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-4xl font-bold">Become a verified companion or creator</h1>
        <p className="text-lg text-muted-foreground">
          Create a verified profile on Cumpani, connect with members and share content on your terms. Applications are open from 2 November to 1 December 2026, ahead of our 1 December launch.
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6">
            <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mb-1 font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      {phase === 'open' && <ApplicationForm />}
      {phase === 'soon' && (
        <Card><CardContent className="space-y-3 pt-6 text-center">
          <p className="text-lg font-medium">Applications open on {COMPANION_SIGNUP_OPENS.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Johannesburg' })}.</p>
          <p className="text-sm text-muted-foreground">Join the waitlist and we'll email you the moment they open.</p>
          <Button asChild><Link to="/early-access">Notify me</Link></Button>
        </CardContent></Card>
      )}
      {phase === 'closed' && (
        <Card><CardContent className="space-y-3 pt-6 text-center">
          <p className="text-lg font-medium">Launch applications are closed.</p>
          <Button asChild><Link to="/signup">Join Cumpani</Link></Button>
        </CardContent></Card>
      )}
      <Disclaimer className="mt-8" />
    </PageShell>
  );
};

export default BecomeCompanion;
