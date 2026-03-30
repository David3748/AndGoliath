import { useState, useCallback, useEffect, useRef } from 'react';
import { AndGoState, GoBoard, Point, StoneColor } from '../../lib/andgo/types';
import { placeStone, estimateScore, getCandidateMoves } from '../../lib/andgo/goEngine';
import { getBestMove } from '../../lib/andgo/mcts';
import {
  generateDailyPuzzle,
  getCachedPuzzle,
  cachePuzzle,
  getTodayDateStr,
} from '../../lib/andgo/puzzleGen';

const INITIAL_STATE: AndGoState = {
  phase: 'loading',
  board: { size: 9, grid: [], koPoint: null },
  correctMove: null,
  moveHistory: [],
  wrongAttempts: 0,
  hintAvailable: false,
  botThinking: false,
  lastMove: null,
  capturedCount: { B: 0, W: 0 },
  scores: null,
};

function getAdaptiveBotPlayouts(board: GoBoard): number {
  const candidateMoves = getCandidateMoves(board, 'W').length;
  if (candidateMoves <= 8) return 900;
  if (candidateMoves <= 14) return 750;
  if (candidateMoves <= 22) return 620;
  if (candidateMoves <= 32) return 500;
  return 380;
}

export function useAndGo() {
  const [state, setState] = useState<AndGoState>(INITIAL_STATE);
  const [wrongMove, setWrongMove] = useState<Point | null>(null);
  const [capturingStones, setCapturingStones] = useState<Point[]>([]);
  const [showHintPoint, setShowHintPoint] = useState<Point | null>(null);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const mountedRef = useRef(true);

  // Generate puzzle on mount
  useEffect(() => {
    mountedRef.current = true;
    const dateStr = getTodayDateStr();

    // Check cache first
    const cached = getCachedPuzzle(dateStr);
    if (cached) {
      setState(prev => ({
        ...prev,
        phase: 'puzzle',
        board: cached.board,
        correctMove: cached.correctMove,
      }));
      return;
    }

    import('../../lib/andgo/puzzleWorkerClient')
      .then(({ generatePuzzleAsync }) => generatePuzzleAsync(dateStr))
      .then(puzzle => {
        cachePuzzle(puzzle);
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            phase: 'puzzle',
            board: puzzle.board,
            correctMove: puzzle.correctMove,
          }));
        }
      })
      .catch(() => {
        const puzzle = generateDailyPuzzle(dateStr);
        cachePuzzle(puzzle);
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            phase: 'puzzle',
            board: puzzle.board,
            correctMove: puzzle.correctMove,
          }));
        }
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleMove = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.botThinking) return prev;

      if (prev.phase === 'puzzle') {
        // Check if this is the correct move
        if (
          prev.correctMove &&
          prev.correctMove[0] === row &&
          prev.correctMove[1] === col
        ) {
          // Correct! Place the stone and transition to freeplay
          const result = placeStone(prev.board, row, col, 'B');
          if (!result.valid) return prev;

          const newCaptured = { ...prev.capturedCount };
          newCaptured.W += result.captured.length;

          // Show capturing animation
          if (result.captured.length > 0) {
            setCapturingStones(result.captured);
            setTimeout(() => setCapturingStones([]), 500);
          }

          setWrongMove(null);
          setShowHintPoint(null);

          // Trigger bot response after a delay
          setTimeout(() => triggerBotMove(result.board), 800);

          return {
            ...prev,
            phase: 'freeplay',
            board: result.board,
            lastMove: [row, col],
            moveHistory: [...prev.moveHistory, { point: [row, col], color: 'B' as StoneColor }],
            capturedCount: newCaptured,
            botThinking: true,
          };
        } else {
          // Wrong move
          setWrongMove([row, col]);
          setTimeout(() => setWrongMove(null), 800);

          const newAttempts = prev.wrongAttempts + 1;
          return {
            ...prev,
            wrongAttempts: newAttempts,
            hintAvailable: newAttempts >= 3,
          };
        }
      }

      if (prev.phase === 'freeplay') {
        const result = placeStone(prev.board, row, col, 'B');
        if (!result.valid) return prev;

        const newCaptured = { ...prev.capturedCount };
        newCaptured.W += result.captured.length;

        if (result.captured.length > 0) {
          setCapturingStones(result.captured);
          setTimeout(() => setCapturingStones([]), 500);
        }

        setConsecutivePasses(0);

        // Trigger bot response
        setTimeout(() => triggerBotMove(result.board), 300);

        return {
          ...prev,
          board: result.board,
          lastMove: [row, col],
          moveHistory: [...prev.moveHistory, { point: [row, col], color: 'B' as StoneColor }],
          capturedCount: newCaptured,
          botThinking: true,
        };
      }

      return prev;
    });
  }, []);

  const triggerBotMove = useCallback((board: GoBoard) => {
    // Run MCTS for bot's move
    setTimeout(() => {
      const botMove = getBestMove(board, 'W', getAdaptiveBotPlayouts(board));

      if (!mountedRef.current) return;

      if (!botMove) {
        // Bot passes
        setConsecutivePasses(prev => {
          const newPasses = prev + 1;
          if (newPasses >= 2) {
            // Game over
            const scores = estimateScore(board);
            setState(s => ({
              ...s,
              phase: 'gameover',
              botThinking: false,
              scores,
            }));
          } else {
            setState(s => ({ ...s, botThinking: false }));
          }
          return newPasses;
        });
        return;
      }

      const result = placeStone(board, botMove[0], botMove[1], 'W');
      if (!result.valid) {
        setState(s => ({ ...s, botThinking: false }));
        return;
      }

      if (result.captured.length > 0) {
        setCapturingStones(result.captured);
        setTimeout(() => setCapturingStones([]), 500);
      }

      setConsecutivePasses(0);

      setState(prev => ({
        ...prev,
        board: result.board,
        lastMove: botMove,
        moveHistory: [...prev.moveHistory, { point: botMove, color: 'W' as StoneColor }],
        capturedCount: {
          ...prev.capturedCount,
          B: prev.capturedCount.B + result.captured.length,
        },
        botThinking: false,
      }));
    }, 100);
  }, []);

  const showHint = useCallback(() => {
    if (state.hintAvailable && state.correctMove) {
      setShowHintPoint(state.correctMove);
    }
  }, [state.hintAvailable, state.correctMove]);

  const pass = useCallback(() => {
    if (state.phase !== 'freeplay' || state.botThinking) return;

    setConsecutivePasses(prev => {
      const newPasses = prev + 1;
      if (newPasses >= 2) {
        const scores = estimateScore(state.board);
        setState(s => ({
          ...s,
          phase: 'gameover',
          scores,
        }));
      } else {
        // Bot's turn after player passes
        setState(s => ({ ...s, botThinking: true }));
        setTimeout(() => triggerBotMove(state.board), 300);
      }
      return newPasses;
    });
  }, [state.phase, state.botThinking, state.board, triggerBotMove]);

  const reset = useCallback(() => {
    setWrongMove(null);
    setCapturingStones([]);
    setShowHintPoint(null);
    setConsecutivePasses(0);

    const dateStr = getTodayDateStr();
    const cached = getCachedPuzzle(dateStr);
    if (cached) {
      setState({
        ...INITIAL_STATE,
        phase: 'puzzle',
        board: cached.board,
        correctMove: cached.correctMove,
      });
    }
  }, []);

  return {
    state,
    wrongMove,
    capturingStones,
    showHintPoint,
    handleMove,
    showHint,
    pass,
    reset,
  };
}
