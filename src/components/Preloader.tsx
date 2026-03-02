import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-primary mb-2 animate-pulse">
            Cumpani
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            South Africa's Premier Adult Cumpanionship Platform
          </p>
        </div>
        
        {/* Loading Bar */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            Loading... {progress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
