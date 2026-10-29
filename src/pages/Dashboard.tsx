import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SOUTH_AFRICAN_CITIES } from '@/types/companion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['my-companion-profile'],
    queryFn: async () => (await supabase.from('companion_profiles').select('*').eq('user_id', user!.id).maybeSingle()).data,
  });
  const [form, setForm] = useState<{ username?: string; bio?: string; city?: string; is_available?: boolean }>({});
  const v = { username: '', bio: '', city: 'Johannesburg', is_available: true, ...data, ...form };

  const save = useMutation({
    mutationFn: async () => {
      const username = v.username.trim().replace(/^@/, '');
      if (username.length < 3) throw new Error('Username must be at least 3 characters');
      const province = '';
      const { error } = await supabase.from('companion_profiles').upsert({
        user_id: user!.id, username, bio: v.bio, city: v.city, province: data?.province ?? province, is_available: v.is_available,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: 'Saved', description: 'Changes to your profile are reviewed before going live.' }); qc.invalidateQueries({ queryKey: ['my-companion-profile'] }); },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });

  return (
    <Card>
      <CardHeader><CardTitle>Your profile</CardTitle><CardDescription>Status: {data?.moderation ?? 'not created'}</CardDescription></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-2"><Label htmlFor="un">Username</Label>
            <Input id="un" value={v.username} onChange={(e) => setForm({ ...form, username: e.target.value })} maxLength={30} /></div>
          <div className="space-y-2"><Label htmlFor="bio">About you</Label>
            <Textarea id="bio" value={v.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={1000} /></div>
          <div className="space-y-2"><Label htmlFor="city">City</Label>
            <select id="city" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={v.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}>
              {SOUTH_AFRICAN_CITIES.map((c) => <option key={c}>{c}</option>)}
            </select></div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={v.is_available} onCheckedChange={(c) => setForm({ ...form, is_available: c })} /> Currently available</label>
          <Button type="submit" disabled={save.isPending}>Save profile</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ContentTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(10);
  const [file, setFile] = useState<File | null>(null);

  const { data: items } = useQuery({
    queryKey: ['my-content'],
    queryFn: async () => (await supabase.from('content_items').select('id, title, price_credits, moderation').eq('author_id', user!.id).order('created_at', { ascending: false })).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!file || !file.type.match(/^(image|video)\//) || file.size > 50 * 1024 * 1024) throw new Error('Upload an image or video under 50 MB');
      const path = `${user!.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const up = await supabase.storage.from('exclusive').upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      const { error } = await supabase.from('content_items').insert({ author_id: user!.id, title: title.trim(), media_path: path, price_credits: price });
      if (error) throw error;
    },
    onSuccess: () => { setTitle(''); setFile(null); toast({ title: 'Submitted for review' }); qc.invalidateQueries({ queryKey: ['my-content'] }); },
    onError: (e: Error) => toast({ title: 'Upload failed', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Post exclusive content</CardTitle>
          <CardDescription>All content is reviewed before it goes live. Content must follow the Acceptable Use Policy.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required maxLength={100} />
            <div className="flex items-center gap-2"><Label htmlFor="price">Price (credits)</Label>
              <Input id="price" type="number" min={0} max={1000} className="w-28" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} /></div>
            <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
            <Button type="submit" disabled={create.isPending}>Upload</Button>
          </form>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Your content</CardTitle></CardHeader>
        <CardContent>{!items?.length ? <p className="text-sm text-muted-foreground">Nothing yet.</p> : (
          <ul className="divide-y divide-border text-sm">{items.map((i) => (
            <li key={i.id} className="flex justify-between py-2"><span>{i.title}</span><span className="text-muted-foreground">{i.price_credits} credits · {i.moderation}</span></li>))}</ul>)}</CardContent></Card>
    </div>
  );
};

const PaymentsTab = () => {
  const { walletBalance } = useAuth();
  const { data } = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => (await supabase.from('wallet_transactions').select('id, credits, reason, created_at').eq('type', 'earn').order('created_at', { ascending: false }).limit(50)).data ?? [],
  });
  const total = data?.reduce((s, t) => s + Number(t.credits), 0) ?? 0;
  return (
    <Card>
      <CardHeader><CardTitle>Earnings</CardTitle>
        <CardDescription>Balance {walletBalance.toLocaleString()} credits · recent earnings {total.toLocaleString()} credits. Payout arrangements are confirmed during onboarding.</CardDescription></CardHeader>
      <CardContent>{!data?.length ? <p className="text-sm text-muted-foreground">No earnings yet.</p> : (
        <ul className="divide-y divide-border text-sm">{data.map((t) => (
          <li key={t.id} className="flex justify-between py-2"><span>{t.reason}<span className="block text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span></span><span className="text-emerald-600">+{t.credits}</span></li>))}</ul>)}</CardContent>
    </Card>
  );
};

const Dashboard = () => (
  <PageShell>
    <h1 className="text-3xl font-bold mb-6">Companion dashboard</h1>
    <Tabs defaultValue="profile">
      <TabsList className="mb-4 flex-wrap h-auto">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      <TabsContent value="profile"><ProfileTab /></TabsContent>
      <TabsContent value="content"><ContentTab /></TabsContent>
      <TabsContent value="payments"><PaymentsTab /></TabsContent>
      <TabsContent value="messages">
        <Card><CardContent className="pt-6"><Button asChild><Link to="/messages">Open inbox</Link></Button></CardContent></Card>
      </TabsContent>
    </Tabs>
  </PageShell>
);

export default Dashboard;
