import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
              <p>
                Cumpani uses cookies for various purposes to improve your experience:
              </p>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Essential Cookies:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and login status</li>
                <li>Security and fraud prevention</li>
                <li>Site functionality and preferences</li>
                <li>Session management</li>
              </ul>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Performance Cookies:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics and site usage statistics</li>
                <li>Understanding user behavior and patterns</li>
                <li>Improving site performance</li>
                <li>A/B testing and feature optimization</li>
              </ul>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Functional Cookies:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remembering your preferences (theme, language, etc.)</li>
                <li>Personalizing your experience</li>
                <li>Providing enhanced features</li>
                <li>Location-based services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Third-Party Cookies</h2>
              <p>
                We may use third-party services that set cookies on your device:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Analytics Providers:</strong> To understand site usage and improve our services</li>
                <li><strong>Payment Processors:</strong> To facilitate secure transactions</li>
                <li><strong>Advertising Partners:</strong> To deliver relevant advertisements (you can opt out)</li>
                <li><strong>Social Media:</strong> To enable social sharing features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Types of Cookies We Use</h2>
              <p>
                Our website uses both session cookies and persistent cookies:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
                <li><strong>First-Party Cookies:</strong> Set directly by Cumpani</li>
                <li><strong>Third-Party Cookies:</strong> Set by external services we use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Managing Your Cookie Preferences</h2>
              <p>
                You have control over how cookies are used on your device:
              </p>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Browser Settings:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Most browsers allow you to refuse or accept cookies</li>
                <li>You can delete cookies that have already been set</li>
                <li>You can set your browser to notify you when cookies are sent</li>
                <li>Check your browser's help section for specific instructions</li>
              </ul>
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Important Note:</h3>
              <p className="mt-4">
                Disabling certain cookies may impact your experience on our website. Essential cookies are necessary for the site to function properly and cannot be disabled without affecting site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Do Not Track Signals</h2>
              <p>
                Some browsers have a "Do Not Track" feature that lets you tell websites you do not want your online activities tracked. We respect your privacy preferences, but please note that we currently do not respond to Do Not Track signals due to lack of industry standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Consent and Age Verification</h2>
              <p>
                By using our website, you consent to our use of cookies as described in this policy. As our service requires users to be 18 years or older, we do not knowingly collect data from minors. Our age verification system uses cookies to remember your verification status.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. We will notify you of any significant changes by posting a notice on our website. Please review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at <a href="mailto:help@cumpani.fun" className="text-primary hover:underline">help@cumpani.fun</a>.
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

export default Cookies;
