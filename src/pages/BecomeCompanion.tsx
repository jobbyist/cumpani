import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, DollarSign, Calendar, Shield, Settings, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

const BecomeCompanion = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Award className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Become A Cumpanion
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join South Africa's premier cumpanionship platform. Build your business, set your schedule, 
              and connect with verified clients in a safe, professional environment.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Join Cumpani?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <DollarSign className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Earn On Your Terms</CardTitle>
                  <CardDescription>
                    Set your own rates and availability. Keep the majority of your earnings with 
                    transparent, competitive platform fees.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Calendar className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Flexible Schedule</CardTitle>
                  <CardDescription>
                    You're in control. Set your availability, accept or decline bookings, 
                    and manage your calendar from our easy-to-use dashboard.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Safe & Secure</CardTitle>
                  <CardDescription>
                    All clients are verified. Payments are processed through our secure virtual wallet. 
                    Your safety and privacy are our top priorities.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Settings className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Customize Your Profile</CardTitle>
                  <CardDescription>
                    Create a professional profile that showcases your personality and services. 
                    Set your preferences and boundaries clearly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Direct Communication</CardTitle>
                  <CardDescription>
                    Chat with clients through our secure messaging system. Screen potential bookings 
                    before accepting.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Grow Your Business</CardTitle>
                  <CardDescription>
                    Build your reputation with our review system. Featured profiles get priority 
                    placement and increased visibility.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="mb-16 bg-muted p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-8">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Basic Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Must be 18 years or older</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Valid South African ID or proof of legal residence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Professional photos for profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Clear background check</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">What We Look For</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Professional and reliable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Excellent communication skills</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Respectful and discreet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Commitment to safety and professionalism</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Apply</h3>
                <p className="text-muted-foreground">
                  Submit your application with photos and basic information
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">Verification</h3>
                <p className="text-muted-foreground">
                  Complete our verification process including ID and background check
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Set Up Profile</h3>
                <p className="text-muted-foreground">
                  Create your profile, set your rates, and customize your preferences
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold">Start Earning</h3>
                <p className="text-muted-foreground">
                  Go live and start accepting bookings on your schedule
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of successful cumpanions already earning on Cumpani. 
              Start your application today and take control of your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="hover:scale-105 transition-transform">
                Apply Now
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomeCompanion;
