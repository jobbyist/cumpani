import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Cumpani website and services, you accept and agree to be bound by the terms and provisions of this agreement. These Terms of Service govern your use of our platform, including all features, functionalities, and services provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
              <p>
                Permission is granted to access and use Cumpani's platform for personal use in accordance with these Terms. Under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Modify, copy, or reproduce platform materials without permission</li>
                <li>Use the platform for any illegal purpose or solicitation</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Misrepresent your identity or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Age Verification and Eligibility</h2>
              <p>
                You must be at least 18 years of age to use Cumpani. By using our services, you represent and warrant that you are of legal age and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Conduct and Community Guidelines</h2>
              <p>
                All users agree to conduct themselves in a respectful, professional manner:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Respect the privacy and boundaries of all cumpanions and clients</li>
                <li>Maintain honesty in all communications and transactions</li>
                <li>Not engage in harassment, threats, or inappropriate behavior</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Report any violations or safety concerns immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Booking and Payment Terms</h2>
              <p>
                All bookings and payments are processed through our secure virtual wallet system. By making a booking, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Provide accurate payment information</li>
                <li>Pay the full amount as agreed upon before services are rendered</li>
                <li>Respect cancellation policies (see our Refund Policy)</li>
                <li>Not request services beyond those explicitly agreed upon</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cumpanion Requirements</h2>
              <p>
                All cumpanions on our platform must:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Be verified through our screening process</li>
                <li>Maintain accurate and current profile information</li>
                <li>Conduct themselves professionally at all times</li>
                <li>Report any safety concerns or violations</li>
                <li>Comply with local laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimer</h2>
              <p>
                Cumpani provides a platform connecting clients with cumpanions. We do not employ cumpanions and are not responsible for the services provided. All interactions and agreements are between clients and cumpanions. Cumpani makes no warranties regarding the quality, safety, or legality of services provided by third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitations of Liability</h2>
              <p>
                In no event shall Cumpani be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or services. Our total liability shall not exceed the amount paid by you in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
              <p>
                Cumpani may revise these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a>.
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

export default Terms;