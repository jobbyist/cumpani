# Legal review checklist (for the South African attorney)

All legal pages in `src/pages/{Terms,Privacy,Cookies,Refunds,AcceptableUse,CommunityGuidelines}.tsx` are **drafts** and are marked as such in the UI. Remove the banner in `src/components/LegalPage.tsx` only after sign-off.

## Placeholders to fill (`src/lib/company.ts`)
Registered name, CIPC number, VAT number, physical address, Information Officer (also register with the Information Regulator).

## Questions for counsel
1. **Sexual Offences Act / Criminal Law (Sexual Offences) Amendment Act 32 of 2007:** is the positioning (social/dating platform, no payment for sexual services, credits for messaging/content only) sufficient to avoid facilitation/"keeping a brothel" exposure? Review the companion revenue-share (70% of credits spent on messages/content).
2. **Films and Publications Act 65 of 1996 (as amended 2019):** FPB online distributor registration; classification of user-generated adult content; takedown and reporting procedure.
3. **POPIA:** lawful grounds for processing ID documents and selfies; special personal information (sex life, orientation) consent wording; retention (30 days for verification files); operator agreements (Supabase, PayPal, Resend, Vercel); s72 cross-border transfers; Information Regulator notifications.
4. **CPA 68 of 2008:** auto-renewing subscription (s14), cancellation rights, VAT-inclusive ZAR pricing while billed in USD via PayPal, refund terms (s56), unfair terms.
5. **ECTA 25 of 2002:** s43 supplier information, s44 cooling-off for electronic transactions.
6. **Stored value:** credits as a closed-loop platform licence vs. National Payment System Act / FICA implications, and companion payouts.
7. **PayPal:** confirm in writing that PayPal will approve this merchant category (adult content). Not yet confirmed.
8. Age verification standard for a 21+ adult platform (manual ID review currently).

## Added with reels / orientation filter
9. **Explicit user-generated content:** FPB classification and age-restriction duties, online distributor registration, takedown process, and the reel creators' written authorisation (operator states they hold it).
10. **Orientation preference** is special personal information: confirm consent wording and the browser-only default.
11. **Ethnicity labels on content** (e.g. a reel tag): confirm this is acceptable alongside the Privacy Policy statement that we do not filter or recommend by race or ethnic origin; the filter itself only uses women/men/trans/everyone.

## Added with the pre-launch campaign
12. **"Verified" badge on sample profiles:** the operator chose to label fictional sample profiles "Verified". Counsel to advise on CPA s41 (false or misleading representations) before launch; the safest course is to remove sample profiles when real verified companions are live.
13. **Early-access waitlist and applications:** POPIA consent wording, retention, and the 21+ check; companion applications are accepted only 2 Nov to 1 Dec 2026 (enforced in the database).
14. **LGBT safety measures:** special personal information handling, priority-report process, extortion/outing escalation to SAPS, and Equality Act / hate-speech exposure for user content.
