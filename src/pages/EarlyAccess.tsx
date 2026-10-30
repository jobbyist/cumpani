import { useState } from 'react';
import PageShell from '@/components/PageShell';
import CountdownChip from '@/components/CountdownChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { submitWaitlist, FAIL_MESSAGES } from '@/lib/forms';
import { memberPhase, effectiveNow } from '@/lib/launch';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const EarlyAccess = () => {
  const [form, setForm] = useState({ name: '', email: '', city: '', marketing: false, website: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const live = memberPhase(effectiveNow()) === 'live';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) { setDone(true); return; } // honeypot: bots fill the hidden field
    setBusy(true);
    const res = await submitWaitlist(form);
    setBusy(false);
    if (res.ok) { setDone(true); return; }
    if (res.reason === 'duplicate') { setDone(true); return; }
    toast({ title: 'Could not join', description: FAIL_MESSAGES[res.reason ?? 'unavailable'], variant: 'destructive' });
  };

  return (
    <PageShell narrow>
      <div className="mb-8 space-y-4 text-center">
        <div className="text-foreground"><span className="inline-block rounded-full bg-primary/10 text-primary"><CountdownChip /></span></div>
        <h1 className="text-4xl font-bold">Get early access</h1>
        <p className="text-lg text-muted-foreground">
          Cumpani opens on 1 December 2026. Join the waitlist to be first in, and to hear when verified companions go live in your city.
        </p>
      </div>

      {live ? (
        <Card><CardContent className="space-y-3 pt-6 text-center">
          <p>Cumpani is live. Create your account to get started.</p>
          <Button asChild><Link to="/signup">Join Cumpani</Link></Button>
        </CardContent></Card>
      ) : done ? (
        <Card><CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <CheckCircle className="h-10 w-10 text-emerald-600" aria-hidden="true" />
          <p className="text-lg font-medium">You're on the list.</p>
          <p className="text-sm text-muted-foreground">We'll email you before launch. Are you a companion or creator? Applications run 2 November to 1 December.</p>
          <Button asChild variant="outline"><Link to="/become-companion">Apply as a companion</Link></Button>
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Join the waitlist</CardTitle><CardDescription>You must be 21 or older to use Cumpani.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="ea-name">Name</Label>
                <Input id="ea-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} maxLength={80} autoComplete="name" /></div>
              <div className="space-y-2"><Label htmlFor="ea-email">Email</Label>
                <Input id="ea-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></div>
              <div className="space-y-2"><Label htmlFor="ea-city">City (optional)</Label>
                <Input id="ea-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={60} /></div>
              {/* honeypot */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={form.marketing} onCheckedChange={(v) => setForm({ ...form, marketing: v === true })} />
                <span>Email me about the launch and product updates. I can unsubscribe at any time. See the <Link to="/privacy" className="underline">Privacy Policy</Link>.</span>
              </label>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Joining...' : 'Join the waitlist'}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
};

export default EarlyAccess;
