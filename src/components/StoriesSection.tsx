import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { featuredArticles } from '@/data/articles';

const StoriesSection = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container-blog">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Stories & Editorials</h2>
            <p className="text-lg text-muted-foreground">
              Exclusive content for our members
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Members Only Content</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to access our exclusive articles and editorials featuring industry insights, 
              creator success stories, and expert guidance.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredArticles.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredArticles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentArticle = featuredArticles[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container-blog">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Stories & Editorials</h2>
          <p className="text-lg text-muted-foreground">
            Swipe through our exclusive content collection
          </p>
        </div>

        {/* Instagram Reel-style Stories Container */}
        <div className="max-w-md mx-auto relative">
          {/* Story Progress Indicators */}
          <div className="flex gap-1 mb-4">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : index < currentIndex 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>

          {/* Main Story Card - Instagram Reel Style */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="relative h-[600px] bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {currentArticle.category}
                  </div>
                  <h3 className="text-2xl font-bold leading-tight">
                    {currentArticle.title}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">
                    {currentArticle.subtitle}
                  </p>
                  <p className="text-sm text-white/80 line-clamp-3">
                    {currentArticle.content}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-white/70">
                      {currentArticle.author} • {new Date(currentArticle.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-white/70">
                      {currentIndex + 1} / {featuredArticles.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                aria-label="Next story"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {featuredArticles.map((article, index) => (
              <button
                key={article.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary scale-110' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`View ${article.title}`}
              >
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
