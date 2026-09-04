import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { X, Heart, Shield, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Companions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'all');
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
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
    setMinRating(0);
    setAvailableOnly(false);
    setSearchParams({});
  };

  const filteredCompanions = companionProfiles.filter(c => {
    if (selectedCity !== 'all' && c.city !== selectedCity) return false;
    if (selectedEthnicity !== 'all' && c.ethnicity !== selectedEthnicity) return false;
    if (selectedGender !== 'all' && c.gender !== selectedGender) return false;
    if (selectedOrientation !== 'all' && c.sexualOrientation !== selectedOrientation) return false;
    if (c.rating < minRating) return false;
    if (availableOnly && !c.isAvailable) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Discover Matches Across South Africa
                </h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                  Browse verified profiles of women looking for genuine social connections and dating experiences in major cities.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span>{companionProfiles.length}+ active profiles</span>
              </div>
            </div>

            {/* Legal / Platform Disclaimer */}
            <Alert className="border-primary/20 bg-primary/5">
              <Shield className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Cumpani is a dating and social matching platform.</strong> We facilitate connections between consenting adults for social and dating purposes only. 
                Cumpani does not arrange, facilitate or promote any form of paid sexual services. All members are independent adults.
              </AlertDescription>
            </Alert>
          </div>

          {/* Filters */}
          <div className="bg-card border rounded-xl p-5 md:p-6 space-y-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Refine your search
              </h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1.5" />
                Clear filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city-filter">Location</Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger id="city-filter">
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
                <Label htmlFor="ethnicity-filter">Ethnicity</Label>
                <Select value={selectedEthnicity} onValueChange={setSelectedEthnicity}>
                  <SelectTrigger id="ethnicity-filter">
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
                <Label htmlFor="gender-filter">Gender</Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger id="gender-filter">
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
                <Label htmlFor="orientation-filter">Orientation</Label>
                <Select value={selectedOrientation} onValueChange={setSelectedOrientation}>
                  <SelectTrigger id="orientation-filter">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <Label>Minimum Rating</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  {minRating > 0 ? `${minRating.toFixed(1)}+ stars` : 'Any rating'}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="available-only">Availability</Label>
                <div className="flex items-center space-x-3 pt-1">
                  <Switch
                    id="available-only"
                    checked={availableOnly}
                    onCheckedChange={setAvailableOnly}
                  />
                  <Label htmlFor="available-only" className="font-normal cursor-pointer">
                    Show available profiles only
                  </Label>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground border-t pt-4">
              Showing <span className="font-medium text-foreground">{filteredCompanions.length}</span> of{' '}
              <span className="font-medium text-foreground">{companionProfiles.length}</span> profiles
            </div>
          </div>

          {/* Results Grid */}
          {filteredCompanions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {filteredCompanions.map((companion, index) => (
                <Fragment key={companion.id}>
                  <CompanionCard companion={companion} />
                  {(index + 1) % 8 === 0 && index !== filteredCompanions.length - 1 && (
                    <div className="col-span-full py-2">
                      <AdPlaceholder variant="horizontal" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No profiles match your filters</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your location, ethnicity or rating preferences to see more matches.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}

          {/* Bottom disclaimer */}
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground max-w-3xl mx-auto space-y-2">
            <p>
              All profiles are provided by independent adult members. Cumpani is a platform for social and dating connections only.
            </p>
            <p>
              We do not facilitate, arrange or accept payment for any sexual services. Members interact as consenting adults.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companions;
