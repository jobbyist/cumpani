import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const LEGAL_VERSION = '2026-10-draft';

interface AuthFormProps {
  onClose?: () => void;
}

const MIN_AGE = 21;

const isOldEnough = (dob: string) => {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - MIN_AGE);
  return d <= cutoff;
};

const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter a display name').max(40),
    email: z.string().trim().email('Enter a valid email'),
    dob: z.string().refine(isOldEnough, `You must be ${MIN_AGE} or older to join Cumpani`),
    password: z.string().min(10, 'Use at least 10 characters'),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms and Privacy Policy' }) }),
    special: z.literal(true, { errorMap: () => ({ message: 'Consent to processing is required to create an account' }) }),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export const LoginForm = ({ onClose }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await login(email.trim(), password);
    setIsLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error, variant: 'destructive' });
      return;
    }
    onClose?.();
    navigate(from, { replace: true });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export const SignupForm = ({ onClose }: AuthFormProps) => {
  const [form, setForm] = useState({
    name: '', email: '', dob: '', password: '', confirm: '', terms: false, special: false, marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: 'Check your details', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const res = await signup({ email: form.email.trim(), password: form.password, name: form.name.trim(), dob: form.dob });
    if (res.error) {
      setIsLoading(false);
      toast({ title: 'Signup failed', description: res.error, variant: 'destructive' });
      return;
    }
    // Record consents once a session exists (otherwise they are recorded on first login via /verify).
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (uid) {
      await supabase.from('consents').insert([
        { user_id: uid, kind: 'terms', version: LEGAL_VERSION, granted: true },
        { user_id: uid, kind: 'privacy', version: LEGAL_VERSION, granted: true },
        { user_id: uid, kind: 'special_personal_information', version: LEGAL_VERSION, granted: true },
        { user_id: uid, kind: 'marketing', version: LEGAL_VERSION, granted: form.marketing },
      ]);
    }
    setIsLoading(false);
    onClose?.();
    if (res.needsEmailConfirmation) setSent(true);
    else navigate('/verify');
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a confirmation link to {form.email}. Confirm your email, then log in to complete verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full"><Link to="/login">Go to login</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Cumpani is for adults aged {MIN_AGE} and over.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} disabled={isLoading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" autoComplete="email" value={form.email}
              onChange={(e) => set('email', e.target.value)} disabled={isLoading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" type="date" value={form.dob} max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => set('dob', e.target.value)} disabled={isLoading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" autoComplete="new-password" value={form.password}
              onChange={(e) => set('password', e.target.value)} disabled={isLoading} required minLength={10} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input id="confirm-password" type="password" autoComplete="new-password" value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)} disabled={isLoading} required />
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-2">
              <Checkbox checked={form.terms} onCheckedChange={(v) => set('terms', v === true)} />
              <span>I am {MIN_AGE} or older and accept the <Link to="/terms" className="text-primary underline">Terms of Use</Link>,{' '}
                <Link to="/privacy" className="text-primary underline">Privacy Policy</Link> and{' '}
                <Link to="/acceptable-use" className="text-primary underline">Acceptable Use Policy</Link>.</span>
            </label>
            <label className="flex items-start gap-2">
              <Checkbox checked={form.special} onCheckedChange={(v) => set('special', v === true)} />
              <span>I consent to Cumpani processing my personal information, including age and identity verification
                data, as described in the Privacy Policy (POPIA).</span>
            </label>
            <label className="flex items-start gap-2">
              <Checkbox checked={form.marketing} onCheckedChange={(v) => set('marketing', v === true)} />
              <span className="text-muted-foreground">Optional: send me product updates by email.</span>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
