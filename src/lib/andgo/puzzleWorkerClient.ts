import { DailyPuzzle } from './types';
import { generateDailyPuzzle } from './puzzleGen';

type PendingRequest = {
  resolve: (puzzle: DailyPuzzle) => void;
  reject: (error: unknown) => void;
};

let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<number, PendingRequest>();

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return null;
  if (worker) return worker;

  worker = new Worker(new URL('../../workers/andgoPuzzleWorker.ts', import.meta.url));
  worker.onmessage = (event: MessageEvent<{ id: number; puzzle: DailyPuzzle }>) => {
    const { id, puzzle } = event.data;
    const request = pending.get(id);
    if (!request) return;
    pending.delete(id);
    request.resolve(puzzle);
  };
  worker.onerror = (error) => {
    // Fail all in-flight requests; caller will usually fallback to sync generation.
    pending.forEach(({ reject }) => reject(error));
    pending.clear();
  };
  return worker;
}

export function generatePuzzleAsync(dateStr: string): Promise<DailyPuzzle> {
  const w = getWorker();
  if (!w) {
    return Promise.resolve(generateDailyPuzzle(dateStr));
  }

  return new Promise<DailyPuzzle>((resolve, reject) => {
    requestId += 1;
    const id = requestId;
    pending.set(id, { resolve, reject });
    w.postMessage({ id, dateStr });
  });
}
