# Change log

## 2026-10-30 — Multi-role onboarding and Explorer navigation
- Added additive schema migration for independent companion, creator and seeker role assignments.
- Added private, owner-scoped onboarding preference records with row-level security.
- Added a guided onboarding page for role selection and optional discovery preferences.
- Added Explorer bottom-navigation entry point for primary destinations.
- Existing profile role remains for backwards compatibility; privileged admin status is not user-selectable.
- Identity verification remains a separate manual review process. No identity documents are made public.
- Migration has not been applied to Supabase. Validate against the live schema and storage policies before launch.
