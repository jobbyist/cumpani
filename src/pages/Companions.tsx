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
import { X } from 'lucide-react';

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
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Premium Cumpanions
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Connect with sophisticated cumpanions across South Africa's major cities
            </p>

            {/* Filters Section */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-6 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City Filter */}
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

                {/* Ethnicity Filter */}
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

                {/* Gender Filter */}
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

                {/* Sexual Orientation Filter */}
                <div className="space-y-2">
                  <Label htmlFor="orientation-filter">Sexual Orientation</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div className="space-y-3">
                  <Label>Price Range (R/hr)</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>R{priceRange[0]}</span>
                      <span>R{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Minimum Rating Filter */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={5}
                      step={0.5}
                      value={[minRating]}
                      onValueChange={(value) => setMinRating(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{minRating.toFixed(1)} stars+</span>
                    </div>
                  </div>
                </div>

                {/* Available Only Filter */}
                <div className="space-y-3">
                  <Label htmlFor="available-only">Availability</Label>
                  <div className="flex items-center space-x-2 pt-3">
                    <Switch
                      id="available-only"
                      checked={availableOnly}
                      onCheckedChange={setAvailableOnly}
                    />
                    <Label htmlFor="available-only" className="font-normal cursor-pointer">
                      Available now only
                    </Label>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredCompanions.length} of {companionProfiles.length} companion{filteredCompanions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Ad Placeholder */}
          <div className="mb-8">
            <AdPlaceholder variant="horizontal" />
          </div>

          {/* Cumpanions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanions.map((companion, index) => (
              <Fragment key={companion.id}>
                <CompanionCard companion={companion} />
                {/* Add ad placeholder after every 3rd cumpanion */}
                {(index + 1) % 3 === 0 && index !== filteredCompanions.length - 1 && (
                  <div className="col-span-full">
                    <AdPlaceholder variant="horizontal" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {filteredCompanions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No cumpanions available in this city yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companions;
