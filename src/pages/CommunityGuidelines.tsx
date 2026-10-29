import LegalPage from '@/components/LegalPage';

const CommunityGuidelines = () => (
  <LegalPage
    title="Community Guidelines"
    updated="29 October 2026"
    sections={[
      { heading: 'Be real and be respectful', body: <p>Use your own photos, be honest in your profile, and treat people with respect. Consent matters in every conversation: "no" means no.</p> },
      { heading: 'Keep it on the platform', body: <p>Keep conversations on Cumpani so reports and safety tools work. Never share bank details, ID documents or passwords with anyone.</p> },
      { heading: 'Stay safe when meeting', body: <p>Meet in a public place first, tell a friend where you are going, arrange your own transport, and leave if you feel uncomfortable. Cumpani does not supervise meetings.</p> },
      { heading: 'Posting in the community feed', body: <p>Posts are reviewed before they appear. Flag adult content correctly. No hate speech, spam, doxxing, solicitation of paid sexual services, or anything involving minors. See the Acceptable Use Policy for the full list.</p> },
      { heading: 'Report problems', body: <p>Use the report button on any post, profile or message. Our team reviews every report.</p> },
    ]}
  />
);

export default CommunityGuidelines;
