import { useState, useCallback, useEffect } from 'react';
import { AndGoState, GoBoard, Point, StoneColor } from '../../lib/andgo/types';
import { placeStone, estimateScore, getCandidateMoves } from '../../lib/andgo/goEngine';
import { getBestMove, getAdaptiveBotPlayouts } from '../../lib/andgo/mcts';
import { TSUMEGO_PUZZLES } from '../../lib/andgo/tsumegoPuzzles';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeHintPoints(board: GoBoard, correct: Point): Point[] {
  const candidates = getCandidateMoves(board, 'B');
  const others = candidates.filter(
    ([r, c]) => r !== correct[0] || c !== correct[1]
  );
  const picks = others.length >= 2
    ? [others[0], others[Math.floor(Math.random() * (others.length - 1)) + 1]]
    : others.length === 1
      ? [others[0]]
      : [];
  return shuffleArray([correct, ...picks]).slice(0, 3);
}

const INITIAL_STATE: AndGoState = {
  phase: 'loading',
  board: { size: 9, grid: [], koPoint: null },
  correctMove: null,
  wrongAttempts: 0,
  hintAvailable: false,
  botThinking: false,
  lastMove: null,
  capturedCount: { B: 0, W: 0 },
  scores: null,
};

export function useAndGo() {
  const [state, setState] = useState<AndGoState>(INITIAL_STATE);
  const [wrongMove, setWrongMove] = useState<Point | null>(null);
  const [hintPoints, setHintPoints] = useState<Point[]>([]);
  const [consecutivePasses, setConsecutivePasses] = useState(0);

  // Load first puzzle (index 0) on mount
  useEffect(() => {
    const puzzle = TSUMEGO_PUZZLES[0];
    setHintPoints([]);
    setConsecutivePasses(0);
    setState({
      ...INITIAL_STATE,
      phase: 'puzzle',
      board: puzzle.board,
      correctMove: puzzle.correctMove,
    });
  }, []);

  const loadRandomPuzzle = useCallback(() => {
    const idx = Math.floor(Math.random() * TSUMEGO_PUZZLES.length);
    const puzzle = TSUMEGO_PUZZLES[idx];
    setWrongMove(null);
    setHintPoints([]);
    setConsecutivePasses(0);
    setState({
      ...INITIAL_STATE,
      phase: 'puzzle',
      board: puzzle.board,
      correctMove: puzzle.correctMove,
    });
  }, []);

  const endGame = useCallback((board: GoBoard) => {
    const scores = estimateScore(board);
    setState(prev => ({
      ...prev,
      phase: 'gameover',
      scores,
      botThinking: false,
    }));
  }, []);

  const triggerBotMove = useCallback((board: GoBoard) => {
    setTimeout(() => {
      const botMove = getBestMove(board, 'W', getAdaptiveBotPlayouts(board));

      if (!botMove) {
        // Bot passes
        setConsecutivePasses(prev => {
          const newPasses = prev + 1;
          if (newPasses >= 2) {
            endGame(board);
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

      setConsecutivePasses(0);

      setState(prev => ({
        ...prev,
        board: result.board,
        lastMove: botMove,
        capturedCount: {
          ...prev.capturedCount,
          B: prev.capturedCount.B + result.captured.length,
        },
        botThinking: false,
      }));
    }, 100);
  }, [endGame]);

  const handleMove = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.botThinking || prev.phase === 'gameover') return prev;

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

          setWrongMove(null);
          setHintPoints([]);

          // Trigger bot response after a delay
          setTimeout(() => triggerBotMove(result.board), 500);

          return {
            ...prev,
            phase: 'freeplay',
            board: result.board,
            lastMove: [row, col] as Point,
            capturedCount: {
              ...prev.capturedCount,
              W: prev.capturedCount.W + result.captured.length,
            },
            botThinking: true,
          };
        } else {
          // Wrong move - don't place, just flash
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

        setConsecutivePasses(0);

        // Trigger bot response
        setTimeout(() => triggerBotMove(result.board), 300);

        return {
          ...prev,
          board: result.board,
          lastMove: [row, col] as Point,
          capturedCount: {
            ...prev.capturedCount,
            W: prev.capturedCount.W + result.captured.length,
          },
          botThinking: true,
        };
      }

      return prev;
    });
  }, [triggerBotMove]);

  const showHint = useCallback(() => {
    if (state.hintAvailable && state.correctMove) {
      setHintPoints(computeHintPoints(state.board, state.correctMove));
    }
  }, [state.hintAvailable, state.correctMove, state.board]);

  const pass = useCallback(() => {
    if (state.phase !== 'freeplay' || state.botThinking) return;

    setConsecutivePasses(prev => {
      const newPasses = prev + 1;
      if (newPasses >= 2) {
        endGame(state.board);
      } else {
        setState(s => ({ ...s, botThinking: true }));
        setTimeout(() => triggerBotMove(state.board), 300);
      }
      return newPasses;
    });
  }, [state.phase, state.botThinking, state.board, triggerBotMove, endGame]);

  const reset = useCallback(() => {
    setWrongMove(null);
    setHintPoints([]);
    setConsecutivePasses(0);
    const puzzle = TSUMEGO_PUZZLES[0];
    setState({
      ...INITIAL_STATE,
      phase: 'puzzle',
      board: puzzle.board,
      correctMove: puzzle.correctMove,
    });
  }, []);

  return {
    state,
    wrongMove,
    hintPoints,
    handleMove,
    showHint,
    pass,
    reset,
    loadRandomPuzzle,
  };
}
