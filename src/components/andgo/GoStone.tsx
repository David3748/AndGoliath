import React from 'react';
import { motion } from 'framer-motion';
import { StoneColor } from '../../lib/andgo/types';

interface GoStoneProps {
  color: StoneColor;
  cx: number;
  cy: number;
  radius: number;
  isLastMove?: boolean;
  isCapturing?: boolean;
  isWrong?: boolean;
  isHint?: boolean;
}

const GoStone: React.FC<GoStoneProps> = ({
  color,
  cx,
  cy,
  radius,
  isLastMove = false,
  isCapturing = false,
  isWrong = false,
  isHint = false,
}) => {
  const gradientId = `stone-${color}-${cx}-${cy}`;

  return (
    <motion.g
      initial={isHint ? { scale: 0.8, opacity: 0 } : { scale: 0, opacity: 0 }}
      animate={
        isHint
          ? { scale: 1, opacity: [0.35, 0.75, 0.35] }
          : {
              scale: isCapturing ? 0 : isWrong ? [1, 1.1, 0] : [0, 1.15, 1],
              opacity: isCapturing ? 0 : isWrong ? [1, 1, 0] : 1,
            }
      }
      transition={
        isHint
          ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
          : {
              duration: isCapturing ? 0.4 : isWrong ? 0.6 : 0.3,
              type: isCapturing || isWrong ? 'tween' : 'spring',
              stiffness: 300,
              damping: 20,
            }
      }
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <defs>
        {color === 'B' ? (
          <radialGradient id={gradientId} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
        ) : (
          <radialGradient id={gradientId} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#F8F8F2" />
            <stop offset="100%" stopColor="#C8C8C2" />
          </radialGradient>
        )}
      </defs>

      {/* Shadow for white stones */}
      {color === 'W' && (
        <circle cx={cx + 1} cy={cy + 1} r={radius} fill="rgba(0,0,0,0.2)" />
      )}

      {/* Stone */}
      <circle cx={cx} cy={cy} r={radius} fill={`url(#${gradientId})`} />

      {/* Highlight spot */}
      <circle
        cx={cx - radius * 0.25}
        cy={cy - radius * 0.25}
        r={radius * 0.15}
        fill={color === 'B' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'}
      />

      {/* Last move marker */}
      {isLastMove && (
        <circle
          cx={cx}
          cy={cy}
          r={radius * 0.3}
          fill="none"
          stroke="#FF79C6"
          strokeWidth={2}
        />
      )}

      {/* Wrong move indicator */}
      {isWrong && (
        <circle cx={cx} cy={cy} r={radius} fill="#FF5555" opacity={0.5} />
      )}

    </motion.g>
  );
};

export default GoStone;
