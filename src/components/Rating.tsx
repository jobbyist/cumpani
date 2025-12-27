import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RatingProps {
  contentId: string;
  contentType: 'blog' | 'podcast';
}

const Rating = ({ contentId, contentType }: RatingProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    // Load ratings from localStorage
    const ratings = JSON.parse(localStorage.getItem('content_ratings') || '{}');
    const contentRatings = ratings[contentId] || { ratings: [], total: 0, count: 0 };
    
    if (contentRatings.count > 0) {
      setAverageRating(contentRatings.total / contentRatings.count);
      setTotalRatings(contentRatings.count);
    }

    // Check if user has already rated
    if (isAuthenticated && user) {
      const userRating = contentRatings.ratings.find((r: { userId: string; rating: number }) => r.userId === user.id);
      if (userRating) {
        setRating(userRating.rating);
        setHasRated(true);
      }
    }
  }, [contentId, isAuthenticated, user]);

  const handleRating = (value: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to rate content.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Store rating in localStorage
    const ratings = JSON.parse(localStorage.getItem('content_ratings') || '{}');
    const contentRatings = ratings[contentId] || { ratings: [], total: 0, count: 0 };
    
    // Check if user already rated
    const existingRatingIndex = contentRatings.ratings.findIndex((r: { userId: string; rating: number }) => r.userId === user?.id);
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      const oldRating = contentRatings.ratings[existingRatingIndex].rating;
      contentRatings.ratings[existingRatingIndex].rating = value;
      contentRatings.total = contentRatings.total - oldRating + value;
    } else {
      // Add new rating
      contentRatings.ratings.push({
        userId: user?.id,
        rating: value,
        timestamp: new Date().toISOString()
      });
      contentRatings.total += value;
      contentRatings.count += 1;
    }

    ratings[contentId] = contentRatings;
    localStorage.setItem('content_ratings', JSON.stringify(ratings));

    setRating(value);
    setAverageRating(contentRatings.total / contentRatings.count);
    setTotalRatings(contentRatings.count);
    setHasRated(true);

    toast({
      title: 'Rating submitted!',
      description: `You rated this ${contentType} ${value} star${value > 1 ? 's' : ''}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">Rate this {contentType}</h3>
        {totalRatings > 0 && (
          <span className="text-sm text-muted-foreground">
            ({averageRating.toFixed(1)} average from {totalRatings} rating{totalRatings > 1 ? 's' : ''})
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className="p-0 h-8 w-8"
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={!isAuthenticated}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                (hoveredRating || rating) >= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </Button>
        ))}
        {hasRated && (
          <span className="ml-4 text-sm text-muted-foreground">
            Your rating: {rating} star{rating > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground">
          Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>login</Button> to rate this content.
        </p>
      )}
    </div>
  );
};

export default Rating;
