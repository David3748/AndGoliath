import React from 'react';
import { motion } from 'framer-motion';

interface SlingshotIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

const SlingshotIcon: React.FC<SlingshotIconProps> = ({ 
  width = 40, 
  height = 40, 
  color = '#0074D9', // Default to cerulean
  className = '',
  animate = false
}) => {
  const pathVariants = {
    initial: {
      pathLength: 0,
      opacity: 0
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const stoneVariants = {
    initial: { 
      scale: 0,
      opacity: 0 
    },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.2,
      y: -5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const elasticVariants = {
    initial: {
      scaleY: 0,
      opacity: 0
    },
    animate: {
      scaleY: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scaleX: 1.1,
      transition: {
        yoyo: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  // Use cerulean and black colors
  const woodColor = color;
  const leatherColor = color === '#0074D9' ? '#005bb5' : color; // Darker cerulean if default
  const stoneColor = '#111111'; // Black

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      whileHover="hover"
    >
      {/* Slingshot Y-shaped handle */}
      <motion.path
        d="M50 80 L30 40 L20 20 M50 80 L70 40 L80 20"
        stroke={woodColor}
        strokeWidth="5"
        strokeLinecap="round"
        variants={pathVariants}
      />
      
      {/* Elastic bands */}
      <motion.path
        d="M20 20 L50 35 M80 20 L50 35"
        stroke={leatherColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 2"
        variants={elasticVariants}
      />
      
      {/* Stone */}
      <motion.circle
        cx="50"
        cy="35"
        r="8"
        fill={stoneColor}
        variants={stoneVariants}
      />
    </motion.svg>
  );
};

export default SlingshotIcon; 