import { PREVIEW_MODE } from '@/lib/preview';

/** Campaign dates (SAST, UTC+2). Companion/creator applications run 2 Nov to 1 Dec 2026; members launch 1 Dec. */
export const COMPANION_SIGNUP_OPENS = new Date('2026-11-02T00:00:00+02:00');
export const PLATFORM_LAUNCH = new Date('2026-12-01T00:00:00+02:00');

export type Phase = 'soon' | 'open' | 'closed';

/** Companion/creator application window. */
export const companionPhase = (now: Date = new Date()): Phase =>
  now < COMPANION_SIGNUP_OPENS ? 'soon' : now < PLATFORM_LAUNCH ? 'open' : 'closed';

/** Members can join the waitlist until launch; full signup and subscription open on launch day. */
export const memberPhase = (now: Date = new Date()): 'waitlist' | 'live' => (now < PLATFORM_LAUNCH ? 'waitlist' : 'live');

export const daysToLaunch = (now: Date = new Date()) =>
  Math.max(0, Math.ceil((PLATFORM_LAUNCH.getTime() - now.getTime()) / 86_400_000));

/** In preview builds only, `?phase=soon|open|closed` and `?live=1` let reviewers see every state. */
export const effectiveNow = (): Date => {
  if (!PREVIEW_MODE || typeof window === 'undefined') return new Date();
  const q = new URLSearchParams(window.location.search);
  const phase = q.get('phase');
  if (phase === 'soon') return new Date('2026-10-30T12:00:00+02:00');
  if (phase === 'open') return new Date('2026-11-15T12:00:00+02:00');
  if (phase === 'closed' || q.get('live') === '1') return new Date('2026-12-02T12:00:00+02:00');
  return new Date();
};
