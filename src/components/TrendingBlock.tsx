import AudioPlayer from './AudioPlayer';
import lifestylePost from '@/assets/lifestyle-post.jpg';
import fashionPost from '@/assets/fashion-post.jpg';
import workLifestyle from '@/assets/work-lifestyle.jpg';
import techPost from '@/assets/tech-post.jpg';
import businessPost from '@/assets/business-post.jpg';
import fashionLifestyle from '@/assets/fashion-lifestyle.jpg';

// Mock audio files - in production, these would be real podcast audio URLs
const MOCK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const latestPodcastEpisodes = [
  {
    title: "The Future of AI in Content Creation",
    category: "PODCAST",
    date: "December 26, 2025",
    image: techPost,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 12
  },
  {
    title: "Building Sustainable Businesses in 2025",
    category: "PODCAST", 
    date: "December 20, 2025",
    image: businessPost,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 11
  },
  {
    title: "The Psychology of User Experience Design",
    category: "PODCAST",
    date: "December 14, 2025",
    image: fashionLifestyle,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 10
  },
  {
    title: "Remote Work Revolution: What's Next?",
    category: "PODCAST",
    date: "December 7, 2025",
    image: workLifestyle,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 9
  },
  {
    title: "The Rise of Creator Economy",
    category: "PODCAST",
    date: "November 30, 2025",
    image: lifestylePost,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 8
  },
  {
    title: "Blockchain Beyond Cryptocurrency",
    category: "PODCAST",
    date: "November 22, 2025",
    image: fashionPost,
    audioUrl: MOCK_AUDIO_URL,
    episodeNumber: 7
  }
];

const TrendingBlock = () => {
  return (
    <section className="container-blog py-16 bg-muted/30">
      <div className="mb-8">
        <h2 id="trending-heading" className="section-title mb-2">Latest Podcast Episodes</h2>
        <p className="text-muted-foreground">Listen to our mini podcast series. Login to track your listening progress and enjoy exclusive content.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestPodcastEpisodes.map((episode, index) => (
          <AudioPlayer
            key={index}
            title={episode.title}
            category={episode.category}
            date={episode.date}
            image={episode.image}
            audioUrl={episode.audioUrl}
            episodeNumber={episode.episodeNumber}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingBlock;