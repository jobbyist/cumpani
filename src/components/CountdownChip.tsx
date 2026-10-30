import { CalendarDays } from 'lucide-react';
import { daysToLaunch, effectiveNow, memberPhase } from '@/lib/launch';

const CountdownChip = () => {
  const now = effectiveNow();
  const live = memberPhase(now) === 'live';
  const days = daysToLaunch(now);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
      <CalendarDays className="h-4 w-4" aria-hidden="true" />
      {live ? 'Now live in South Africa' : `Launching 1 December 2026 · ${days} day${days === 1 ? '' : 's'} to go`}
    </p>
  );
};

export default CountdownChip;
