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
    try {
      if (localStorage.getItem(AGE_VERIFIED_KEY)) return;
    } catch {
      // If localStorage is unavailable, always show the gate.
    }
    // Keep the gate modal-only and clean up the delayed open on unmount.
    const timer = window.setTimeout(() => setIsOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    setIsOpen(false);
    // Cookie consent waits until the age gate has been completed.
    window.dispatchEvent(new Event('cumpani:age-verified'));
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Prevent dismissal without an explicit age decision.
    }}>
      <DialogContent
        className="z-[100] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl p-6 sm:p-8"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="mx-auto w-full">
          <DialogHeader>
            <div className="mb-4 flex justify-center">
              <ShieldAlert className="h-14 w-14 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Age Verification Required</DialogTitle>
            <DialogDescription className="space-y-4 pt-4 text-center">
              <p className="text-base">
                Cumpani is a social and dating platform that includes adult content. It is for adults aged 21 and over only.
              </p>
              <p className="text-sm">
                By entering, you confirm that you are at least 21 years old. You will be asked to verify your age and identity when you create an account.
              </p>
              <p className="text-xs text-muted-foreground">
                If you are under 21, or do not wish to see adult content, please leave now.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 pt-5 sm:flex-col">
            <Button onClick={handleAccept} size="lg" className="w-full">
              I am 21 or older - Enter
            </Button>
            <Button onClick={handleDecline} variant="outline" size="lg" className="w-full">
              I am under 21 - Exit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerification;
