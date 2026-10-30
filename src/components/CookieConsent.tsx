import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const KEY = 'cookie_consent_v1';
const AGE_VERIFIED_KEY = 'age_verified';

/** Show cookie consent only after the 21+ gate is completed, and keep it clear of mobile navigation. */
const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      try {
        setShow(localStorage.getItem(AGE_VERIFIED_KEY) === 'true' && !localStorage.getItem(KEY));
      } catch {
        setShow(false);
      }
    };

    syncVisibility();
    window.addEventListener('cumpani:age-verified', syncVisibility);
    window.addEventListener('storage', syncVisibility);
    return () => {
      window.removeEventListener('cumpani:age-verified', syncVisibility);
      window.removeEventListener('storage', syncVisibility);
    };
  }, []);

  if (!show) return null;
  const accept = () => {
    try { localStorage.setItem(KEY, 'accepted'); } catch { /* ignore */ }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[60] mx-auto max-h-[40vh] max-w-xl overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-xl lg:bottom-4"
    >
      <p className="text-sm text-muted-foreground">
        We use only essential storage (sign-in, security) and a theme preference. No advertising trackers.{' '}
        <Link to="/cookies" className="underline">Cookie policy</Link>.
      </p>
      <div className="mt-3 flex justify-end"><Button size="sm" onClick={accept}>Got it</Button></div>
    </div>
  );
};

export default CookieConsent;
