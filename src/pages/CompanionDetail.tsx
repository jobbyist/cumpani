import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { companionProfiles } from '@/data/companions';
import { CompanionProfile } from '@/types/companion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, Mail, Lock, Calendar, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';

const CompanionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isPaidUser, user, upgradeToPaid, addToWallet } = useAuth();
  const [companion, setCompanion] = useState<CompanionProfile | null>(null);
  const [bookingAmount, setBookingAmount] = useState<number>(3);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [canRateCompanion, setCanRateCompanion] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const profile = companionProfiles.find((entry) => entry.id === id);
    if (!profile) {
      navigate('/companions');
    } else {
      setCompanion(profile);
    }
  }, [id, navigate, isAuthenticated]);

  useEffect(() => {
    if (!companion) {
      return;
    }

    const ratingStore = JSON.parse(localStorage.getItem('companion_ratings') || '{}');
    const storedCompanionRatings = ratingStore[companion.id];

    if (storedCompanionRatings?.count > 0) {
      setAverageRating(storedCompanionRatings.total / storedCompanionRatings.count);
      setTotalRatings(storedCompanionRatings.count);
    } else {
      setAverageRating(companion.rating);
      setTotalRatings(companion.reviewCount);
    }

    if (!user?.id) {
      setSelectedRating(0);
      setCanRateCompanion(false);
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('cumpani_bookings') || '[]');
    const hasBooking = bookings.some(
      (booking: { companionId: string; userId: string; status?: string }) =>
        booking.companionId === companion.id &&
        booking.userId === user.id &&
        (booking.status === 'confirmed' || booking.status === 'completed')
    );
    setCanRateCompanion(hasBooking);

    const userRating = storedCompanionRatings?.ratings?.find(
      (rating: { userId: string; rating: number }) => rating.userId === user.id
    );
    setSelectedRating(userRating?.rating || 0);
  }, [companion, user?.id]);

  if (!companion) {
    return null;
  }

  const totalCost = companion.rate * bookingAmount;
  const canAffordBooking = (user?.walletBalance || 0) >= totalCost;

  const handleCompanionRating = (value: number) => {
    if (!user?.id) {
      toast.error('Login required', {
        description: 'Please login to rate this companion.',
      });
      navigate('/login');
      return;
    }

    if (!canRateCompanion) {
      toast.error('Booking required', {
        description: 'Only users who have booked this companion can submit a rating.',
      });
      return;
    }

    const ratingStore = JSON.parse(localStorage.getItem('companion_ratings') || '{}');
    const companionRatings = ratingStore[companion.id] || {
      ratings: [],
      total: companion.rating * companion.reviewCount,
      count: companion.reviewCount,
    };

    const existingRatingIndex = companionRatings.ratings.findIndex(
      (rating: { userId: string; rating: number }) => rating.userId === user.id
    );

    if (existingRatingIndex >= 0) {
      const previousRating = companionRatings.ratings[existingRatingIndex].rating;
      companionRatings.ratings[existingRatingIndex].rating = value;
      companionRatings.total = companionRatings.total - previousRating + value;
    } else {
      companionRatings.ratings.push({
        userId: user.id,
        rating: value,
        companionId: companion.id,
        timestamp: new Date().toISOString(),
      });
      companionRatings.total += value;
      companionRatings.count += 1;
    }

    ratingStore[companion.id] = companionRatings;
    localStorage.setItem('companion_ratings', JSON.stringify(ratingStore));

    setSelectedRating(value);
    setAverageRating(companionRatings.total / companionRatings.count);
    setTotalRatings(companionRatings.count);

    toast.success('Rating submitted', {
      description: `You rated ${companion.username} ${value} star${value > 1 ? 's' : ''}.`,
    });
  };

  const handleBooking = () => {
    if (!bookingAmount || bookingAmount < 1 || bookingAmount > 24) {
      toast.error('Invalid Duration', {
        description: 'Please enter a duration between 1 and 24 hours.',
      });
      return;
    }

    if (canAffordBooking) {
      addToWallet(-totalCost);

      const booking = {
        id: Date.now().toString(),
        companionId: companion.id,
        companionName: companion.name,
        userId: user?.id,
        date: new Date().toISOString(),
        duration: bookingAmount,
        totalCost,
        status: 'confirmed',
      };

      const bookings = JSON.parse(localStorage.getItem('cumpani_bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('cumpani_bookings', JSON.stringify(bookings));
      setCanRateCompanion(true);

      toast.success('Booking Confirmed!', {
        description: `${bookingAmount} hour(s) with ${companion.name}. Total: R${totalCost}`,
      });
    } else {
      toast.error('Insufficient Funds', {
        description: 'Please add more funds to your wallet to complete this booking.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-6xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/companions')} className="mb-6">
            ← Back to Cumpanions
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <img src={companion.profileImage} alt={companion.name} className="object-cover w-full h-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {companion.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] overflow-hidden rounded-lg">
                    <img src={img} alt={`${companion.name} photo ${idx + 2}`} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {companion.name}, {companion.age}
                </h1>
                <p className="text-primary font-medium mb-2">{companion.username}</p>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  {companion.city}, {companion.province}
                </div>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-lg font-medium mr-2">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({totalRatings} reviews)</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  R{companion.rate} per hour
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">{companion.bio}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Availability</h2>
                <p className="text-muted-foreground">{companion.availability}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rate your experience
                  </CardTitle>
                  <CardDescription>
                    Only users who have booked {companion.username} can submit a rating.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => handleCompanionRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        disabled={!canRateCompanion}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            (hoveredRating || selectedRating) >= value
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                  {!canRateCompanion && (
                    <p className="text-sm text-muted-foreground">
                      Complete a booking first to unlock profile ratings.
                    </p>
                  )}
                  {canRateCompanion && selectedRating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Your rating: {selectedRating} star{selectedRating > 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isPaidUser ? (
                      <>
                        <Phone className="w-5 h-5" />
                        Contact Details
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Contact Details Locked
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isPaidUser
                      ? 'Get in touch to arrange your booking'
                      : 'Upgrade to a paid account to view contact details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPaidUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${companion.phone}`} className="hover:underline">
                          {companion.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${companion.email}`} className="hover:underline">
                          {companion.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{companion.location}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          Upgrade to a paid account to unlock contact details and location information for all
                          companions.
                        </AlertDescription>
                      </Alert>
                      <Button onClick={upgradeToPaid} className="w-full">
                        Upgrade to Paid Account (Free for Demo)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isPaidUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Book Securely
                    </CardTitle>
                    <CardDescription>Use your virtual wallet to book securely</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        step="1"
                        value={bookingAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setBookingAmount(1);
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue) && numValue >= 1 && numValue <= 24) {
                              setBookingAmount(numValue);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const numValue = parseInt(e.target.value);
                          if (isNaN(numValue) || numValue < 1) {
                            setBookingAmount(1);
                          } else if (numValue > 24) {
                            setBookingAmount(24);
                          }
                        }}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum 1 hour, maximum 24 hours</p>
                    </div>

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Cost:</span>
                      <span>R{totalCost}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Your Wallet Balance:
                      </span>
                      <span className="font-medium">R{user?.walletBalance || 0}</span>
                    </div>

                    {!canAffordBooking && (
                      <Alert>
                        <AlertDescription>
                          Insufficient balance. Add funds to your wallet to complete this booking.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={() => addToWallet(1000)} variant="outline" className="flex-1">
                        Add R1,000
                      </Button>
                      <Button onClick={() => addToWallet(5000)} variant="outline" className="flex-1">
                        Add R5,000
                      </Button>
                    </div>

                    <Button onClick={handleBooking} disabled={!canAffordBooking} className="w-full">
                      {canAffordBooking ? 'Confirm Booking' : 'Insufficient Funds'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!isPaidUser && (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Upgrade to a paid account to unlock secure booking features and access to our virtual wallet
                    system.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanionDetail;
