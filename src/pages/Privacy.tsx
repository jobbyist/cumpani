import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p>
                At Cumpani, we collect information necessary to provide our cumpanionship services safely and effectively. This includes information you provide and data we collect automatically.
              </p>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Information you provide to us:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account registration details (name, email, phone number, age verification)</li>
                <li>Profile information for cumpanions (photos, bio, rates, availability)</li>
                <li>Payment and wallet information</li>
                <li>Communications with other users and support</li>
                <li>Booking and transaction history</li>
              </ul>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Information collected automatically:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information and IP address</li>
                <li>Usage data and browsing behavior</li>
                <li>Location data (with your permission)</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Provide, maintain, and improve our cumpanionship platform</li>
                <li>Facilitate bookings and transactions between clients and cumpanions</li>
                <li>Process payments and manage virtual wallet balances</li>
                <li>Verify user identity and conduct background checks for cumpanions</li>
                <li>Send notifications, updates, and promotional communications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Ensure safety, prevent fraud, and enforce our Terms</li>
                <li>Analyze platform usage and improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p>
                We take your privacy seriously and limit information sharing to the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Between Users:</strong> Profile information is visible to other users as intended by the platform</li>
                <li><strong>Service Providers:</strong> Payment processors, identity verification services, and hosting providers</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit permission</li>
              </ul>
              <p className="mt-4">
                We do <strong>not</strong> sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and provide personalized content. See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for detailed information about the cookies we use and how to manage them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Secure virtual wallet with encrypted payment processing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure data storage with backup and recovery systems</li>
              </ul>
              <p className="mt-4">
                While we strive to protect your information, no internet-based service can be 100% secure. Please use strong passwords and protect your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
              <p>
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object to Processing:</strong> Object to certain uses of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Age Verification and Minor Protection</h2>
              <p>
                Cumpani is exclusively for users 18 years and older. We do not knowingly collect information from minors. Our age verification system ensures compliance. If we discover that a minor has provided information, we will immediately delete it and terminate the account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations. After account deletion, we may retain certain information for legal, security, and safety purposes for up to 7 years.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a>.
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

export default Privacy;