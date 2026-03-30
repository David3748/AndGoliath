import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GoStone from './GoStone';
import { GoBoard as GoBoardType, Point, StoneColor } from '../../lib/andgo/types';

interface GoBoardProps {
  board: GoBoardType;
  onIntersectionClick: (row: number, col: number) => void;
  lastMove: Point | null;
  hintPoint: Point | null;
  wrongMove: Point | null;
  capturingStones: Point[];
  disabled?: boolean;
  playerColor: StoneColor;
}

const PADDING = 30;
const STAR_POINTS_9: [number, number][] = [[2, 2], [2, 6], [6, 2], [6, 6], [4, 4]];

const GoBoard: React.FC<GoBoardProps> = ({
  board,
  onIntersectionClick,
  lastMove,
  hintPoint,
  wrongMove,
  capturingStones,
  disabled = false,
  playerColor,
}) => {
  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);
  const size = board.size;
  const cellSize = 40;
  const boardPixels = (size - 1) * cellSize + PADDING * 2;

  const toPixel = (idx: number) => PADDING + idx * cellSize;

  const isCapturing = (r: number, c: number) =>
    capturingStones.some(([cr, cc]) => cr === r && cc === c);

  const isWrongMove = (r: number, c: number) =>
    wrongMove !== null && wrongMove[0] === r && wrongMove[1] === c;

  const isLastMove = (r: number, c: number) =>
    lastMove !== null && lastMove[0] === r && lastMove[1] === c;

  const isHintPoint = (r: number, c: number) =>
    hintPoint !== null && hintPoint[0] === r && hintPoint[1] === c;

  return (
    <svg
      viewBox={`0 0 ${boardPixels} ${boardPixels}`}
      className="w-full h-auto max-w-full"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Board background */}
      <rect
        x={0}
        y={0}
        width={boardPixels}
        height={boardPixels}
        rx={4}
        fill="#1A1D2E"
      />

      {/* Grid lines */}
      {Array.from({ length: size }, (_, i) => (
        <React.Fragment key={`grid-${i}`}>
          <line
            x1={toPixel(0)}
            y1={toPixel(i)}
            x2={toPixel(size - 1)}
            y2={toPixel(i)}
            stroke="#6272A4"
            strokeWidth={1}
          />
          <line
            x1={toPixel(i)}
            y1={toPixel(0)}
            x2={toPixel(i)}
            y2={toPixel(size - 1)}
            stroke="#6272A4"
            strokeWidth={1}
          />
        </React.Fragment>
      ))}

      {/* Star points */}
      {size === 9 &&
        STAR_POINTS_9.map(([r, c]) => (
          <circle
            key={`star-${r}-${c}`}
            cx={toPixel(c)}
            cy={toPixel(r)}
            r={3}
            fill="#6272A4"
          />
        ))}

      {/* Coordinate labels */}
      {Array.from({ length: size }, (_, i) => {
        const letter = String.fromCharCode(65 + (i >= 8 ? i + 1 : i)); // Skip 'I'
        return (
          <React.Fragment key={`label-${i}`}>
            <text
              x={toPixel(i)}
              y={PADDING - 12}
              textAnchor="middle"
              fill="#6272A4"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {letter}
            </text>
            <text
              x={PADDING - 14}
              y={toPixel(i) + 4}
              textAnchor="middle"
              fill="#6272A4"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {size - i}
            </text>
          </React.Fragment>
        );
      })}

      {/* Hint glow (behind stones) */}
      {hintPoint && board.grid[hintPoint[0]][hintPoint[1]] === null && (
        <GoStone
          color={playerColor}
          cx={toPixel(hintPoint[1])}
          cy={toPixel(hintPoint[0])}
          radius={cellSize * 0.44}
          isHint={true}
        />
      )}

      {/* Stones */}
      <AnimatePresence>
        {board.grid.flatMap((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <GoStone
                key={`stone-${r}-${c}`}
                color={cell}
                cx={toPixel(c)}
                cy={toPixel(r)}
                radius={cellSize * 0.44}
                isLastMove={isLastMove(r, c)}
                isCapturing={isCapturing(r, c)}
                isWrong={isWrongMove(r, c)}
              />
            );
          })
        )}
      </AnimatePresence>

      {/* Wrong move ghost (shown briefly at the wrong position) */}
      {wrongMove && board.grid[wrongMove[0]][wrongMove[1]] === null && (
        <GoStone
          color={playerColor}
          cx={toPixel(wrongMove[1])}
          cy={toPixel(wrongMove[0])}
          radius={cellSize * 0.44}
          isWrong={true}
        />
      )}

      {/* Hover ghost stone */}
      {hoverPoint && !disabled && board.grid[hoverPoint[0]][hoverPoint[1]] === null && (
        <circle
          cx={toPixel(hoverPoint[1])}
          cy={toPixel(hoverPoint[0])}
          r={cellSize * 0.44}
          fill={playerColor === 'B' ? '#333' : '#E8E8E2'}
          opacity={0.3}
          pointerEvents="none"
        />
      )}

      {/* Click targets (invisible rects over intersections) */}
      {Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => {
          if (board.grid[r][c] !== null) return null;
          return (
            <rect
              key={`click-${r}-${c}`}
              x={toPixel(c) - cellSize / 2}
              y={toPixel(r) - cellSize / 2}
              width={cellSize}
              height={cellSize}
              fill="transparent"
              cursor={disabled ? 'default' : 'pointer'}
              onMouseEnter={() => setHoverPoint([r, c])}
              onMouseLeave={() => setHoverPoint(null)}
              onClick={() => {
                if (!disabled) {
                  onIntersectionClick(r, c);
                  setHoverPoint(null);
                }
              }}
            />
          );
        })
      )}
    </svg>
  );
};

export default GoBoard;
