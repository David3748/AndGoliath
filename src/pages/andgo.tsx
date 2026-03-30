import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import GoBoard from '../components/andgo/GoBoard';
import { useAndGo } from '../components/andgo/useAndGo';
import Link from 'next/link';

const AndGoPage: NextPage = () => {
  const {
    state,
    wrongMove,
    capturingStones,
    showHintPoint,
    handleMove,
    showHint,
    pass,
    reset,
  } = useAndGo();

  return (
    <Layout title="&Go | Daily Puzzle" description="A daily Go puzzle from &Goliath.">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[calc(100vh-120px)] flex-col items-center"
      >
        {/* Header */}
        <div className="w-full max-w-5xl mb-4">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-100 mb-1">
            <span className="text-primary">&</span>Go
          </h1>
          <p className="text-sm text-gray-400">
            {state.phase === 'loading' && 'Generating puzzle...'}
            {state.phase === 'puzzle' && 'Find the best move'}
            {state.phase === 'freeplay' && 'Keep playing!'}
            {state.phase === 'gameover' && 'Game over'}
          </p>
        </div>

        {/* Status bar */}
        <div className="w-full max-w-5xl mb-3">
          {state.phase === 'puzzle' && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">Black to play</span>
              {state.wrongAttempts > 0 && (
                <span className="text-red">
                  {state.wrongAttempts} wrong {state.wrongAttempts === 1 ? 'try' : 'tries'}
                </span>
              )}
              {state.botThinking && <ThinkingDots />}
            </div>
          )}

          {state.phase === 'freeplay' && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">
                Captured: B {state.capturedCount.B} | W {state.capturedCount.W}
              </span>
              {state.botThinking && <ThinkingDots />}
            </div>
          )}
        </div>

        {/* Board */}
        <div className="mb-4 w-full flex justify-center flex-1 items-center">
          {state.phase === 'loading' ? (
            <div className="flex items-center justify-center w-[min(94vw,78vh,860px)] h-[min(94vw,78vh,860px)]">
              <motion.div
                className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <div className="w-[min(94vw,78vh,860px)]">
              <GoBoard
                board={state.board}
                onIntersectionClick={handleMove}
                lastMove={state.lastMove}
                hintPoint={showHintPoint}
                wrongMove={wrongMove}
                capturingStones={capturingStones}
                disabled={state.botThinking || state.phase === 'gameover'}
                playerColor="B"
              />
            </div>
          )}
        </div>

        {/* Correct move flash */}
        {state.phase === 'freeplay' && state.moveHistory.length === 1 && (
          <motion.p
            className="text-green text-sm font-medium mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Correct! Game continues...
          </motion.p>
        )}

        {/* Game over scores */}
        {state.phase === 'gameover' && state.scores && (
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-300 font-medium mb-2">Final Score</p>
            <div className="flex justify-center gap-6 text-lg">
              <span className={state.scores.B > state.scores.W ? 'text-green' : 'text-gray-400'}>
                Black: {state.scores.B}
              </span>
              <span className={state.scores.W > state.scores.B ? 'text-green' : 'text-gray-400'}>
                White: {state.scores.W}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {state.scores.B > state.scores.W ? 'You win!' : 'White wins'}
              {' '}(White has 7 komi)
            </p>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex gap-3 w-full max-w-5xl pb-6">
          {state.phase === 'puzzle' && state.hintAvailable && (
            <button
              className="px-4 py-2 text-sm text-yellow border border-yellow/30 rounded hover:bg-yellow/10 transition-colors"
              onClick={showHint}
            >
              Hint
            </button>
          )}
          {state.phase === 'freeplay' && (
            <button
              className="px-4 py-2 text-sm text-gray-400 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
              onClick={pass}
              disabled={state.botThinking}
            >
              Pass
            </button>
          )}
          {state.phase === 'gameover' && (
            <button
              className="px-4 py-2 text-sm text-primary border border-primary/30 rounded hover:bg-primary/10 transition-colors"
              onClick={reset}
            >
              Play Again
            </button>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

const ThinkingDots = () => (
  <motion.span className="inline-flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </motion.span>
);

export default AndGoPage;
