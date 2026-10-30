import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowBigDown, ArrowBigUp, Flag, MessageSquare } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { fileReport } from '@/lib/reports';
import { useToast } from '@/hooks/use-toast';

type Sort = 'new' | 'top';

interface Post {
  id: string; title: string; body: string | null; image_path: string | null; is_adult: boolean;
  score: number; created_at: string; author_id: string;
  author: { display_name: string; role: string } | null;
  comments: { count: number }[];
}

const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(!post.is_adult);
  const [comment, setComment] = useState('');

  const { data: imageUrl } = useQuery({
    queryKey: ['post-image', post.id], enabled: !!post.image_path && reveal,
    queryFn: async () => (await supabase.storage.from('posts').createSignedUrl(post.image_path!, 3600)).data?.signedUrl,
  });
  const { data: comments } = useQuery({
    queryKey: ['comments', post.id], enabled: open,
    queryFn: async () => (await supabase.from('comments')
      .select('id, body, created_at, author:profiles!comments_author_id_fkey(display_name)')
      .eq('post_id', post.id).order('created_at')).data as unknown as { id: string; body: string; author: { display_name: string } | null }[] ?? [],
  });

  const vote = useMutation({
    mutationFn: async (value: 1 | -1) => {
      const { error } = await supabase.from('votes').upsert({ post_id: post.id, user_id: user!.id, value });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
  const addComment = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('comments').insert({ post_id: post.id, author_id: user!.id, body: comment.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setComment(''); qc.invalidateQueries({ queryKey: ['comments', post.id] }); qc.invalidateQueries({ queryKey: ['posts'] }); },
  });
  const report = async () => {
    const ok = await fileReport(user!.id, 'post', post.id);
    if (ok === null) return;
    toast(ok ? { title: 'Report sent', description: 'Thank you. Our team will review it.' } : { title: 'Could not report', variant: 'destructive' });
  };

  return (
    <Card>
      <CardContent className="flex gap-3 pt-6">
        <div className="flex flex-col items-center text-sm">
          <button aria-label="Upvote" onClick={() => vote.mutate(1)}><ArrowBigUp className="h-6 w-6" /></button>
          <span className="font-semibold">{post.score}</span>
          <button aria-label="Downvote" onClick={() => vote.mutate(-1)}><ArrowBigDown className="h-6 w-6" /></button>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs text-muted-foreground">
            {post.author?.display_name ?? 'Member'}
            {post.author?.role === 'companion' && <Badge variant="secondary" className="ml-2">Companion</Badge>}
            {' · '}{new Date(post.created_at).toLocaleDateString()}
            {post.is_adult && <Badge variant="destructive" className="ml-2">18+ adult</Badge>}
          </p>
          <h2 className="text-lg font-semibold break-words">{post.title}</h2>
          {post.body && <p className="whitespace-pre-wrap break-words text-sm">{post.body}</p>}
          {post.image_path && (reveal
            ? imageUrl && <img src={imageUrl} alt="" className="max-h-96 rounded-lg object-contain" loading="lazy" />
            : <Button size="sm" variant="outline" onClick={() => setReveal(true)}>Show adult content</Button>)}
          <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
            <button className="flex items-center gap-1" onClick={() => setOpen(!open)}>
              <MessageSquare className="h-4 w-4" />{post.comments?.[0]?.count ?? 0} comments
            </button>
            <button className="flex items-center gap-1" onClick={report}><Flag className="h-4 w-4" />Report</button>
          </div>
          {open && (
            <div className="space-y-2 border-t border-border pt-3">
              {comments?.map((c) => (
                <p key={c.id} className="text-sm"><strong>{c.author?.display_name}</strong>: {c.body}</p>
              ))}
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (comment.trim()) addComment.mutate(); }}>
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" maxLength={2000} />
                <Button type="submit" size="sm" disabled={addComment.isPending}>Post</Button>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [sort, setSort] = useState<Sort>('new');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [adult, setAdult] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', sort],
    queryFn: async () => {
      const q = supabase.from('posts')
        .select('id, title, body, image_path, is_adult, score, created_at, author_id, author:profiles!posts_author_id_fkey(display_name, role), comments(count)')
        .eq('moderation', 'approved').limit(50);
      const { data, error } = await (sort === 'top' ? q.order('score', { ascending: false }) : q.order('created_at', { ascending: false }));
      if (error) throw error;
      return data as unknown as Post[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      let image_path: string | null = null;
      if (image) {
        if (!image.type.startsWith('image/') || image.size > 8 * 1024 * 1024) throw new Error('Images only, max 8 MB');
        image_path = `${user!.id}/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const up = await supabase.storage.from('posts').upload(image_path, image, { contentType: image.type });
        if (up.error) throw up.error;
      }
      const { error } = await supabase.from('posts').insert({
        author_id: user!.id, title: title.trim(), body: body.trim() || null, is_adult: adult, image_path,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle(''); setBody(''); setImage(null); setAdult(false);
      toast({ title: 'Submitted for review', description: 'Your post will appear once approved by moderators.' });
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (e: Error) => toast({ title: 'Could not post', description: e.message, variant: 'destructive' }),
  });

  return (
    <PageShell narrow>
      <h1 className="text-3xl font-bold mb-4">Community</h1>
      <Disclaimer compact className="mb-6" />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (title.trim().length >= 3) create.mutate(); }}>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" maxLength={140} required />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share something with the community" maxLength={5000} />
            <div className="flex flex-wrap items-center gap-4">
              <Input type="file" accept="image/*" className="max-w-xs" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} /> Contains adult content
              </label>
              <Button type="submit" disabled={create.isPending}>Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={sort === 'new' ? 'default' : 'outline'} onClick={() => setSort('new')}>New</Button>
        <Button size="sm" variant={sort === 'top' ? 'default' : 'outline'} onClick={() => setSort('top')}>Top</Button>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {posts?.length === 0 && <p className="text-muted-foreground">No posts yet. Be the first.</p>}
        {posts?.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </PageShell>
  );
};

export default Feed;
