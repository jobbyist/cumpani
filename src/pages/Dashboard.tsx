import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowUpRight, BadgeCheck, BarChart3, Eye, Gift, ImagePlus, MessageCircle, Play, Settings, ShieldCheck, Sparkles, Wallet, Users, FileText, Plus } from 'lucide-react';

const money = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['dashboard-profile-settings', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from('companion_profiles').select('username,bio,city,is_available,presents_as').eq('user_id', user!.id).maybeSingle()).data,
  });
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [available, setAvailable] = useState(true);
  const save = useMutation({
    mutationFn: async () => {
      const clean = (username || data?.username || '').trim().replace(/^@/, '').toLowerCase();
      if (clean.length < 3) throw new Error('Choose a username with at least 3 characters.');
      const { error } = await supabase.from('companion_profiles').upsert({
        user_id: user!.id, username: clean, bio: bio || data?.bio || '', city: city || data?.city || '',
        is_available: available, presents_as: data?.presents_as ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: 'Profile saved' }); qc.invalidateQueries({ queryKey: ['dashboard-profile', user?.id] }); qc.invalidateQueries({ queryKey: ['dashboard-profile-settings', user?.id] }); },
    onError: (error: Error) => toast({ title: 'Could not save profile', description: error.message, variant: 'destructive' }),
  });
  return <Card id="profile-settings" className="surface-card border-white/10 bg-white/[0.035] text-white"><CardHeader><CardTitle>Profile settings</CardTitle></CardHeader><CardContent><form className="grid gap-4 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
    <div className="space-y-2"><Label htmlFor="dashboard-username">Username</Label><Input id="dashboard-username" placeholder={data?.username ?? 'Choose a username'} value={username} onChange={e => setUsername(e.target.value)} /></div>
    <div className="space-y-2"><Label htmlFor="dashboard-city">City</Label><Input id="dashboard-city" placeholder={data?.city ?? 'Johannesburg'} value={city} onChange={e => setCity(e.target.value)} /></div>
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="dashboard-bio">About you</Label><Textarea id="dashboard-bio" maxLength={1000} placeholder={data?.bio ?? 'Tell members a little about yourself'} value={bio} onChange={e => setBio(e.target.value)} /></div>
    <label className="flex items-center gap-2 text-sm"><Switch checked={available} onCheckedChange={setAvailable} /> Available for discovery</label>
    <div className="sm:col-span-2"><Button type="submit" disabled={save.isPending} className="bg-pink-600 text-white hover:bg-pink-500">{save.isPending ? 'Saving...' : 'Save profile'}</Button></div>
  </form></CardContent></Card>;
};

const CreatorUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const upload = useMutation({
    mutationFn: async () => {
      if (!file || !file.type.match(/^(image|video)\//) || file.size > 50 * 1024 * 1024) throw new Error('Choose an image or video under 50 MB.');
      const path = `${user!.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const stored = await supabase.storage.from('exclusive').upload(path, file, { contentType: file.type });
      if (stored.error) throw stored.error;
      const { error } = await supabase.from('content_items').insert({ author_id: user!.id, title: title.trim(), media_path: path, price_credits: price });
      if (error) throw error;
    },
    onSuccess: () => { setTitle(''); setFile(null); setPrice(0); toast({ title: 'Content submitted for review' }); qc.invalidateQueries({ queryKey: ['dashboard-content', user?.id] }); },
    onError: (error: Error) => toast({ title: 'Upload failed', description: error.message, variant: 'destructive' }),
  });
  return <Card id="creator-upload" className="surface-card border-white/10 bg-white/[0.035] text-white"><CardHeader><CardTitle>Create content</CardTitle></CardHeader><CardContent><form className="grid gap-4 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); upload.mutate(); }}>
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="content-title">Title</Label><Input id="content-title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} /></div>
    <div className="space-y-2"><Label htmlFor="content-price">Price in credits</Label><Input id="content-price" type="number" min={0} max={1000} value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value)))} /></div>
    <div className="space-y-2"><Label htmlFor="content-file">Image or video</Label><Input id="content-file" type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} required /></div>
    <p className="text-xs text-white/50 sm:col-span-2">Uploads are reviewed before they become visible to members. Maximum file size: 50 MB.</p>
    <div className="sm:col-span-2"><Button type="submit" disabled={upload.isPending} className="bg-pink-600 text-white hover:bg-pink-500">{upload.isPending ? 'Uploading...' : 'Submit content'}</Button></div>
  </form></CardContent></Card>;
};

const Dashboard = () => {
  const { user, profile, walletBalance, isAdmin } = useAuth();
  const { data: companionProfile } = useQuery({
    queryKey: ['dashboard-profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from('companion_profiles').select('username,bio,city,is_available,moderation').eq('user_id', user!.id).maybeSingle()).data,
  });
  const { data: content = [] } = useQuery({
    queryKey: ['dashboard-content', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from('content_items').select('id,title,moderation,created_at').eq('author_id', user!.id).order('created_at', { ascending: false }).limit(6)).data ?? [],
  });
  const { data: earnings = [] } = useQuery({
    queryKey: ['dashboard-earnings', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from('wallet_transactions').select('credits,created_at,reason').eq('user_id', user!.id).eq('type', 'earn').order('created_at', { ascending: false }).limit(6)).data ?? [],
  });
  const { data: messages = [] } = useQuery({
    queryKey: ['dashboard-messages', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from('messages').select('id').eq('sender_id', user!.id).limit(100)).data ?? [],
  });
  const totalEarned = useMemo(() => earnings.reduce((sum, item) => sum + Number(item.credits || 0), 0), [earnings]);
  const name = profile?.display_name || user?.name || 'there';
  const isCreator = content.length > 0;
  const verified = profile?.verification_status === 'verified' || isAdmin;

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="relative isolate overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-neutral-900 via-neutral-950 to-pink-950/60 p-5 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="page-eyebrow">Your cumpanion space</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Good to see you, {name}.</h1>
              <p className="mt-2 text-sm text-white/65 sm:text-base">Your space. Your pace. Your growth.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                <span className={verified ? 'text-emerald-400' : 'text-amber-300'}>{verified ? <BadgeCheck className="inline h-4 w-4" /> : <ShieldCheck className="inline h-4 w-4" />}</span>
                <span className="text-white/85">{verified ? 'Profile verified' : 'Verification in progress'}</span>
              </div>
            </div>
            <Button asChild className="rounded-full bg-pink-600 text-white hover:bg-pink-500"><Link to="/verify">Account status <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { label: 'Wallet balance', value: walletBalance.toLocaleString('en-ZA'), icon: Wallet, hint: 'Available credits' },
            { label: 'Messages sent', value: String(messages.length), icon: MessageCircle, hint: 'Recent inbox activity' },
            { label: 'Content items', value: String(content.length), icon: ImagePlus, hint: 'Your latest uploads' },
            { label: 'Credits earned', value: totalEarned.toLocaleString('en-ZA'), icon: Gift, hint: 'Recent earnings' },
          ].map(({ label, value, icon: Icon, hint }) => (
            <Card key={label} className="surface-card border-white/10 bg-white/[0.035] text-white">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between"><span className="text-xs text-white/60 sm:text-sm">{label}</span><Icon className="h-5 w-5 text-pink-500" /></div>
                <p className="mt-3 text-2xl font-extrabold sm:text-3xl">{value}</p>
                <p className="mt-1 text-[11px] text-white/45">{hint}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
          <Card className="surface-card border-white/10 bg-white/[0.035] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5 text-pink-500" /> Your profile</CardTitle>
              <Link to="#profile-settings" className="text-xs font-semibold text-pink-400">Manage profile <ArrowUpRight className="inline h-3 w-3" /></Link>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-3xl font-bold text-pink-400">{name.charAt(0).toUpperCase()}</div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{name}</h2>
                  <p className="mt-1 text-sm text-white/55">{companionProfile?.username ? '@' + companionProfile.username : profile?.city || 'Add your location'}</p>
                  <div className="mt-2 flex flex-wrap gap-2"><Badge className="border-pink-500/20 bg-pink-500/10 text-pink-300">Cumpanion</Badge>{isCreator && <Badge variant="secondary">Creator</Badge>}</div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-white/60"><span>Profile status</span><span>{companionProfile?.moderation ?? 'Not submitted'}</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-pink-600 to-fuchsia-400" /></div>
              <Button asChild variant="outline" className="mt-5 w-full border-pink-500/40 bg-transparent text-white hover:bg-pink-500/10"><Link to="/dashboard/profile">Edit profile</Link></Button>
            </CardContent>
          </Card>

          <Card className="surface-card border-white/10 bg-white/[0.035] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base"><Play className="h-5 w-5 text-pink-500" /> Creator studio</CardTitle>
              <Button asChild size="sm" className="rounded-full bg-pink-600 text-white hover:bg-pink-500"><Link to="#creator-upload"><Plus className="mr-1 h-4 w-4" /> Create</Link></Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: 'Reels', icon: Play }, { label: 'Posts', icon: ImagePlus }, { label: 'Drafts', icon: FileText }].map(({ label, icon: Icon }) => (
                  <Link key={label} to="/dashboard/content" className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-neutral-900/80 p-3 text-center transition hover:border-pink-500/50 hover:bg-pink-500/5">
                    <Icon className="h-6 w-6 text-pink-500" /><span className="text-xs font-semibold">{label}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/50">Publish content, track moderation and manage your creator presence.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="surface-card border-white/10 bg-white/[0.035] text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Gift className="h-5 w-5 text-pink-500" /> Earnings & rewards</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">{money(totalEarned)}</p>
              <p className="text-xs text-white/50">Estimated recent credit earnings</p>
              <div className="mt-4 space-y-3">{earnings.slice(0, 3).map((item, i) => <div key={i} className="flex justify-between gap-3 border-t border-white/10 pt-2 text-sm"><span className="truncate text-white/65">{item.reason || 'Credit earned'}</span><span className="font-semibold text-emerald-400">+{item.credits}</span></div>)}</div>
              <Button asChild variant="link" className="mt-2 px-0 text-pink-400"><Link to="/wallet">View wallet <ArrowUpRight className="ml-1 h-3 w-3" /></Link></Button>
            </CardContent>
          </Card>
          <Card className="surface-card border-white/10 bg-white/[0.035] text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-5 w-5 text-pink-500" /> Recent activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Eye className="h-5 w-5 text-pink-500" /><div className="min-w-0"><p className="text-sm font-medium">Profile activity</p><p className="text-xs text-white/45">Your profile visibility and status</p></div></div>
              <div className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-pink-500" /><div className="min-w-0"><p className="text-sm font-medium">Inbox</p><p className="text-xs text-white/45">{messages.length} recent sent messages in the last 100 records</p></div><Button asChild size="sm" variant="outline" className="ml-auto border-white/15 bg-transparent"><Link to="/messages">Open</Link></Button></div>
              <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-pink-500" /><div className="min-w-0"><p className="text-sm font-medium">Keep building your presence</p><p className="text-xs text-white/45">Complete your profile and share approved content.</p></div></div>
            </CardContent>
          </Card>
        </section>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs text-white/50">
          <span><Settings className="mr-2 inline h-4 w-4 text-pink-500" /> Account tools and settings</span>
          <div className="flex gap-4"><Link to="/verify" className="hover:text-pink-400">Verification</Link><Link to="/messages" className="hover:text-pink-400">Messages</Link><Link to="/wallet" className="hover:text-pink-400">Wallet</Link>{isAdmin && <Link to="/admin" className="hover:text-pink-400">Admin</Link>}</div>
        </div>
        <ProfileSettings />
        <CreatorUpload />
      </div>
    </PageShell>
  );
};

export default Dashboard;
