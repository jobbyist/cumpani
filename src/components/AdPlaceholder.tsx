import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdPlaceholderProps {
  variant?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

const AdPlaceholder = ({ variant = 'horizontal', className = '' }: AdPlaceholderProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'vertical':
        return 'h-[600px] w-full max-w-[300px]';
      case 'square':
        return 'aspect-square w-full';
      case 'horizontal':
      default:
        return 'h-[250px] w-full';
    }
  };

  return (
    <Card className={`${getVariantClasses()} ${className} bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center p-8 text-center hover:border-muted-foreground/40 transition-colors`}>
      <ExternalLink className="w-12 h-12 text-muted-foreground/40 mb-4" />
      <p className="text-sm font-medium text-muted-foreground/60 mb-2">Sponsored Content</p>
      <p className="text-xs text-muted-foreground/40">Advertisement Placeholder</p>
    </Card>
  );
};

export default AdPlaceholder;
