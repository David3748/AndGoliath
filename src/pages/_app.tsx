import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';
import { addDaysToDateStr, cachePuzzle, getCachedPuzzle, getTodayDateStr } from '../lib/andgo/puzzleGen';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const idleCapableWindow = window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const prewarm = async () => {
      const today = getTodayDateStr();
      const targets = [today, addDaysToDateStr(today, 1), addDaysToDateStr(today, 2)];
      const { generatePuzzleAsync } = await import('../lib/andgo/puzzleWorkerClient');
      for (const dateStr of targets) {
        if (cancelled) return;
        if (getCachedPuzzle(dateStr)) continue;
        try {
          const puzzle = await generatePuzzleAsync(dateStr);
          if (!cancelled) {
            cachePuzzle(puzzle);
          }
        } catch {
          // Ignore prewarm failures; normal game load handles fallback.
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      if (idleCapableWindow.requestIdleCallback) {
        idleCapableWindow.requestIdleCallback(() => {
          void prewarm();
        });
      } else {
        void prewarm();
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 