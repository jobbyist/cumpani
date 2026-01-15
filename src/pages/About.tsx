import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart, Users, CheckCircle, DollarSign, MessageSquare, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Cumpani
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              South Africa's premier platform for verified cumpanionship services
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-16">
            <div className="aspect-video rounded-lg bg-muted mb-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Connecting You with Premium Cumpanions</p>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">What We're Built For</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Cumpani is South Africa's premier platform designed to connect individuals with 
                  verified, professional cumpanions across major cities. We've built a secure, 
                  discreet, and sophisticated ecosystem that prioritizes safety, privacy, and quality.
                </p>
                <p>
                  Our platform was created to address the need for a trustworthy, transparent 
                  cumpanionship service. Every profile is carefully verified, every transaction 
                  is encrypted, and every experience is designed with your comfort and security in mind.
                </p>
                <p>
                  Whether you're seeking sophisticated company for an event, professional cumpanionship 
                  for travel, or simply quality time with attractive, engaging individuals, Cumpani 
                  provides a safe, modern solution.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Core Values</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Verified profiles and rigorous screening</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">100% encrypted and confidential</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Premium, professional experiences</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Thriving, respectful community</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-4">Platform Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Secure virtual wallet payment system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Ad-free browsing for members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Direct messaging with cumpanions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Become A Cumpanion Section */}
          <div className="mb-16 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Become A Cumpanion
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our platform as a verified cumpanion and connect with clients across South Africa. 
                Set your own schedule, customize your profile, and build your business with our secure platform.
              </p>
            </div>
            <div className="text-center">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link to="/become-companion">Apply Now</Link>
              </Button>
            </div>
          </div>

          {/* Join The Cummunity Section */}
          <div className="mb-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 rounded-lg">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Join The Cummunity
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Unlock exclusive benefits with our premium membership for just $9.99/month. 
                Experience ad-free browsing, instant access to verified profiles, and more.
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">Instant access to verified profiles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">Ad-free browsing experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">Secure virtual wallet - 100% encrypted</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">Direct messaging with cumpanions</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">30% off your first booking</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">30-day money back guarantee</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link to="/membership">Learn More & Subscribe</Link>
              </Button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied clients and cumpanions on South Africa's most trusted platform 
              for premium cumpanionship services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/companions">Browse Cumpanions</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;