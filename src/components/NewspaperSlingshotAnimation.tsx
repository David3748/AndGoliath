import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NewspaperSlingshotAnimationProps {
  className?: string;
  articles: { slug: string }[]; // Expecting articles prop with slug
}

const NewspaperSlingshotAnimation: React.FC<NewspaperSlingshotAnimationProps> = ({ className = '', articles }) => {
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunch = () => {
    if (isLaunched) return;

    if (articles && articles.length > 0) {
      // Select a random article
      const randomIndex = Math.floor(Math.random() * articles.length);
      const randomArticle = articles[randomIndex];

      // Navigate to the random article's page
      window.location.href = `/writing/${randomArticle.slug}`;
    }

    setIsLaunched(true);

    // Reset after animation (adjust timeout as needed)
    setTimeout(() => {
      setIsLaunched(false);
    }, 1500); // Match animation duration + a bit
  };

  const stoneVariants = {
    idle: {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulled: {
      y: 10,
      x: 0,
      scale: 1.1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      y: -250, // Adjust for newspaper trajectory
      x: 50,  // Slight horizontal launch
      scale: 0.7,
      opacity: 1,
      rotate: -30, // Newspaper rotation on launch
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const elasticVariants = {
    idle: {
      scaleY: 1,
      y: 0
    },
    pulled: {
      scaleY: 1.3,
      y: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      scaleY: 0.8,
      y: -3,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Dracula theme colors (adjust if needed to match your theme)
  const purple = '#B39DFF';
  const pink = '#FF79C6';
  const foreground = '#F8F8F2';
  const paperColor = '#EEEEEE'; // Light grey for newspaper

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

          {/* Newspaper instead of stone */}
          <motion.rect
            className="newspaper-ball"
            x="85" // Centered roughly above slingshot
            y="55"
            width="30"  // Newspaper width
            height="20" // Newspaper height
            rx="2"      // Rounded corners
            fill={paperColor}
            variants={stoneVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
            whileHover="pulled"
            style={{ originX: 0.5, originY: 0.5 }} // Set origin for rotation
          />
           {/* Newspaper lines */}
          <motion.path
            d="M95 60 L95 70 M105 60 L105 70 M115 60 L115 70"
            stroke="#333" // Dark grey lines
            strokeWidth="2"
            variants={stoneVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
            whileHover="pulled"
          />
        </svg>
      </motion.div>

      {/* Impact effect (optional, can remove or customize) */}
      {isLaunched && (
        <motion.div
          className="absolute text-4xl"
          initial={{ opacity: 0, scale: 0, x: -80, y: -280 }} // Adjusted position
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0], // Reduced scale
            x: [-80, -120, -160], // Adjusted x
            y: [-280, -320, -280]  // Adjusted y
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          📰 {/* Newspaper emoji as impact */}
        </motion.div>
      )}
    </div>
  );
};

export default NewspaperSlingshotAnimation;