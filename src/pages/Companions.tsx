import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompanionCard from '@/components/CompanionCard';
import AdPlaceholder from '@/components/AdPlaceholder';
import { companionProfiles } from '@/data/companions';
import { SOUTH_AFRICAN_CITIES } from '@/types/companion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Companions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'all');

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

  const filteredCompanions = selectedCity === 'all'
    ? companionProfiles
    : companionProfiles.filter(c => c.city === selectedCity);

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

            {/* City Filter */}
            <div className="flex items-center gap-4">
              <label htmlFor="city-filter" className="font-medium text-foreground">
                Filter by City:
              </label>
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger id="city-filter" className="w-[200px]">
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
