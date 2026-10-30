import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ROLES = [
  { id: 'seeker', title: 'Find companions', detail: 'Discover profiles and connect with people.' },
  { id: 'companion', title: 'Become a companion', detail: 'Create a companion profile and receive enquiries.' },
  { id: 'creator', title: 'Publish content', detail: 'Build an audience and share exclusive content.' },
] as const;
const DATING = ['Women', 'Men', 'Trans people', 'Everyone'];
const CONTENT = ['Lifestyle', 'Beauty & fashion', 'Fitness', 'Art & photography', 'Adult content'];

const Onboarding = () => {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [roles, setRoles] = useState<string[]>(['seeker']);
  const [dating, setDating] = useState<string[]>([]);
  const [content, setContent] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  const canContinue = useMemo(() => step !== 1 || roles.length > 0, [step, roles]);

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const { error: roleError } = await supabase.from('profile_roles').upsert(
        roles.map((role) => ({ user_id: user.id, role })),
        { onConflict: 'user_id,role', ignoreDuplicates: true },
      );
      if (roleError) throw roleError;
      const { error } = await supabase.from('onboarding_preferences').upsert({
        user_id: user.id,
        dating_preferences: { interested_in: dating },
        content_preferences: { interests: content },
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      await refresh();
      navigate('/verify', { replace: true });
    } catch (error) {
      toast({ title: 'Could not save your choices', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally { setBusy(false); }
  };

  return (
    <PageShell narrow>
      <div className="mx-auto max-w-xl space-y-5">
        <div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your Cumpani</p>
          <h1 className="text-3xl font-bold">Make it yours.</h1>
          <p className="text-sm text-muted-foreground">Choose how you want to use Cumpani. You can select more than one role and change your choices later.</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
          <p className="text-xs text-muted-foreground">Step {step + 1} of 3</p>
        </div>
        {step === 0 && <Card><CardHeader><CardTitle>How will you use Cumpani?</CardTitle><CardDescription>Select every option that applies.</CardDescription></CardHeader><CardContent className="space-y-3">
          {ROLES.map((r) => <label key={r.id} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
            <Checkbox checked={roles.includes(r.id)} onCheckedChange={() => toggle(roles, r.id, setRoles)} />
            <span><span className="block font-medium">{r.title}</span><span className="text-sm text-muted-foreground">{r.detail}</span></span>
          </label>)}
        </CardContent></Card>}
        {step === 1 && <Card><CardHeader><CardTitle>Who would you like to discover?</CardTitle><CardDescription>Optional preferences. These are sensitive personal information and should only be saved with your explicit consent.</CardDescription></CardHeader><CardContent className="space-y-3">
          {DATING.map((v) => <label key={v} className="flex items-center gap-3 rounded-lg border p-3"><Checkbox checked={dating.includes(v)} onCheckedChange={() => toggle(dating, v, setDating)} /><span>{v}</span></label>)}
        </CardContent></Card>}
        {step === 2 && <Card><CardHeader><CardTitle>What content interests you?</CardTitle><CardDescription>Choose topics to personalise discovery. You can skip this step.</CardDescription></CardHeader><CardContent className="space-y-3">
          {CONTENT.map((v) => <label key={v} className="flex items-center gap-3 rounded-lg border p-3"><Checkbox checked={content.includes(v)} onCheckedChange={() => toggle(content, v, setContent)} /><span>{v}</span></label>)}
        </CardContent></Card>}
        <div className="flex gap-3"><Button variant="outline" className="flex-1" disabled={step === 0 || busy} onClick={() => setStep((s) => s - 1)}>Back</Button>
          {step < 2 ? <Button className="flex-1" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>Continue</Button> :
            <Button className="flex-1" disabled={busy || roles.length === 0} onClick={finish}>{busy ? 'Saving…' : 'Save and continue'}</Button>}</div>
        <p className="text-center text-xs text-muted-foreground">Cumpani is strictly 21+. Verification is reviewed separately and role selection does not grant verified access.</p>
      </div>
    </PageShell>
  );
};
export default Onboarding;
