import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';
import { COMPANY } from '@/lib/company';

const Refunds = () => (
  <LegalPage
    title="Refunds & Cancellations"
    updated="29 October 2026"
    sections={[
      { heading: 'Cancelling your membership', body: <p>You can cancel the R99/month membership at any time from your account or in PayPal. Cancellation stops future charges; you keep access until the end of the period already paid for.</p> },
      { heading: 'Refund of the first payment', body: <p>If you are unhappy, request a refund of your first membership payment within 7 days of purchase at {COMPANY.supportEmail}. This is in addition to your rights under the Consumer Protection Act 68 of 2008 and, for distance transactions, section 44 of the Electronic Communications and Transactions Act 25 of 2002, which cannot be limited by these terms.</p> },
      { heading: 'Credits', body: (
        <ul>
          <li>Unused credits from a top-up can be refunded within 7 days of purchase, to your original PayPal payment method, provided none of that top-up has been spent.</li>
          <li>Credits already spent on messages or unlocked content are not refundable, unless the content or service was not delivered as described.</li>
          <li>Credits are not redeemable for cash and do not expire while your account is in good standing.</li>
        </ul>
      ) },
      { heading: 'Failed or duplicate payments', body: <p>If you were charged but credits or membership were not applied, or you were charged twice, contact us with your PayPal transaction ID and we will correct it or refund you.</p> },
      { heading: 'Disputes', body: <p>Please contact us before opening a PayPal dispute so we can resolve it quickly. See also our <Link to="/terms">Terms of Use</Link>.</p> },
    ]}
  />
);

export default Refunds;
