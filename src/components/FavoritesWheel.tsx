import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoriteCategory as FavoriteCategoryType } from '../data/favorites';
import FavoriteCategory from './FavoriteCategory';

interface FavoritesWheelProps {
  favorites: FavoriteCategoryType[];
}

const FavoritesWheel: React.FC<FavoritesWheelProps> = ({ favorites }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle category selection
  const selectCategory = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="favorites-container">
      {/* Navigation tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {favorites.map((category, index) => (
          <motion.button
            key={category.id}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              index === activeIndex 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => selectCategory(index)}
          >
            {category.title}
          </motion.button>
        ))}
      </div>
      
      {/* Active category display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <FavoriteCategory category={favorites[activeIndex]} />
        </motion.div>
      </AnimatePresence>
      
      {/* Category title display */}
      <div className="mt-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-primary"
          >
            {favorites[activeIndex].title}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoritesWheel; 