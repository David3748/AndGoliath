import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicSlingshotAnimationProps {
  className?: string;
  onLaunch?: () => void;
}

const MusicSlingshotAnimation: React.FC<MusicSlingshotAnimationProps> = ({ 
  className = '',
  onLaunch
}) => {
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunch = () => {
    // Don't do anything if already launched
    if (isLaunched) return;
    
    setIsLaunched(true);
    
    // Call the onLaunch handler passed from parent component
    if (onLaunch) {
      // Add a slight delay to allow animation to start
      setTimeout(() => {
        onLaunch();
      }, 300);
    }
    
    // Reset the launched state after animation completes
    setTimeout(() => {
      setIsLaunched(false);
    }, 1500);
  };

  const noteVariants = {
    idle: {
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
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
      rotate: 0,
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
      rotate: 360,
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

  // Colors with a music theme
  const frameColor = '#6A329F'; // Purple for music theme
  const elastic = '#FFFFFF';
  const noteColor = '#3498DB'; // Blue note

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
            stroke={frameColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Elastic bands */}
          <motion.path
            d="M40 40 L100 70 M160 40 L100 70"
            stroke={elastic}
            strokeWidth="6"
            strokeLinecap="round"
            variants={elasticVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
          />
          
          {/* Music note shape */}
          <motion.g
            variants={noteVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
            whileHover="pulled"
          >
            {/* Note head */}
            <ellipse
              cx="100"
              cy="70"
              rx="9"
              ry="7"
              fill={noteColor}
              transform="rotate(-20 100 70)"
            />
            
            {/* Note stem */}
            <rect
              x="108"
              y="52"
              width="2.5"
              height="18"
              fill={noteColor}
              transform="rotate(-20 108 52)"
            />
            
            {/* Note flag */}
            <path
              d="M110 52 C118 52, 118 58, 110 58"
              stroke={noteColor}
              strokeWidth="2.5"
              fill="none"
              transform="rotate(-20 110 52)"
            />
          </motion.g>
        </svg>
      </motion.div>
      
      {/* Impact effect - multiple music notes */}
      {isLaunched && (
        <>
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
            🎵
          </motion.div>
          <motion.div 
            className="absolute text-3xl"
            initial={{ opacity: 0, scale: 0, x: -80, y: -280 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.3, 0],
              x: [-80, -100, -120],
              y: [-280, -320, -360]
            }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            🎶
          </motion.div>
        </>
      )}
      
      {/* New note appearing animation */}
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
    </div>
  );
};

export default MusicSlingshotAnimation;