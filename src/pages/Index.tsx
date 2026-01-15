import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, MapPin, Heart, Wallet, Star, Award, Users, CheckCircle } from 'lucide-react';
import CompanionCard from '@/components/CompanionCard';
import LocationCarousel from '@/components/LocationCarousel';
import AdPlaceholder from '@/components/AdPlaceholder';
import StoriesSection from '@/components/StoriesSection';
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
                South Africa's Premier Adult Cumpanionship Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with sophisticated, attractive cumpanions across South Africa's major cities for an unmatched, top-tier experience. 
                Secure, discreet, and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover:scale-105 transition-transform">
                  <Link to="/companions">Browse Cumpanions</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                  <Link to="/about">Find Out More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placeholder 1 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
               <div className="flex justify-center">
             <a href="https://t.mbjrkmms.com/401328/6224/0?bo=2779,2778,2777,2776,2775&file_id=612664&po=6533&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/6224/009451A_JRKM_18_ALL_EN_22646_L.jpg" width="970" height="90" border="0" /></a>
            </div>
          </div>
        </section>

        {/* Browse by Location */}
        <section className="py-16 bg-background">
          <div className="container-blog">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Browse by Location</h2>
              <p className="text-lg text-muted-foreground">
                Discover premium cumpanions in South Africa's most popular cities
              </p>
            </div>
            <LocationCarousel />
          </div>
        </section>

        {/* Ad Placeholder 2 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <div className="flex justify-center">
              <a href="https://t.mbjrkmms.com/401328/6224/0?bo=2779,2778,2777,2776,2775&file_id=612664&po=6533&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/6224/009451A_JRKM_18_ALL_EN_22646_L.jpg" width="970" height="90" border="0" /></a>
            </div>
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
                    All cumpanions are carefully verified and screened for your safety and peace of mind.
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
            <div className="flex justify-center">
              <a href="https://t.acrsmartcam.com/401328/8873/0?bo=2779,2778,2777,2776,2775&file_id=615074&po=6533&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/8873/PCAM-192_DESIGN-22403_900250_2.B.png" width="900" height="250" border="0" /></a>
            </div>
          </div>
        </section>

        {/* Featured Cumpanions */}
        <section className="py-16">
          <div className="container-blog">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Top-Rated Cumpanions</h2>
              <p className="text-lg text-muted-foreground">
                Meet some of our most popular cumpanions
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
                <Link to="/companions">View All Cumpanions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Ad Placeholder 4 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <div className="flex justify-center">
              <a href="https://t.crjmpy.com/401328/3785/0?bo=Array&target=banners&file_id=554077&po=6456&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/3785/010769A_GDAT_18_ALL_EN_798_L.jpg" width="928" height="244" border="0" /></a>
            </div>
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
                  Create your account to browse companion profiles
                </p>
              </div>

              <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-semibold">Browse & Select</h3>
                <p className="text-muted-foreground">
                  Find the perfect cumpanion from our verified profiles
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
                  Use your secure digital wallet to buy tokens & book your appointment safely
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placeholder 5 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <div className="flex justify-center">
              <a href="https://t.crjmpy.com/401328/3785/0?bo=Array&target=banners&file_id=288555&po=6456&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/3785/20180402102132-005096A_GDAT_18_ALL_EN_798_L.gif" width="928" height="244" border="0" /></a>
            </div>
          </div>
        </section>

        {/* Become A Cumpanion Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto text-center">
              <Award className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Become A Cumpanion
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our platform as a verified cumpanion. Set your own schedule, customize your profile, 
                and build your business with our secure platform. Earn on your terms with flexible availability 
                and transparent pricing.
              </p>
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link to="/work-with-us">Learn More & Apply</Link>
              </Button>
            </div>
          </div>
        </section>

       {/* Ad Placeholder 6 */}
        <section className="py-8 bg-muted/20">
          <div className="container-blog">
            <div className="flex justify-center">
              <a href="https://t.crjmpy.com/401328/3785/0?bo=Array&target=banners&file_id=554051&po=6456&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002" target="_blank"><img src="https://www.imglnkx.com/3785/010765A_GDAT_18_ALL_EN_798_L.gif" width="928" height="244" border="0" /></a>
            </div>
          </div>
        </section>

        {/* Join The Cummunity Section */}
        <section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto text-center">
              <Users className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Join The Cummunity
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Unlock exclusive benefits with our premium membership for just <span className="text-primary font-bold">$9.99/month. Cancel anytime.</span>. 
                New members get 30% off their first booking!
              </p>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Instant access to verified profiles</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Ad-free browsing experience</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Secure virtual wallet (100% encrypted)</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">30-day money back guarantee</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Direct messaging with cumpanions</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">30% off first booking</span>
                </div>
              </div>
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link to="/upgrade">Join Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground animate-fade-in">
          <div className="container-blog text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Join Cumpani today and connect with the finest, most sought-after cumpanions across South Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="hover:scale-105 transition-transform">
                <Link to="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover:scale-105 transition-all" asChild>
                <Link to="/companions">Browse Cumpanions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stories Section - Instagram Reel Style */}
        <StoriesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
