import { Link } from 'react-router-dom';
import { MapPin, Star, Lock } from 'lucide-react';
import { CompanionProfile } from '@/types/companion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface CompanionCardProps {
  companion: CompanionProfile;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const { isAuthenticated } = useAuth();

  const companionUrl = `/companion/${companion.id}`;

  return (
    <article className="blog-card group cursor-pointer transition-all duration-300 hover:shadow-lg border border-transparent hover:border-primary rounded-lg overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={companion.profileImage}
            alt={`${companion.name} - Companion in ${companion.city}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Login to View</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 bg-background">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {companion.name}, {companion.age}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {companion.city}, {companion.province}
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              R{companion.rate}/hr
            </Badge>
          </div>

          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{companion.rating}</span>
            <span className="text-sm text-muted-foreground ml-1">
              ({companion.reviewCount} reviews)
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {companion.bio}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {companion.availability}
            </span>
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link to={companionUrl}>View Profile</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/login">Login to View</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CompanionCard;
