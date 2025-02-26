import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { favorites, FavoriteItem } from '../data/favorites';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SlingshotAnimation from '../components/musicNote';
import VideoSlingshotAnimation from '../components/Slingshot Music Video Animation';

const getRandomFavorites = (allFavorites: typeof favorites, count: number = 5): (FavoriteItem & { category: string })[] => {
  // Flatten all items from all categories into a single array
  const allItems = allFavorites.flatMap(category =>
    category.items.map(item => ({
      ...item,
      category: category.title
    }))
  );

  // Shuffle array and take first 5 items
  const shuffled = [...allItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const Favorites: NextPage = () => {
  const [randomFavorites, setRandomFavorites] = useState<(FavoriteItem & { category: string })[]>([]);

  useEffect(() => {
    setRandomFavorites(getRandomFavorites(favorites));
  }, []);

  const openRandomSong = () => {
    const songsArtistsCategory = favorites.find(category => category.id === 'songs-artists');
    if (songsArtistsCategory && songsArtistsCategory.items.length > 0) {
      const songWithUrls = songsArtistsCategory.items.filter(item => item.url);
      console.log('Available songs with URLs:', songWithUrls);
      if (songWithUrls.length > 0) {
        const randomSong = songWithUrls[Math.floor(Math.random() * songWithUrls.length)];
        console.log('Selected song:', randomSong);
        window.open(randomSong.url, '_blank');
      } else {
        console.error('No songs with URLs available.');
      }
    } else {
      console.error('No songs available in favorites.');
    }
  };

  const openRandomVideo = () => {
    const videosCategory = favorites.find(category => category.id === 'videos');
    if (videosCategory && videosCategory.items.length > 0) {
      const videosWithUrls = videosCategory.items.filter(item => item.url);
      console.log('Available videos with URLs:', videosWithUrls);
      if (videosWithUrls.length > 0) {
        const randomVideo = videosWithUrls[Math.floor(Math.random() * videosWithUrls.length)];
        console.log('Selected video:', randomVideo);
        window.open(randomVideo.url, '_blank');
      } else {
        console.error('No videos with URLs available.');
      }
    } else {
      console.error('No videos available in favorites.');
    }
  };

  return (
    <Layout title="&Goliath | My Favorite Things">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mt-12 md:mt-16 flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-sm text-primary mb-2">Random Song</p>
            <SlingshotAnimation
              className="w-16 h-16"
              onLaunch={openRandomSong}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-primary mb-2">Random Video</p>
            <VideoSlingshotAnimation
              className="w-16 h-16"
              onLaunch={openRandomVideo}
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6 text-foreground border-b border-current-line pb-2 mt-8">
          These are a few of my favorite things
        </h1>

        <div className="space-y-6">
          {randomFavorites.map((item, index) => (
            <motion.div
              key={`${item.category}-${item.id}`}
              initial={{ opacity: 0, x: -50 }} // Slide in from left
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1, // Staggered delay for each item
                ease: "easeOut"
              }}
              className="p-4 bg-current-line rounded-lg shadow-sm border border-current-line hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-primary mb-1">{item.category}</div>
              <h3 className="text-lg font-medium text-foreground">
                {item.url ? (
                  <Link href={item.url} target="_blank" rel="noopener noreferrer"
                     className="hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <button
            onClick={() => setRandomFavorites(getRandomFavorites(favorites))}
            className="mb-6 px-4 py-2 bg-primary text-background rounded-md hover:bg-purple transition-colors"
          >
            But wait, there's more
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Favorites;