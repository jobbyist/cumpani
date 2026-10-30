import LegalPage from '@/components/LegalPage';
import { COMPANY } from '@/lib/company';

const AcceptableUse = () => (
  <LegalPage
    title="Acceptable Use Policy"
    updated="29 October 2026"
    sections={[
      { heading: 'Prohibited: sexual services for reward', body: <p>You must not offer, request, advertise, negotiate or arrange sexual services in exchange for money, credits, gifts or any other reward, on or off the Platform. You must not use Cumpani to recruit for, or promote, any escort, brothel or sex-work business. Accounts that do so are terminated and may be reported to the authorities.</p> },
      { heading: 'Prohibited: exploitation and illegal content', body: (
        <ul>
          <li>Any content depicting or sexualising a person under 18 (reported immediately to the Film and Publication Board and SAPS).</li>
          <li>Non-consensual content, including intimate images shared without consent.</li>
          <li>Trafficking, coercion, blackmail or exploitation of any person.</li>
          <li>Content that incites violence or hatred, or that is otherwise unlawful.</li>
        </ul>
      ) },
      { heading: 'Prohibited: abuse of the Platform', body: (
        <ul>
          <li>Harassment, stalking, threats, doxxing or impersonation.</li>
          <li>Taking conversations or payments off-platform to avoid fees or moderation.</li>
          <li>Fake profiles, stolen photos, scams, spam, or attempts to bypass age or identity verification.</li>
        </ul>
      ) },
      { heading: 'LGBT inclusion and protection', body: <p>Cumpani is an LGBT-friendly community. Outing or threatening to out someone, doxxing, blackmail or extortion, and harassment or hate based on sexual orientation, gender identity or expression, race or religion are prohibited and are reviewed as priority reports. Accounts that do this are removed and, where required, reported to the police.</p> },
      { heading: 'Adult content rules', body: <p>Adult content is permitted only where all participants are 21+ and have consented, it is correctly flagged as adult, and it is not shared outside the Platform's age-gated areas. We may remove content at our discretion.</p> },
      { heading: 'Reporting and enforcement', body: <p>Use the report button on any profile, post or message, or email {COMPANY.supportEmail}. Report suspected trafficking to the National Human Trafficking Hotline (0800 222 777) and child sexual abuse material to the Film and Publication Board or SAPS. Breaches result in content removal, suspension or permanent ban.</p> },
    ]}
  />
);

export default AcceptableUse;
