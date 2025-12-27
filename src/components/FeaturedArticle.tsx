import heroImage from '@/assets/hero-image.jpg';
import skinlabsBanner from '@/assets/skinlabs-banner.jpg';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  isAnnouncement?: boolean;
}

const FeaturedArticle = ({
  title,
  subtitle,
  category,
  date,
  excerpt,
  image,
  isAnnouncement = false
}: FeaturedArticleProps) => {
  return (
    <article className="container-blog py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <div className="space-y-6 order-2 md:order-1">
          {isAnnouncement && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground uppercase tracking-wider px-4 py-1.5 text-xs font-semibold">
              Official Announcement
            </Badge>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="uppercase tracking-wider font-medium">{category}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={date}>{date}</time>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg text-primary font-medium">
              {subtitle}
            </p>
          )}
          
          <p className="text-muted-foreground leading-relaxed">
            {excerpt}
          </p>

          <div className="flex gap-4 pt-2">
            <Button size="lg" className="uppercase tracking-wider">
              Get Notified
              <span className="ml-2" aria-hidden="true">→</span>
            </Button>
            <Button variant="outline" size="lg" className="uppercase tracking-wider">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Image */}
        <div className="order-1 md:order-2">
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <img
              src={image}
              alt={`${title} - ${category}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

// Default Featured Article - SkinLabs Relaunch Announcement
export const DefaultFeaturedArticle = () => (
  <FeaturedArticle
    title="The Official SkinLabs® Product Relaunch Is Finally Here"
    subtitle="Next Generation Skincare Science"
    category="Product Launch"
    date="Coming Soon"
    excerpt="After months of anticipation, we're thrilled to announce that SkinLabs® is officially relaunching with an entirely reimagined product line. Stay tuned for exclusive details coming soon."
    image={skinlabsBanner}
    isAnnouncement={true}
  />
);

export default FeaturedArticle;
