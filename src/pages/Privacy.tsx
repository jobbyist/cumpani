import LegalPage from '@/components/LegalPage';
import { COMPANY } from '@/lib/company';

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    updated="29 October 2026"
    intro={<p>This Policy explains how {COMPANY.legalName} ("Cumpani") processes personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>}
    sections={[
      { heading: 'Responsible party and Information Officer', body: (
        <ul>
          <li>Responsible party: {COMPANY.legalName}, {COMPANY.physicalAddress}</li>
          <li>Information Officer: {COMPANY.informationOfficer} ({COMPANY.privacyEmail})</li>
        </ul>
      ) },
      { heading: 'Information we collect', body: (
        <ul>
          <li><strong>Account:</strong> email, display name, date of birth, city/province, password (stored hashed by our authentication provider).</li>
          <li><strong>Verification:</strong> government ID document and selfie (companions, and members where required) to confirm identity and that you are 21 or older.</li>
          <li><strong>Payments:</strong> PayPal transaction and subscription identifiers and amounts. We do not receive or store your card details.</li>
          <li><strong>Activity:</strong> messages, posts, comments, reports, wallet transactions, device and log data.</li>
          <li><strong>Special personal information:</strong> because Cumpani is a dating platform, profile content you choose to share may reveal information about your sex life, orientation, race or ethnic origin. Sharing it is optional, and we process it only with your consent. We do not use filters or recommendations based on race or ethnic origin.</li>
        </ul>
      ) },
      { heading: 'Why we process it (purpose and lawful grounds)', body: (
        <ul>
          <li>Provide your account, membership and wallet (performance of a contract).</li>
          <li>Verify age and identity and prevent exploitation, fraud and abuse (legal obligation and legitimate interest).</li>
          <li>Moderate content and respond to reports (legitimate interest; legal obligation under the Films and Publications Act).</li>
          <li>Send service messages, and marketing only where you opt in (consent, POPIA s69).</li>
        </ul>
      ) },
      { heading: 'Who we share it with (operators)', body: (
        <p>We use operators to process information on our behalf under written agreements: Supabase (hosting, database, authentication, storage), PayPal (payments), Resend (email delivery) and Vercel (website hosting). We may disclose information to law enforcement or regulators where the law requires it. We do not sell personal information.</p>
      ) },
      { heading: 'Cross-border transfers', body: <p>Some operators store data outside South Africa. We transfer information only to recipients bound by law, binding rules or agreements providing a substantially similar level of protection, as required by POPIA s72.</p> },
      { heading: 'Security and breaches', body: <p>We apply reasonable technical and organisational safeguards, including encryption in transit, row-level access controls and restricted storage for ID documents. If there are reasonable grounds to believe your information has been accessed without authority, we will notify the Information Regulator and you as soon as reasonably possible (POPIA s22).</p> },
      { heading: 'Retention', body: (
        <ul>
          <li>Verification documents: deleted within 30 days after verification is decided, unless a longer period is required by law.</li>
          <li>Financial records: retained as required by tax and company law (up to 5 years).</li>
          <li>Account data: deleted or de-identified after account closure, subject to legal obligations and abuse prevention.</li>
        </ul>
      ) },
      { heading: 'Your rights', body: <p>You may ask us to confirm what we hold about you, access it, correct or delete it, object to processing, or withdraw consent, by emailing {COMPANY.privacyEmail}. You may lodge a complaint with the Information Regulator (South Africa): inforeg.org.za, complaints.IR@justice.gov.za.</p> },
      { heading: 'Children', body: <p>Cumpani is only for people aged 21 and over. If we learn that someone under 21 has registered we will delete the account. Report concerns to {COMPANY.privacyEmail}.</p> },
      { heading: 'Changes', body: <p>We will post updates here and notify you of material changes.</p> },
    ]}
  />
);

export default Privacy;
