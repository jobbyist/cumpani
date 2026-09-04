import { Link } from 'react-router-dom';
import { MapPin, Star, Lock, Heart } from 'lucide-react';
import { CompanionProfile } from '@/types/companion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useState } from 'react';

interface CompanionCardProps {
  companion: CompanionProfile;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLiked, setIsLiked] = useState(isFavorite(companion.id));

  const companionUrl = isAuthenticated ? `/companion/${companion.id}` : '/membership';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(companion.id);
    setIsLiked(!isLiked);
  };

  return (
    <article className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/40 rounded-xl overflow-hidden bg-card">
      <div className="relative">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={companion.profileImage}
            alt={`${companion.name} – profile in ${companion.city}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-[2px]">
              <div className="text-center text-white px-4">
                <Lock className="w-10 h-10 mx-auto mb-2 opacity-90" />
                <p className="font-medium text-sm">Sign in to view full profile</p>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-background/85 backdrop-blur-sm rounded-full hover:scale-110 transition-transform z-10 shadow-sm"
            aria-label={isLiked ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
            />
          </button>

          {/* Availability badge */}
          {companion.isAvailable && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 text-xs">
                Available
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {companion.name}, {companion.age}
              </h3>
              <p className="text-xs font-medium text-primary truncate">{companion.username}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">{companion.city}, {companion.province}</span>
          </div>

          <div className="flex items-center mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
            <span className="text-sm font-medium">{companion.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({companion.reviewCount})
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {companion.bio}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">
              {companion.availability}
            </span>
            <Button size="sm" className="shrink-0" asChild>
              <Link to={companionUrl}>
                {isAuthenticated ? 'View Profile' : 'Unlock Profile'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CompanionCard;
