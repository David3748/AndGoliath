import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dickinsonPoems, Poem } from '../data/dickinson';

interface SlingshotAnimationProps {
  className?: string;
}

const SlingshotAnimation: React.FC<SlingshotAnimationProps> = ({ className = '' }) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  const [randomPoem, setRandomPoem] = useState<Poem | null>(null);

  const handleLaunch = () => {
    // Don't do anything if already launched
    if (isLaunched) return;
    
    // Get a random poem
    const randomIndex = Math.floor(Math.random() * dickinsonPoems.length);
    setRandomPoem(dickinsonPoems[randomIndex]);
    
    setIsLaunched(true);
    
    // Show poem after the rise animation
    setTimeout(() => {
      setShowPoem(true);
    }, 600);
  };

  const handleClosePoem = () => {
    setShowPoem(false);
    setIsLaunched(false); // This will trigger the idle animation
  };

  const stoneVariants = {
    idle: {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulled: {
      y: 20,
      x: 0,
      scale: 1.2,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      y: -200,
      x: 0,
      scale: 0.8,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5
      }
    }
  };

  const elasticVariants = {
    idle: {
      scaleY: 1,
      y: 0
    },
    pulled: {
      scaleY: 1.5,
      y: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      scaleY: 0.8,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Modified Dracula theme colors
  const purple = '#B39DFF';
  const pink = '#FF79C6';
  const foreground = '#F8F8F2';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="cursor-pointer"
        onClick={handleLaunch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Slingshot Y-shaped handle */}
          <motion.path
            d="M100 160 L60 80 L40 40 M100 160 L140 80 L160 40"
            stroke={purple}
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Elastic bands */}
          <motion.path
            d="M40 40 L100 70 M160 40 L100 70"
            stroke={pink}
            strokeWidth="6"
            strokeLinecap="round"
            variants={elasticVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
          />
          
          {/* Stone */}
          <motion.circle
            className="stone-ball"
            cx="100"
            cy="70"
            r="15"
            fill={foreground}
            variants={stoneVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
            whileHover="pulled"
          />
        </svg>
      </motion.div>
      
      {/* Impact effect */}
      {isLaunched && (
        <motion.div 
          className="absolute text-4xl"
          initial={{ opacity: 0, scale: 0, x: -100, y: -300 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [-100, -150, -200],
            y: [-300, -350, -300]
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          💥
        </motion.div>
      )}
      
      {/* New stone appearing animation */}
      <AnimatePresence>
        {!isLaunched && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      {/* Poem Modal */}
      <AnimatePresence>
        {showPoem && randomPoem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePoem}
          >
            <motion.div
              className="bg-gray-900 rounded-lg p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-serif text-gray-100 mb-4 border-b border-gray-700 pb-2">
                {randomPoem.title}
              </h2>
              
              <div className="prose prose-invert prose-sm md:prose-base max-w-none mb-6">
                {randomPoem.text.split('\n\n').map((stanza, index) => (
                  <p key={index} className="whitespace-pre-line mb-4 text-gray-300">
                    {stanza}
                  </p>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <a 
                  href={'https://www.poetryfoundation.org/poets/emily-dickinson'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  Emily Dickinson
                </a>
                
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                  onClick={handleClosePoem}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlingshotAnimation; 