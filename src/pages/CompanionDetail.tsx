import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Flag } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompanions } from '@/hooks/useCompanions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const CompanionDetail = () => {
  const { id } = useParams();
  const { data } = useCompanions();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const companion = data?.find((c) => c.id === id);

  if (!companion) {
    return <PageShell><p className="text-muted-foreground">Profile not found.</p></PageShell>;
  }

  const message = async () => {
    if (companion.isSample) {
      toast({ title: 'Sample profile', description: 'This is a demo profile and cannot be messaged.' });
      return;
    }
    const { data: existing } = await supabase.from('conversations').select('id')
      .eq('member_id', user!.id).eq('companion_id', companion.id).maybeSingle();
    let convId = existing?.id as string | undefined;
    if (!convId) {
      const { data: created, error } = await supabase.from('conversations')
        .insert({ member_id: user!.id, companion_id: companion.id }).select('id').single();
      if (error) { toast({ title: 'Could not start chat', description: error.message, variant: 'destructive' }); return; }
      convId = created.id;
    }
    navigate(`/messages?c=${convId}`);
  };

  const report = async () => {
    const reason = window.prompt('Why are you reporting this profile?');
    if (!reason || reason.trim().length < 3 || companion.isSample) return;
    const { error } = await supabase.from('reports').insert({ reporter_id: user!.id, target_type: 'profile', target_id: companion.id, reason: reason.trim() });
    toast(error ? { title: 'Could not report', variant: 'destructive' } : { title: 'Report sent' });
  };

  return (
    <PageShell>
      <div className="grid gap-8 md:grid-cols-2">
        <img src={companion.profileImage} alt={`${companion.name}`} className="w-full rounded-xl object-cover aspect-[3/4]" />
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{companion.name}, {companion.age}</h1>
            <p className="text-primary">{companion.username}</p>
          </div>
          <p className="flex items-center text-muted-foreground"><MapPin className="mr-1 h-4 w-4" />{companion.city}, {companion.province}</p>
          <div className="flex gap-2">
            {companion.isAvailable && <Badge className="bg-emerald-500 text-white">Available</Badge>}
            {companion.isSample && <Badge variant="secondary">Sample profile</Badge>}
          </div>
          <p className="leading-relaxed">{companion.bio}</p>
          <p className="text-sm text-muted-foreground">{companion.availability}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={message}>Message</Button>
            <Button size="lg" variant="outline" onClick={report}><Flag className="mr-2 h-4 w-4" />Report</Button>
          </div>
          <p className="text-xs text-muted-foreground">Each message costs 1 credit. Never send money or share bank details.</p>
          <Disclaimer compact />
        </div>
      </div>
    </PageShell>
  );
};

export default CompanionDetail;
