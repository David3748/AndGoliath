import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { favorites, FavoriteItem } from '../data/favorites';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  return (
    <Layout title="&Goliath | My Favorite Things">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6 text-foreground border-b border-current-line pb-2">
          Random Favorites
        </h1>
        
        <p className="text-comment mb-6 md:mb-10 leading-relaxed text-sm md:text-base">
          These are a few of my favorite things
        </p>
        
        <div className="space-y-6">
          {randomFavorites.map((item) => (
            <motion.div
              key={`${item.category}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-current-line rounded-lg shadow-sm border border-current-line hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-primary mb-1">{item.category}</div>
              <h3 className="text-lg font-medium text-foreground">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" 
                     className="hover:text-primary transition-colors">
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </h3>
              {item.description && (
                <p className="text-comment text-sm mt-1">{item.description}</p>
              )}
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
          
          <div>
            <Link href="/">
              <motion.div
                className="inline-block px-4 py-2 md:px-6 md:py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-colors text-sm md:text-base"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Back to Home
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Favorites;