/**
 * TEMPORARY preview mode. When VITE_PREVIEW_MODE=true at build time, logged-out visitors see the full
 * member/admin UI with sample data (no real session, no real data). The variable is set only for Vercel
 * *Preview* builds of one branch, never Production, so merging to main does not carry it.
 * Remove this file and its usages once Supabase is set up.
 */
export const PREVIEW_MODE = import.meta.env.VITE_PREVIEW_MODE === 'true';
