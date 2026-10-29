import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';
import { COMPANY } from '@/lib/company';

const Terms = () => (
  <LegalPage
    title="Terms of Use"
    updated="29 October 2026"
    intro={<p>These Terms govern your use of Cumpani (the "Platform"), operated by {COMPANY.legalName} ("Cumpani", "we", "us"). By creating an account you agree to them. If you do not agree, do not use the Platform.</p>}
    sections={[
      { heading: 'Who we are (ECTA s43)', body: (
        <ul>
          <li>Legal name: {COMPANY.legalName}; registration number: {COMPANY.registrationNumber}; VAT: {COMPANY.vatNumber}</li>
          <li>Physical address: {COMPANY.physicalAddress}</li>
          <li>Email: {COMPANY.supportEmail}; website: za.cumpani.fun</li>
        </ul>
      ) },
      { heading: 'What Cumpani is, and is not', body: (
        <>
          <p>Cumpani is a members-only social and dating platform for adults. Members and companions can create profiles, chat, share content and join a community feed.</p>
          <p><strong>Cumpani is not an escort agency, brothel or sex-work service.</strong> We do not arrange, facilitate, advertise or take a fee in connection with sexual services. Offering, requesting or negotiating payment or any other reward in exchange for sexual acts is prohibited, and is unlawful in South Africa. Credits and subscription fees pay only for platform features.</p>
        </>
      ) },
      { heading: 'Eligibility and verification', body: (
        <ul>
          <li>You must be at least <strong>21 years old</strong>. We may require proof of age and identity, and may suspend accounts that cannot be verified.</li>
          <li>You must provide accurate information and keep your login details secure. You are responsible for activity on your account.</li>
          <li>Companions must complete identity and age verification before their profile is shown to members. Verification confirms identity and age only. It is not an endorsement or background check of any person.</li>
        </ul>
      ) },
      { heading: 'Membership subscription', body: (
        <p>Access to companion profiles, messaging and the community feed requires an active membership at <strong>R99 per month</strong> (inclusive of VAT where applicable), billed monthly through PayPal. The subscription renews automatically until cancelled. You may cancel at any time from your account or PayPal; access continues until the end of the paid period. See our <Link to="/refunds">Refunds &amp; Cancellations</Link> policy.</p>
      ) },
      { heading: 'Credits (digital wallet)', body: (
        <ul>
          <li>Credits are purchased with a ZAR amount converted to USD at the live exchange rate shown at checkout, and are used to unlock platform features such as messages and exclusive content.</li>
          <li>Credits are a licence to use the Platform. They are not money, are not a deposit, bear no interest and are not redeemable for cash except where the law requires a refund.</li>
          <li>Companions earn a share of credits spent on their content and messages. Payout terms are set out in the Companion terms provided at onboarding.</li>
        </ul>
      ) },
      { heading: 'Prohibited conduct', body: (
        <p>You must follow our <Link to="/acceptable-use">Acceptable Use Policy</Link> and <Link to="/community-guidelines">Community Guidelines</Link>. In particular you must not: solicit or offer sexual services for reward; share content involving anyone under 18 or any non-consensual content; harass, threaten or exploit others; impersonate anyone; use the Platform for human trafficking or exploitation; or attempt to circumvent verification, payments or security.</p>
      ) },
      { heading: 'Adult content', body: (
        <p>The Platform contains content intended for adults. Content must comply with the Films and Publications Act 65 of 1996 (as amended). Prohibited material is removed and reported to the Film and Publication Board and the South African Police Service where required.</p>
      ) },
      { heading: 'Your content', body: (
        <p>You keep ownership of content you post, and grant Cumpani a non-exclusive, worldwide licence to host and display it on the Platform. You confirm you have the right to post it and the consent of everyone shown in it. We may remove content that breaches these Terms.</p>
      ) },
      { heading: 'Safety', body: (
        <p>Meeting people carries risk. Cumpani does not supervise offline meetings and is not responsible for the conduct of members or companions. Use sound judgement, meet in public places and tell someone you trust. Report concerns using the in-app report button or at {COMPANY.supportEmail}.</p>
      ) },
      { heading: 'Suspension and termination', body: (
        <p>We may suspend or terminate accounts that breach these Terms or the law. Unused credits on an account terminated for breach are forfeited, subject to your statutory rights.</p>
      ) },
      { heading: 'Limitation of liability', body: (
        <p>To the extent permitted by law, and without limiting your rights under the Consumer Protection Act 68 of 2008, Cumpani is not liable for indirect or consequential loss, or for the acts of other users. Nothing in these Terms excludes liability that cannot lawfully be excluded.</p>
      ) },
      { heading: 'Electronic communications', body: (
        <p>You agree that we may communicate with you electronically and that electronic acceptance of these Terms is binding in terms of the Electronic Communications and Transactions Act 25 of 2002. You may withdraw from a distance transaction within the cooling-off period set out in section 44 of that Act, where it applies.</p>
      ) },
      { heading: 'Governing law and disputes', body: (
        <p>These Terms are governed by the laws of the Republic of South Africa. Complaints may be sent to {COMPANY.supportEmail}. You may also approach the National Consumer Commission or the relevant ombud. Courts in South Africa have jurisdiction.</p>
      ) },
      { heading: 'Changes', body: <p>We may update these Terms. Material changes will be notified in-app or by email, and continued use after the effective date means you accept them.</p> },
    ]}
  />
);

export default Terms;
