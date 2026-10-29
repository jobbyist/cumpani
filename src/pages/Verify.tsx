import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const MAX_BYTES = 8 * 1024 * 1024;

/** Identity + age verification. Documents go to a private bucket and are reviewed by an admin. */
const Verify = () => {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [asCompanion, setAsCompanion] = useState(false);
  const [busy, setBusy] = useState(false);

  const status = profile?.verification_status ?? 'unverified';

  const upload = async (file: File, label: string) => {
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${user!.id}/${label}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('verification').upload(path, file, { contentType: file.type });
    if (error) throw error;
    return path;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !idFile || !selfie) return;
    for (const f of [idFile, selfie]) {
      if (!f.type.startsWith('image/') || f.size > MAX_BYTES) {
        toast({ title: 'Invalid file', description: 'Upload images under 8 MB.', variant: 'destructive' });
        return;
      }
    }
    setBusy(true);
    try {
      const [idPath, selfiePath] = [await upload(idFile, 'id'), await upload(selfie, 'selfie')];
      const { error } = await supabase.from('verification_requests').insert({
        user_id: user.id, id_document_path: idPath, selfie_path: selfiePath,
        status: 'pending', kind: asCompanion ? 'companion' : 'member',
      });
      if (error) throw error;
      await refresh();
      toast({ title: 'Submitted', description: 'We will review your documents shortly.' });
    } catch {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell narrow>
      <h1 className="text-3xl font-bold mb-6">Verify your account</h1>
      {status === 'verified' ? (
        <Card><CardContent className="pt-6 space-y-3">
          <p className="font-medium text-emerald-600">You are verified.</p>
          <Button asChild><Link to="/membership">Continue to membership</Link></Button>
        </CardContent></Card>
      ) : status === 'pending' ? (
        <Card><CardContent className="pt-6">
          <p>Your documents are being reviewed. This usually takes up to 24 hours. We will email you when it is done.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Confirm your identity and age</CardTitle>
            <CardDescription>
              {status === 'rejected' && 'Your last submission was not accepted. Please try again with clear photos. '}
              Upload a photo of your ID document and a selfie. Files are stored privately, used only for verification
              and deleted within 30 days of the decision. See our <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID document (photo)</Label>
                <Input id="id" type="file" accept="image/*" onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfie">Selfie holding your ID</Label>
                <Input id="selfie" type="file" accept="image/*" capture="user" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} required />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={asCompanion} onChange={(e) => setAsCompanion(e.target.checked)} className="mt-1" />
                <span>I am applying to be a companion (get a profile on the platform).</span>
              </label>
              <Button type="submit" disabled={busy || !idFile || !selfie}>{busy ? 'Uploading...' : 'Submit for review'}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
};

export default Verify;
