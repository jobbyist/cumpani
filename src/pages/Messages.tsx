import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string; member_id: string; companion_id: string;
  member: { display_name: string } | null; companion: { display_name: string } | null;
}
interface Msg { id: string; sender_id: string; body: string; created_at: string }

const Messages = () => {
  const { user, walletBalance, refresh } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const active = params.get('c');
  const [text, setText] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  const { data: convs } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('conversations')
        .select('id, member_id, companion_id, member:profiles!conversations_member_id_fkey(display_name), companion:profiles!conversations_companion_id_fkey(display_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Conversation[];
    },
  });

  const { data: msgs } = useQuery({
    queryKey: ['messages', active], enabled: !!active,
    queryFn: async () => {
      const { data, error } = await supabase.from('messages')
        .select('id, sender_id, body, created_at').eq('conversation_id', active!).order('created_at');
      if (error) throw error;
      return data as Msg[];
    },
  });

  // Realtime: RLS ensures only participants receive rows.
  useEffect(() => {
    if (!active) return;
    const ch = supabase.channel(`msgs-${active}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${active}` },
        () => qc.invalidateQueries({ queryKey: ['messages', active] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active, qc]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !active) return;
    const { error } = await supabase.rpc('send_message', { p_conversation: active, p_body: body });
    if (error) {
      toast({ title: 'Message not sent', description: error.message.includes('insufficient') ? 'You need credits to send messages. Top up your wallet.' : error.message, variant: 'destructive' });
      return;
    }
    setText('');
    qc.invalidateQueries({ queryKey: ['messages', active] });
    refresh();
  };

  const other = (c: Conversation) => (c.member_id === user?.id ? c.companion : c.member)?.display_name ?? 'Member';

  return (
    <PageShell>
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <div className="grid gap-4 md:grid-cols-[260px_1fr] min-h-[60vh]">
        <aside className={`rounded-xl border border-border ${active ? 'hidden md:block' : ''}`}>
          {!convs?.length && <p className="p-4 text-sm text-muted-foreground">No conversations yet. Start one from a profile.</p>}
          <ul>
            {convs?.map((c) => (
              <li key={c.id}>
                <button onClick={() => setParams({ c: c.id })}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-muted ${active === c.id ? 'bg-muted font-medium' : ''}`}>
                  {other(c)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={`flex flex-col rounded-xl border border-border ${active ? '' : 'hidden md:flex'}`}>
          {!active ? (
            <p className="m-auto text-muted-foreground">Select a conversation</p>
          ) : (
            <>
              <button className="md:hidden border-b border-border p-3 text-left text-sm" onClick={() => setParams({})}>Back</button>
              <div className="flex-1 space-y-2 overflow-y-auto p-4" aria-live="polite">
                {msgs?.map((m) => (
                  <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words ${m.sender_id === user?.id ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.body}
                  </div>
                ))}
                <div ref={bottom} />
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message (1 credit)" maxLength={2000} />
                <Button type="submit">Send</Button>
              </form>
              <p className="px-3 pb-2 text-xs text-muted-foreground">Balance: {walletBalance} credits. Do not share bank details or arrange payment for sexual services.</p>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default Messages;
