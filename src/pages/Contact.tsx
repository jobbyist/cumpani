import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { COMPANY } from '@/lib/company';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.functions.invoke('contact-submit', { body: form });
    setBusy(false);
    if (error) {
      toast({ title: 'Could not send', description: `Please email ${COMPANY.supportEmail} instead.`, variant: 'destructive' });
      return;
    }
    toast({ title: 'Message sent', description: "Thanks. We'll reply by email." });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PageShell narrow>
      <h1 className="text-4xl font-bold mb-2">Contact us</h1>
      <p className="text-muted-foreground mb-8">
        Questions, feedback or a safety concern? Email <a className="text-primary underline" href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a> or use the form.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
          <CardDescription>To report abuse or suspected trafficking, call 0800 222 777.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={set('name')} required maxLength={100} /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={set('email')} required /></div>
            <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={form.subject} onChange={set('subject')} required maxLength={120} /></div>
            <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} value={form.message} onChange={set('message')} required maxLength={4000} /></div>
            <Button type="submit" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default Contact;
