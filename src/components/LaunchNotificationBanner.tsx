import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LaunchNotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-4 relative">
      <div className="container-blog mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm md:text-base font-medium">
              🎉 Launching April 1st, 2026! Sign up for just <span className="font-bold">$9.99</span> for the first 3 months of access to premium Cumpanions - Limited time offer!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="secondary" 
              asChild
              className="hover:scale-105 transition-transform"
            >
              <Link to="/membership">Learn More</Link>
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchNotificationBanner;
