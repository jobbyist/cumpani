import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import CompanionCard from '@/components/CompanionCard';
import { useOrientation } from '@/contexts/OrientationContext';
import { useCompanions } from '@/hooks/useCompanions';
import { SOUTH_AFRICAN_CITIES } from '@/types/companion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const Companions = () => {
  const [params, setParams] = useSearchParams();
  const city = params.get('city') ?? 'all';
  const [query, setQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const { data, isLoading, isError } = useCompanions();
  const { interest, matches } = useOrientation();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((c) =>
      (city === 'all' || c.city === city) &&
      matches(c.presentsAs ? [c.presentsAs] : undefined) &&
      (!availableOnly || c.isAvailable) &&
      (!q || c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q)));
  }, [data, city, query, availableOnly, matches]);

  return (
    <PageShell>
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Discover people</h1>
        <p className="text-muted-foreground">Verified profiles across South Africa. Say hello and see where the conversation goes.{interest !== 'everyone' && <> Showing profiles matching your "I'm interested in" filter.</>}</p>
      </header>
      <Disclaimer className="mb-6" />

      <div className="mb-6 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="q">Search</Label>
          <Input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or interest" />
        </div>
        <div className="space-y-1.5">
          <Label>City</Label>
          <Select value={city} onValueChange={(v) => (v === 'all' ? setParams({}) : setParams({ city: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {SOUTH_AFRICAN_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} /> Available now
        </label>
      </div>

      {isError && <p className="text-destructive">Could not load profiles. Please try again.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}
        {results.map((c) => <CompanionCard key={c.id} companion={c} />)}
      </div>
      {!isLoading && results.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-muted-foreground">No profiles match your search.</p>
          <Button variant="outline" onClick={() => { setQuery(''); setAvailableOnly(false); setParams({}); }}>Clear filters</Button>
        </div>
      )}
    </PageShell>
  );
};

export default Companions;
