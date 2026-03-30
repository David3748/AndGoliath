/// <reference lib="webworker" />

import { generateDailyPuzzle } from '../lib/andgo/puzzleGen';

type GeneratePuzzleRequest = {
  id: number;
  dateStr: string;
};

type GeneratePuzzleResponse = {
  id: number;
  puzzle: ReturnType<typeof generateDailyPuzzle>;
};

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<GeneratePuzzleRequest>) => {
  const { id, dateStr } = event.data;
  const puzzle = generateDailyPuzzle(dateStr);
  const response: GeneratePuzzleResponse = { id, puzzle };
  workerScope.postMessage(response);
};

export {};
