import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const KEY = 'cookie_consent_v1';

/** Cumpani only sets strictly necessary storage and a theme preference; this notice records acknowledgement. */
const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setShow(!localStorage.getItem(KEY)); } catch { setShow(true); }
  }, []);

  if (!show) return null;
  const accept = () => { try { localStorage.setItem(KEY, 'accepted'); } catch { /* ignore */ } setShow(false); };

  return (
    <div role="dialog" aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-24 lg:bottom-4 z-[60] mx-auto max-w-xl rounded-xl border border-border bg-background p-4 shadow-xl">
      <p className="text-sm text-muted-foreground">
        We use only essential storage (sign-in, security) and a theme preference. No advertising trackers.{' '}
        <Link to="/cookies" className="underline">Cookie policy</Link>.
      </p>
      <div className="mt-3 flex justify-end"><Button size="sm" onClick={accept}>Got it</Button></div>
    </div>
  );
};

export default CookieConsent;
