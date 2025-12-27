import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, MapPin, Heart, Wallet, Star } from 'lucide-react';
import CompanionCard from '@/components/CompanionCard';
import { companionProfiles } from '@/data/companions';

const Index = () => {
  const featuredCompanions = companionProfiles.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Premium Companionship Services
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with sophisticated, attractive companions across South Africa's major cities. 
                Secure, discreet, and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/companions">Browse Companions</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container-blog">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cumpani</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Verified Profiles</CardTitle>
                  <CardDescription>
                    All companions are carefully verified and screened for your safety and peace of mind.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your privacy is our priority. All bookings and communications are encrypted and confidential.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Wallet className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Virtual Wallet</CardTitle>
                  <CardDescription>
                    Secure payment system with our virtual wallet. No hidden fees, transparent pricing.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Companions */}
        <section className="py-16">
          <div className="container-blog">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Companions</h2>
              <p className="text-lg text-muted-foreground">
                Meet some of our most popular companions
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredCompanions.map((companion) => (
                <CompanionCard key={companion.id} companion={companion} />
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild>
                <Link to="/companions">View All Companions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/50">
          <div className="container-blog">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create your free account to browse companion profiles
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">Browse & Select</h3>
                <p className="text-muted-foreground">
                  Find the perfect companion from our verified profiles
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Upgrade Account</h3>
                <p className="text-muted-foreground">
                  Upgrade to access contact details and booking features
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold">Book Securely</h3>
                <p className="text-muted-foreground">
                  Use our virtual wallet to book your appointment safely
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-blog text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Join Cumpani today and connect with the finest companions across South Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/companions">Browse Companions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
