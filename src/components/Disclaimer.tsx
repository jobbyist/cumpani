import { ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

/** Standing legal disclaimer. Wording is a draft pending attorney review. */
const Disclaimer = ({ className = '', compact = false }: DisclaimerProps) => (
  <aside
    role="note"
    className={`flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground ${className}`}
  >
    <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
    <p className="leading-relaxed">
      <strong>Cumpani is a social and dating platform for adults aged 21 and over. It is not an escort or
      sex-work service.</strong>{' '}
      {compact
        ? 'Soliciting or offering payment for sexual services is strictly prohibited.'
        : 'Offering, soliciting or arranging payment in exchange for sexual services is strictly prohibited and will result in account termination and, where required, a report to the authorities. Credits unlock platform features only (such as messaging and content). The platform contains adult content; you must be 21 or older to use it.'}
    </p>
  </aside>
);

export default Disclaimer;
