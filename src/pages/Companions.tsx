import { useState, useEffect, Fragment } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompanionCard from '@/components/CompanionCard';
import AdPlaceholder from '@/components/AdPlaceholder';
import { companionProfiles } from '@/data/companions';
import { SOUTH_AFRICAN_CITIES, ETHNICITIES, GENDERS, SEXUAL_ORIENTATIONS } from '@/types/companion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { X, MapPin, Users, Heart, Shield } from 'lucide-react';

const Companions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'all');
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  useEffect(() => {
    const city = searchParams.get('city');
    if (city) {
      setSelectedCity(city);
    }
  }, [searchParams]);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ city: value });
    }
  };

  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedEthnicity('all');
    setSelectedGender('all');
    setSelectedOrientation('all');
    setPriceRange([0, 5000]);
    setMinRating(0);
    setAvailableOnly(false);
    setSearchParams({});
  };

  const filteredCompanions = companionProfiles.filter(c => {
    if (selectedCity !== 'all' && c.city !== selectedCity) return false;
    if (selectedEthnicity !== 'all' && c.ethnicity !== selectedEthnicity) return false;
    if (selectedGender !== 'all' && c.gender !== selectedGender) return false;
    if (selectedOrientation !== 'all' && c.sexualOrientation !== selectedOrientation) return false;
    if (c.rate < priceRange[0] || c.rate > priceRange[1]) return false;
    if (c.rating < minRating) return false;
    if (availableOnly && !c.isAvailable) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>{companionProfiles.length}+ Verified Profiles</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Discover People Near You
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Browse authentic profiles of women across South Africa looking for genuine social connections, 
              shared experiences and meaningful conversations.
            </p>
          </div>

          {/* Legal Disclaimer Banner */}
          <div className="mb-8 rounded-xl border border-border bg-muted/40 p-4 md:p-5">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Important:</strong> Cumpani is a social and dating platform. 
                All interactions are between consenting adults for recreational and social purposes only. 
                The platform does not arrange, facilitate or accept payment for any form of sexual services. 
                Profiles are for connection and messaging purposes. Always meet in public places for the first time and prioritise your safety.
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Filter Profiles</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1.5" />
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="city-filter" className="text-sm">Location</Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger id="city-filter" className="h-10">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {SOUTH_AFRICAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethnicity-filter" className="text-sm">Ethnicity</Label>
                <Select value={selectedEthnicity} onValueChange={setSelectedEthnicity}>
                  <SelectTrigger id="ethnicity-filter" className="h-10">
                    <SelectValue placeholder="All Ethnicities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ethnicities</SelectItem>
                    {ETHNICITIES.map((ethnicity) => (
                      <SelectItem key={ethnicity} value={ethnicity}>
                        {ethnicity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender-filter" className="text-sm">Gender</Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger id="gender-filter" className="h-10">
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation-filter" className="text-sm">Orientation</Label>
                <Select value={selectedOrientation} onValueChange={setSelectedOrientation}>
                  <SelectTrigger id="orientation-filter" className="h-10">
                    <SelectValue placeholder="All Orientations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orientations</SelectItem>
                    {SEXUAL_ORIENTATIONS.map((orientation) => (
                      <SelectItem key={orientation} value={orientation}>
                        {orientation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-border">
              <div className="space-y-3">
                <Label className="text-sm">Profile Preference Range</Label>
                <div className="pt-1">
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">Minimum Rating</Label>
                <div className="pt-1">
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{minRating.toFixed(1)}+ stars</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="available-only" className="text-sm">Availability</Label>
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="available-only"
                    checked={availableOnly}
                    onCheckedChange={setAvailableOnly}
                  />
                  <Label htmlFor="available-only" className="font-normal cursor-pointer text-sm">
                    Show available profiles only
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredCompanions.length}</strong> of{' '}
                <strong className="text-foreground">{companionProfiles.length}</strong> profiles
              </span>
              {selectedCity !== 'all' && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedCity}
                </span>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {filteredCompanions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanions.map((companion, index) => (
                <Fragment key={companion.id}>
                  <CompanionCard companion={companion} />
                  {(index + 1) % 6 === 0 && index !== filteredCompanions.length - 1 && (
                    <div className="col-span-full my-2">
                      <AdPlaceholder variant="horizontal" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-muted/20">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No profiles match your filters</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your location, preferences or clearing the filters to see more people.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ready to start connecting?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Create a free account or upgrade to unlock full profiles, messaging and more ways to meet people across South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/membership">View Membership</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companions;
