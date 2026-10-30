import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const EXIT_URL = 'https://www.google.com';

/** Leaves the site immediately and removes it from back-button history. Also triggered by pressing Esc 3 times. */
export const quickExit = () => {
  try { sessionStorage.clear(); } catch { /* ignore */ }
  window.location.replace(EXIT_URL);
};

const QuickExit = () => {
  const presses = useRef<number[]>([]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const now = Date.now();
      presses.current = [...presses.current.filter((t) => now - t < 1500), now];
      if (presses.current.length >= 3) quickExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <button type="button" onClick={quickExit} aria-label="Quick exit: leave this site now"
      className="fixed bottom-24 right-3 z-[65] flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white lg:bottom-auto lg:top-24">
      <X className="h-3.5 w-3.5" aria-hidden="true" /> Quick exit
    </button>
  );
};

export default QuickExit;
