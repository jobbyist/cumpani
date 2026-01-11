import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, MapPin, Heart, Wallet, Star } from 'lucide-react';
import CompanionCard from '@/components/CompanionCard';
import LocationCarousel from '@/components/LocationCarousel';
import AdPlaceholder from '@/components/AdPlaceholder';
import { companionProfiles } from '@/data/companions';

const Index = () => {
  const featuredCompanions = companionProfiles.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background animate-fade-in">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground animate-slide-in">
                Premium Companionship Services
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with sophisticated, attractive companions across South Africa's major cities. 
                Secure, discreet, and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover:scale-105 transition-transform">
                  <Link to="/companions">Browse Companions</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placeholder 1 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <AdPlaceholder variant="horizontal" />
          </div>
        </section>

        {/* Browse by Location */}
        <section className="py-16 bg-background">
          <div className="container-blog">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Browse by Location</h2>
              <p className="text-lg text-muted-foreground">
                Discover premium companions in South Africa's most popular cities
              </p>
            </div>
            <LocationCarousel />
          </div>
        </section>

        {/* Ad Placeholder 2 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <AdPlaceholder variant="horizontal" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container-blog">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Why Choose Cumpani</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in">
                <CardHeader>
                  <Shield className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Verified Profiles</CardTitle>
                  <CardDescription>
                    All companions are carefully verified and screened for your safety and peace of mind.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <Lock className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your privacy is our priority. All bookings and communications are encrypted and confidential.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
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

        {/* Ad Placeholder 3 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <AdPlaceholder variant="horizontal" />
          </div>
        </section>

        {/* Featured Companions */}
        <section className="py-16">
          <div className="container-blog">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Featured Companions</h2>
              <p className="text-lg text-muted-foreground">
                Meet some of our most popular companions
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredCompanions.map((companion, index) => (
                <div key={companion.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CompanionCard companion={companion} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link to="/companions">View All Companions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Ad Placeholder 4 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <AdPlaceholder variant="horizontal" />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/50">
          <div className="container-blog">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0s' }}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-semibold">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create your free account to browse companion profiles
                </p>
              </div>

              <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-semibold">Browse & Select</h3>
                <p className="text-muted-foreground">
                  Find the perfect companion from our verified profiles
                </p>
              </div>

              <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-semibold">Upgrade Account</h3>
                <p className="text-muted-foreground">
                  Upgrade to access contact details and booking features
                </p>
              </div>

              <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto hover:scale-110 transition-transform">
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

        {/* Ad Placeholder 5 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <AdPlaceholder variant="horizontal" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground animate-fade-in">
          <div className="container-blog text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Join Cumpani today and connect with the finest companions across South Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="hover:scale-105 transition-transform">
                <Link to="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover:scale-105 transition-all" asChild>
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
