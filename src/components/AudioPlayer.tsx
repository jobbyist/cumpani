import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  title: string;
  category: string;
  date: string;
  audioUrl: string;
  image: string;
  episodeNumber?: number;
}

const AudioPlayer = ({
  title,
  category,
  date,
  audioUrl,
  image,
  episodeNumber
}: AudioPlayerProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Track completion analytics here
      if (isAuthenticated && user) {
        const playData = {
          title,
          action: 'completed' as const,
          timestamp: new Date().toISOString(),
          userId: user.id,
          progress: currentTime,
          duration
        };
        console.log('Analytics tracked:', playData);
        const plays = JSON.parse(localStorage.getItem('podcast_analytics') || '[]');
        plays.push(playData);
        localStorage.setItem('podcast_analytics', JSON.stringify(plays));
      }
    };

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isAuthenticated, user, title, currentTime, duration]);

  const trackPlay = (action: 'started' | 'paused' | 'completed') => {
    if (!isAuthenticated || !user) return;
    
    // Mock analytics tracking - in production, this would send to an analytics service
    const playData = {
      title,
      action,
      timestamp: new Date().toISOString(),
      userId: user.id,
      progress: currentTime,
      duration
    };
    
    console.log('Analytics tracked:', playData);
    
    // Store in localStorage for demonstration
    const plays = JSON.parse(localStorage.getItem('podcast_analytics') || '[]');
    plays.push(playData);
    localStorage.setItem('podcast_analytics', JSON.stringify(plays));
  };

  const togglePlay = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to listen to podcast episodes.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      trackPlay('paused');
    } else {
      audio.play();
      trackPlay('started');
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!isAuthenticated) return;
    
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <article className="blog-card group cursor-pointer transition-all duration-300 hover:shadow-lg border border-transparent hover:border-black">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={`Podcast episode: ${title}`}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {episodeNumber && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Episode {episodeNumber}
          </div>
        )}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-lg font-semibold mb-2">Login to Listen</p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="blog-meta">{category}</span>
          <span className="text-muted-foreground text-xs" aria-hidden="true">—</span>
          <time className="blog-meta" dateTime={date}>{date}</time>
        </div>
        
        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-black transition-colors">
          {title}
        </h3>

        {/* Audio Player Controls */}
        <div className="space-y-3">
          <audio ref={audioRef} src={audioUrl} preload="metadata" />
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleProgressChange}
              disabled={!isAuthenticated}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={isAuthenticated ? "default" : "outline"}
                onClick={togglePlay}
                disabled={!isAuthenticated}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                disabled={!isAuthenticated}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                disabled={!isAuthenticated}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AudioPlayer;
