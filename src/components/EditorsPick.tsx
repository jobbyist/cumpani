import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import businessPost from '@/assets/business-post.jpg';
import techPost from '@/assets/tech-post.jpg';
import fashionPost from '@/assets/fashion-post.jpg';
import lifestylePost from '@/assets/lifestyle-post.jpg';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: string;
  excerpt: string;
  image: string;
  url: string;
  tech: string[];
}

const EditorsPick = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const projects: ProjectItem[] = [
    {
      id: '1',
      title: 'Jobbyist',
      category: 'JOB PLATFORM',
      status: 'LIVE',
      excerpt: "Africa's Premier Job Discovery & Career Management Platform. Discover expertly curated job opportunities from verified companies across Africa.",
      image: techPost,
      url: 'https://jobbyist.africa',
      tech: ['React', 'TypeScript', 'Supabase'],
    },
    {
      id: '2',
      title: 'Monogamy',
      category: 'LEGALTECH',
      status: 'LIVE',
      excerpt: 'Unified digital asset management & AI-powered workflow automation for modern law firms. Manage assets and deploy robust automation systems.',
      image: businessPost,
      url: 'https://monogamy.legal',
      tech: ['Next.js', 'AI/ML', 'Automation'],
    },
    {
      id: '3',
      title: 'HausOfAura',
      category: 'E-COMMERCE',
      status: 'LIVE',
      excerpt: 'Intentional Living. A premium lifestyle and home goods e-commerce platform featuring curated collections for modern living.',
      image: fashionPost,
      url: 'https://hausofaura.africa',
      tech: ['Webflow', 'E-commerce', 'Payments'],
    },
    {
      id: '4',
      title: 'Laundri™',
      category: 'ON-DEMAND',
      status: 'LIVE',
      excerpt: 'On-demand laundry and dry cleaning service platform. Schedule pickups, track orders, and manage your laundry needs effortlessly.',
      image: lifestylePost,
      url: 'https://app.laundri.co.za',
      tech: ['React Native', 'Node.js', 'Logistics'],
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="container-blog py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 id="editors-pick-heading" className="section-title mb-2">Featured Projects</h2>
          <p className="text-muted-foreground">Recent development work and client collaborations</p>
        </div>
        <div className="flex space-x-2" role="group" aria-label="Navigation controls for featured projects">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Scroll to previous projects"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Scroll to next projects"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="region"
        aria-label="Featured projects carousel"
        tabIndex={0}
      >
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex-shrink-0 w-80 bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50"
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label={`View project: ${project.title}`}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={`${project.title} - ${project.category} project`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-[10px] font-semibold"
                >
                  {project.status}
                </Badge>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-primary tracking-wider">{project.category}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground leading-tight mb-3">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="text-[10px] font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EditorsPick;
