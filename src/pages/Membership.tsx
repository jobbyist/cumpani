import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, Shield, Lock, Wallet, MessageSquare, Sparkles, Tag, Gift, RefreshCw } from 'lucide-react';

const Membership = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Users className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join The Cummunity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Unlock premium features and exclusive benefits for just <span className="text-primary font-bold">$9.99/month</span>
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">New users get 30% off their first booking!</span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="mb-16">
            <Card className="border-2 border-primary shadow-xl max-w-2xl mx-auto">
              <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mx-auto mb-4">
                  <Sparkles className="w-4 h-4" />
                  PREMIUM MEMBERSHIP
                </div>
                <CardTitle className="text-4xl mb-2">
                  <span className="text-5xl font-bold">$9.99</span>
                  <span className="text-xl text-muted-foreground">/month</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  Everything you need for a premium companionship experience
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <Button size="lg" className="w-full max-w-xs hover:scale-105 transition-transform">
                    Subscribe Now
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    30-day money back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Member Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CheckCircle className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Instant Access to Verified Profiles</CardTitle>
                  <CardDescription>
                    Browse and contact all verified companions instantly. No waiting periods, 
                    no restrictions. Full access to premium profiles and detailed information.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Sparkles className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Ad-Free Browsing Experience</CardTitle>
                  <CardDescription>
                    Enjoy a clean, distraction-free platform. No advertisements, no interruptions. 
                    Focus on finding the perfect companion without any distractions.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Wallet className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Secure Virtual Wallet</CardTitle>
                  <CardDescription>
                    100% encrypted and confidential payment system. Your financial information 
                    is protected with bank-level security. Quick and easy transactions.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Direct Messaging</CardTitle>
                  <CardDescription>
                    Message companions directly after booking. Coordinate details, ask questions, 
                    and build a connection through our secure messaging platform.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Tag className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>30% Off First Booking</CardTitle>
                  <CardDescription>
                    New members receive an exclusive 30% discount on their first booking. 
                    Experience premium companionship at an incredible introductory price.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>30-Day Money Back Guarantee</CardTitle>
                  <CardDescription>
                    Not satisfied? Get a full refund within 30 days, no questions asked. 
                    We're confident you'll love the Cumpani experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Additional Benefits Section */}
          <div className="mb-16 bg-muted p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-8">What Else You Get</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">Get help faster with dedicated member support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Advanced Search Filters</h3>
                  <p className="text-sm text-muted-foreground">Find exactly what you're looking for with premium filters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Favorite Companions</h3>
                  <p className="text-sm text-muted-foreground">Save your favorite profiles for quick access</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Booking History</h3>
                  <p className="text-sm text-muted-foreground">Track and manage all your bookings in one place</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Early Access</h3>
                  <p className="text-sm text-muted-foreground">Be the first to see new companion profiles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Member-Only Features</h3>
                  <p className="text-sm text-muted-foreground">Access exclusive features as we add them</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Your Security & Privacy</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Lock className="w-12 h-12 mb-4 text-primary mx-auto" />
                  <CardTitle className="text-lg">100% Encrypted</CardTitle>
                  <CardDescription>
                    All payments and messages are encrypted end-to-end
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 mb-4 text-primary mx-auto" />
                  <CardTitle className="text-lg">Confidential</CardTitle>
                  <CardDescription>
                    Your information is never shared with third parties
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <CheckCircle className="w-12 h-12 mb-4 text-primary mx-auto" />
                  <CardTitle className="text-lg">Verified Profiles</CardTitle>
                  <CardDescription>
                    Every companion is verified and background checked
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
                  <CardDescription>
                    Yes! You can cancel your membership at any time. There are no long-term contracts 
                    or commitments. If you cancel within 30 days, you'll get a full refund.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How does the 30% discount work?</CardTitle>
                  <CardDescription>
                    The 30% discount is automatically applied to your first booking as a new member. 
                    Simply complete your booking and the discount will be reflected in your total.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is my payment information secure?</CardTitle>
                  <CardDescription>
                    Absolutely. We use bank-level encryption and never store your full payment details. 
                    All transactions are processed through our secure virtual wallet system.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens after the 30-day guarantee?</CardTitle>
                  <CardDescription>
                    After 30 days, your membership continues at the same $9.99/month rate. 
                    You can still cancel anytime, but refunds are only available within the first 30 days.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Join?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your premium membership today and experience the best of Cumpani. 
              Risk-free with our 30-day money back guarantee.
            </p>
            <Button size="lg" className="hover:scale-105 transition-transform">
              Subscribe for $9.99/Month
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No commitment • Cancel anytime • 30-day money back guarantee
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Membership;
