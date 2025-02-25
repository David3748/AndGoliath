import React from 'react';
import { motion } from 'framer-motion';
import { FavoriteCategory as FavoriteCategoryType } from '../data/favorites';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface FavoriteCategoryProps {
  category: FavoriteCategoryType;
}

const FavoriteCategory: React.FC<FavoriteCategoryProps> = ({ category }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-white border border-gray-100 shadow-sm"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <div className="mb-4 border-b border-gray-100 pb-2">
        <h3 className="text-xl font-serif text-gray-800">{category.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{category.createdAt}</p>
      </div>
      
      <ul className="favorite-list space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {category.items.map((item) => (
          <motion.li
            key={item.id}
            variants={itemVariants}
            whileHover={{ x: 2 }}
            className="py-1 transition-all duration-200"
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">•</span>
                
                {item.url ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-primary font-medium flex items-center group text-sm"
                  >
                    <span>{item.name}</span>
                    <motion.span 
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ y: -1 }}
                    >
                      <FaExternalLinkAlt size={10} />
                    </motion.span>
                  </a>
                ) : (
                  <span className="font-medium text-gray-700 text-sm">{item.name}</span>
                )}
              </div>
              
              {item.description && (
                <motion.div 
                  className="mt-1 ml-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  
                  {item.url && (
                    <motion.div 
                      className="mt-1 text-[10px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary truncate block max-w-full overflow-hidden"
                      >
                        {item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FavoriteCategory; 