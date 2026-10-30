import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type Queue = 'posts' | 'content_items' | 'stories' | 'companion_profiles' | 'reels';

const ModerationQueue = ({ table, label, idCol = 'id', titleCol = 'title' }: { table: Queue; label: string; idCol?: string; titleCol?: string }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data } = useQuery({
    queryKey: ['admin', table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select(`${idCol}, ${titleCol}, moderation`).eq('moderation', 'pending').limit(50);
      if (error) throw error;
      return data as unknown as Record<string, string>[];
    },
  });
  const decide = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase.from(table).update({ moderation: status }).eq(idCol, id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', table] }),
    onError: (e: Error) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>{label}</CardTitle><CardDescription>Pending review: {data?.length ?? 0}</CardDescription></CardHeader>
      <CardContent>
        {!data?.length ? <p className="text-sm text-muted-foreground">Nothing waiting.</p> : (
          <ul className="divide-y divide-border">
            {data?.map((r) => (
              <li key={r[idCol]} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="truncate">{r[titleCol] || r[idCol]}</span>
                <span className="flex shrink-0 gap-2">
                  <Button size="sm" onClick={() => decide.mutate({ id: r[idCol], status: 'approved' })}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => decide.mutate({ id: r[idCol], status: 'rejected' })}>Reject</Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const Verifications = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data } = useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('verification_requests')
        .select('id, kind, id_document_path, selfie_path, created_at, user:profiles!verification_requests_user_id_fkey(display_name, dob)')
        .eq('status', 'pending').order('created_at').limit(50);
      if (error) throw error;
      return data as unknown as { id: string; kind: string; id_document_path: string; selfie_path: string; user: { display_name: string; dob: string } | null }[];
    },
  });
  const open = async (path: string) => {
    const { data: s } = await supabase.storage.from('verification').createSignedUrl(path, 300);
    if (s?.signedUrl) window.open(s.signedUrl, '_blank', 'noopener');
  };
  const review = useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const { error } = await supabase.rpc('review_verification', { p_request: id, p_approve: approve });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'verifications'] }),
    onError: (e: Error) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Verification requests</CardTitle><CardDescription>Check the ID and selfie, and that the person is 21+.</CardDescription></CardHeader>
      <CardContent>
        {!data?.length ? <p className="text-sm text-muted-foreground">Nothing waiting.</p> : (
          <ul className="divide-y divide-border">
            {data?.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span>{r.user?.display_name} <Badge variant="secondary">{r.kind}</Badge> <span className="text-muted-foreground">DOB {r.user?.dob}</span></span>
                <span className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => open(r.id_document_path)}>ID</Button>
                  <Button size="sm" variant="outline" onClick={() => open(r.selfie_path)}>Selfie</Button>
                  <Button size="sm" onClick={() => review.mutate({ id: r.id, approve: true })}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => review.mutate({ id: r.id, approve: false })}>Reject</Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const Reports = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => (await supabase.from('reports').select('id, target_type, target_id, reason, created_at, category, priority').eq('resolved', false).order('priority', { ascending: false }).order('created_at').limit(50)).data ?? [],
  });
  const resolve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reports').update({ resolved: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'reports'] }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Open reports</CardTitle><CardDescription>Escalate suspected trafficking or child abuse material to SAPS / the FPB immediately.</CardDescription></CardHeader>
      <CardContent>
        {!data?.length ? <p className="text-sm text-muted-foreground">No open reports.</p> : (
          <ul className="divide-y divide-border">
            {data?.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>{r.priority && <Badge variant="destructive" className="mr-1">Priority</Badge>}<Badge variant="secondary">{r.category ?? r.target_type}</Badge> {r.reason}</span>
                <Button size="sm" variant="outline" onClick={() => resolve.mutate(r.id)}>Resolve</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const ReelsEditor = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [edits, setEdits] = useState<Record<string, { tags?: string; audiences?: string }>>({});
  const { data } = useQuery({
    queryKey: ['admin', 'reels-all'],
    queryFn: async () => (await supabase.from('reels').select('id, title, tags, audiences, moderation').order('sort_order')).data ?? [],
  });
  const save = useMutation({
    mutationFn: async (id: string) => {
      const e = edits[id]; if (!e) return;
      const patch: Record<string, unknown> = {};
      if (e.tags !== undefined) patch.tags = e.tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (e.audiences !== undefined) patch.audiences = e.audiences.split(',').map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from('reels').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: 'Saved' }); qc.invalidateQueries({ queryKey: ['admin', 'reels-all'] }); qc.invalidateQueries({ queryKey: ['reels'] }); },
    onError: (e: Error) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Reels</CardTitle><CardDescription>Tags are comma-separated labels. Audiences: women, men, trans, everyone.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {!data?.length && <p className="text-sm text-muted-foreground">No reels yet. Seed them with scripts/seed-reels.mjs.</p>}
        {data?.map((r) => (
          <div key={r.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            <Input aria-label="Tags" value={edits[r.id]?.tags ?? r.tags.join(', ')} onChange={(e) => setEdits({ ...edits, [r.id]: { ...edits[r.id], tags: e.target.value } })} />
            <Input aria-label="Audiences" value={edits[r.id]?.audiences ?? r.audiences.join(', ')} onChange={(e) => setEdits({ ...edits, [r.id]: { ...edits[r.id], audiences: e.target.value } })} />
            <Button size="sm" onClick={() => save.mutate(r.id)}>Save</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const csv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
};
const download = (name: string, text: string) => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Signups = () => {
  const { data: waitlist } = useQuery({ queryKey: ['admin', 'waitlist'], queryFn: async () => (await supabase.from('early_access_signups').select('name, email, city, marketing_consent, created_at').order('created_at', { ascending: false }).limit(1000)).data ?? [] });
  const { data: apps } = useQuery({ queryKey: ['admin', 'apps'], queryFn: async () => (await supabase.from('companion_applications').select('name, email, city, role, links, status, created_at').order('created_at', { ascending: false }).limit(1000)).data ?? [] });
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle>Waitlist ({waitlist?.length ?? 0})</CardTitle><CardDescription>Members who want early access.</CardDescription></CardHeader>
        <CardContent><Button size="sm" variant="outline" disabled={!waitlist?.length} onClick={() => download('waitlist.csv', csv(waitlist as Record<string, unknown>[]))}>Export CSV</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Companion and creator applications ({apps?.length ?? 0})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button size="sm" variant="outline" disabled={!apps?.length} onClick={() => download('applications.csv', csv(apps as Record<string, unknown>[]))}>Export CSV</Button>
          <ul className="divide-y divide-border text-sm">{apps?.slice(0, 50).map((a) => <li key={a.email} className="flex justify-between py-2"><span>{a.name} <Badge variant="secondary">{a.role}</Badge></span><span className="text-muted-foreground">{a.city}</span></li>)}</ul>
        </CardContent></Card>
    </div>
  );
};

const Admin = () => (
  <PageShell>
    <h1 className="mb-6 text-3xl font-bold">Admin console</h1>
    <Tabs defaultValue="verify">
      <TabsList className="mb-4 h-auto flex-wrap">
        <TabsTrigger value="verify">Verification</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="reels">Reels</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="profiles">Profiles</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="signups">Signups</TabsTrigger>
      </TabsList>
      <TabsContent value="verify"><Verifications /></TabsContent>
      <TabsContent value="posts"><ModerationQueue table="posts" label="Community posts" /></TabsContent>
      <TabsContent value="reels" className="space-y-4"><ModerationQueue table="reels" label="Reel submissions" /><ReelsEditor /></TabsContent>
      <TabsContent value="content" className="space-y-4"><ModerationQueue table="content_items" label="Exclusive content" /><ModerationQueue table="stories" label="Stories" titleCol="caption" /></TabsContent>
      <TabsContent value="profiles"><ModerationQueue table="companion_profiles" label="Companion profiles" idCol="user_id" titleCol="username" /></TabsContent>
      <TabsContent value="reports"><Reports /></TabsContent>
      <TabsContent value="signups"><Signups /></TabsContent>
    </Tabs>
  </PageShell>
);

export default Admin;
