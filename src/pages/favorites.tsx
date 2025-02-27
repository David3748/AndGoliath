import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { favorites, FavoriteItem } from '../data/favorites';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SlingshotAnimation from '../components/musicNote';
import VideoSlingshotAnimation from '../components/Slingshot Music Video Animation';

interface SelectedItem extends FavoriteItem {
  category: string;
  categoryId: string;
}

type ExcludedByCategory = Record<string, string[]>;

const getRandomFavoritesFromDifferentCategories = (
  allFavorites: typeof favorites,
  count: number = 5,
  excludedByCategory: ExcludedByCategory = {}
): { selectedItems: SelectedItem[]; updatedExcluded: ExcludedByCategory } => {
  // Filter out categories that have items.
  const availableCategories = allFavorites.filter(category => category.items && category.items.length > 0);
  // Shuffle categories and take up to `count` of them.
  const shuffledCategories = [...availableCategories].sort(() => Math.random() - 0.5);
  const chosenCategories = shuffledCategories.slice(0, count);
  const selectedItems: SelectedItem[] = [];
  const updatedExcluded: ExcludedByCategory = { ...excludedByCategory };

  chosenCategories.forEach(category => {
    // Start with an empty array if no exclusions exist yet.
    let currentExcluded = updatedExcluded[category.id] || [];
    // Filter items that haven't been shown yet.
    let availableItems = category.items.filter(item => !currentExcluded.includes(item.id));
    // If all items have been seen, reset for this category.
    if (availableItems.length === 0) {
      currentExcluded = [];
      availableItems = [...category.items];
    }
    // Pick a random item from the available items.
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    selectedItems.push({ ...randomItem, category: category.title, categoryId: category.id });
    // Update this category’s exclusion list.
    currentExcluded.push(randomItem.id);
    updatedExcluded[category.id] = currentExcluded;
  });

  return { selectedItems, updatedExcluded };
};

const Favorites: NextPage = () => {
  const [randomFavorites, setRandomFavorites] = useState<SelectedItem[]>([]);
  const [excludedByCategory, setExcludedByCategory] = useState<ExcludedByCategory>({});
  const [viewportHeight, setViewportHeight] = useState(0);

  // Calculate how many items are needed to fill the screen
  const calculateItemsNeeded = () => {
    if (viewportHeight === 0) return 5; // Default fallback
    
    // Approximate space taken by other elements (header, buttons, margins, etc.)
    // Increased to ensure "But wait, there's more" button is visible
    const otherElementsHeight = 450; // Adjusted to reserve space for the button
    const availableHeight = viewportHeight - otherElementsHeight;
    
    // Approximate height of each favorite item including margins
    const itemHeight = 120; // Adjust based on actual item height
    
    // Calculate how many items would fit, ensuring we don't completely fill the viewport
    const itemsNeeded = Math.max(3, Math.ceil(availableHeight / itemHeight));
    
    // Limit to available categories if needed
    return Math.min(itemsNeeded, favorites.length);
  };

  useEffect(() => {
    // Get initial viewport height
    setViewportHeight(window.innerHeight);
    
    // Update on window resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Only generate favorites when we have viewport height
    if (viewportHeight > 0) {
      const itemCount = calculateItemsNeeded();
      const { selectedItems, updatedExcluded } = getRandomFavoritesFromDifferentCategories(
        favorites, 
        itemCount
      );
      setRandomFavorites(selectedItems);
      setExcludedByCategory(updatedExcluded);
    }
  }, [viewportHeight]);

  const openRandomSong = () => {
    const songsArtistsCategory = favorites.find(category => category.id === 'songs-artists');
    if (songsArtistsCategory && songsArtistsCategory.items.length > 0) {
      const songWithUrls = songsArtistsCategory.items.filter(item => item.url);
      if (songWithUrls.length > 0) {
        const randomSong = songWithUrls[Math.floor(Math.random() * songWithUrls.length)];
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
      if (videosWithUrls.length > 0) {
        const randomVideo = videosWithUrls[Math.floor(Math.random() * videosWithUrls.length)];
        window.open(randomVideo.url, '_blank');
      } else {
        console.error('No videos with URLs available.');
      }
    } else {
      console.error('No videos available in favorites.');
    }
  };

  const handleMoreFavorites = () => {
    const itemCount = calculateItemsNeeded();
    const { selectedItems, updatedExcluded } = getRandomFavoritesFromDifferentCategories(
      favorites,
      itemCount,
      excludedByCategory
    );
    setRandomFavorites(selectedItems);
    setExcludedByCategory(updatedExcluded);
  };

  return (
    <Layout title="&Goliath | My Favorite Things">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-8">
            These are a few of my favorite things
          </h1>
          
          <div className="flex justify-center space-x-8 mb-4 md:mb-0">
            <div className="text-center">
              <SlingshotAnimation className="w-12 h-12 md:w-16 md:h-16" onLaunch={openRandomSong} />
            </div>

            <div className="text-center">
              <VideoSlingshotAnimation className="w-12 h-12 md:w-16 md:h-16" onLaunch={openRandomVideo} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {randomFavorites.map((item, index) => (
            <motion.div
              key={`${item.categoryId}-${item.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              className="p-4 bg-current-line rounded-lg shadow-sm border border-current-line hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-primary mb-1">{item.category}</div>
              <h3 className="text-lg font-medium text-foreground">
                {item.url ? (
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
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
            onClick={handleMoreFavorites}
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
