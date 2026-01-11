import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const AGE_VERIFIED_KEY = 'age_verified';

const AgeVerification = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem(AGE_VERIFIED_KEY);
    if (!hasVerified) {
      // Small delay to ensure smooth page load
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    // Redirect users under 18 to a safe external site
    // This could be made configurable via environment variables in production
    window.location.href = 'https://www.google.com';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Prevent dialog from being closed without making a choice
      // Users must explicitly accept or decline age verification
    }}>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="w-16 h-16 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center">Age Verification Required</DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <p className="text-base">
              This website contains adult content and is intended for adults only.
            </p>
            <p className="text-sm">
              By entering this site, you confirm that you are at least 18 years old (or the age of majority in your jurisdiction) and agree to view adult content.
            </p>
            <p className="text-xs text-muted-foreground">
              If you are not of legal age or do not wish to view such content, please leave now.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 pt-4">
          <Button 
            onClick={handleAccept} 
            size="lg" 
            className="w-full"
          >
            I am 18 or Older - Enter Site
          </Button>
          <Button 
            onClick={handleDecline} 
            variant="outline" 
            size="lg" 
            className="w-full"
          >
            I am Under 18 - Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerification;
