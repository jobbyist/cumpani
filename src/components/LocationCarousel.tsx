import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { companionProfiles } from '@/data/companions';

interface LocationData {
  city: string;
  image: string;
  description: string;
}

const popularLocations: LocationData[] = [
  {
    city: 'Cape Town',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop',
    description: 'Stunning coastal city with vibrant nightlife and culture',
  },
  {
    city: 'Sandton',
    image: 'https://images.unsplash.com/photo-1590155787507-e52ad3d0e1d1?w=800&h=600&fit=crop',
    description: 'Upscale business district with luxury lifestyle',
  },
  {
    city: 'Pretoria',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop',
    description: 'Capital city rich in history and culture',
  },
  {
    city: 'Durban',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    description: 'Sunny beaches and warm hospitality',
  },
  {
    city: 'Midrand',
    image: 'https://images.unsplash.com/photo-1573837002449-fa77a8f7d90f?w=800&h=600&fit=crop',
    description: 'Modern hub connecting Johannesburg and Pretoria',
  },
  {
    city: 'Johannesburg',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop',
    description: 'Economic powerhouse and cultural melting pot',
  },
  {
    city: 'Port Elizabeth',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    description: 'Friendly city with beautiful beaches and safari access',
  },
  {
    city: 'Bloemfontein',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop',
    description: 'City of roses with rich heritage and charm',
  },
  {
    city: 'Stellenbosch',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop',
    description: 'Wine country with historic architecture and mountain views',
  },
  {
    city: 'Centurion',
    image: 'https://images.unsplash.com/photo-1590155787507-e52ad3d0e1d1?w=800&h=600&fit=crop',
    description: 'Thriving suburb with modern amenities and lifestyle',
  },
];

const LocationCarousel = () => {
  const getCompanionCountByCity = (city: string) => {
    return companionProfiles.filter(c => c.city === city).length;
  };

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {popularLocations.map((location) => {
            const companionCount = getCompanionCountByCity(location.city);
            return (
              <CarouselItem key={location.city} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Link to={`/companions?city=${location.city}`} className="block">
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                    <div className="relative h-[200px] overflow-hidden">
                      <img
                        src={location.image}
                        alt={`${location.city} - Browse cumpanions`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center mb-1">
                          <MapPin className="w-5 h-5 mr-2" />
                          <h3 className="text-xl font-bold">{location.city}</h3>
                        </div>
                        <p className="text-sm text-white/90 mb-2">{location.description}</p>
                        <div className="flex items-center text-xs">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{companionCount} Cumpanions Available</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-12" />
        <CarouselNext className="right-0 translate-x-12" />
      </Carousel>
    </div>
  );
};

export default LocationCarousel;
