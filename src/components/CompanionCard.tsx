import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { CompanionProfile } from '@/types/companion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';

interface CompanionCardProps {
  companion: CompanionProfile;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(companion.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(companion.id);
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

          {companion.isSample && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">Sample profile</Badge>
            </div>
          )}

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

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {companion.bio}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">
              {companion.availability}
            </span>
            <Button size="sm" className="shrink-0" asChild>
              <Link to={`/companion/${companion.id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CompanionCard;
