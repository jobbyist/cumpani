import LegalPage from '@/components/LegalPage';
import { COMPANY } from '@/lib/company';

const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    updated="29 October 2026"
    sections={[
      { heading: 'What we use', body: (
        <ul>
          <li><strong>Strictly necessary:</strong> sign-in session, security, age-gate and cookie-consent choice. Always on.</li>
          <li><strong>Preferences:</strong> theme and display settings (optional).</li>
          <li><strong>Payments:</strong> PayPal sets its own cookies on its checkout buttons; see PayPal's policy.</li>
        </ul>
      ) },
      { heading: 'What we do not use', body: <p>We do not run third-party advertising or affiliate tracking scripts. If that changes, we will ask for your consent first.</p> },
      { heading: 'Managing cookies', body: <p>You can change your choice using the cookie banner (clear this site's data to see it again) or through your browser settings. Blocking necessary cookies will stop sign-in from working.</p> },
      { heading: 'Contact', body: <p>{COMPANY.privacyEmail}</p> },
    ]}
  />
);

export default Cookies;
