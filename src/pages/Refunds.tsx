import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Refunds = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Refund Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Overview</h2>
              <p>
                At Cumpani, we strive to provide excellent service and customer satisfaction. This Refund Policy outlines the circumstances under which refunds may be issued for membership subscriptions and other services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Membership Subscription Refunds</h2>
              <p>
                We offer a 30-day money-back guarantee for new membership subscriptions. If you are not satisfied with your premium membership, you may request a full refund within 30 days of your initial subscription date.
              </p>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Conditions for membership refunds:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refund requests must be made within 30 days of initial subscription</li>
                <li>Only applies to first-time subscribers</li>
                <li>Account must not have been used to violate our Terms of Service</li>
                <li>Renewal subscriptions are not eligible for refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Virtual Wallet and Booking Refunds</h2>
              <p>
                Refunds for virtual wallet funds and bookings are handled on a case-by-case basis:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Cancellations made 48+ hours before appointment: Full refund to virtual wallet</li>
                <li>Cancellations made 24-48 hours before appointment: 50% refund to virtual wallet</li>
                <li>Cancellations made less than 24 hours before appointment: No refund</li>
                <li>Unused virtual wallet funds can be withdrawn at any time (subject to processing fees)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. How to Request a Refund</h2>
              <p>
                To request a refund, please contact our support team:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Email: <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a></li>
                <li>Include your account email and order/transaction details</li>
                <li>Provide a brief explanation for your refund request</li>
                <li>Allow 5-7 business days for refund processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Processing Time</h2>
              <p>
                Once your refund request is approved:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Bank processing times may vary (typically 3-10 business days)</li>
                <li>You will receive email confirmation once refund is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Non-Refundable Items</h2>
              <p>
                The following items are non-refundable:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Completed services and appointments</li>
                <li>Digital content that has been downloaded or accessed</li>
                <li>Subscription renewals (only initial subscriptions are eligible)</li>
                <li>Services used in violation of our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disputes and Chargebacks</h2>
              <p>
                If you have an issue with a transaction, please contact us first before initiating a chargeback with your bank. We are committed to resolving issues fairly and efficiently. Unauthorized chargebacks may result in account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Refund Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about our Refund Policy, please contact us at <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a>.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Refunds;
