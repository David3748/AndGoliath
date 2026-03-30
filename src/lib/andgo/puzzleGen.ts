import { GoBoard, Point, StoneColor, DailyPuzzle } from './types';
import { createBoard, placeStone, getLegalMoves } from './goEngine';
import { runMCTS } from './mcts';

// Seeded PRNG: mulberry32
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// djb2 hash
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

// Shuffle array in-place using seeded PRNG
function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Position templates: each returns initial stones for a region of the board
interface Template {
  name: string;
  generate: (rng: () => number, boardSize: number) => { color: StoneColor; pos: Point }[];
}

// Helper: offset positions to a corner/edge
function offsetPositions(
  stones: { color: StoneColor; pos: Point }[],
  offsetR: number,
  offsetC: number
): { color: StoneColor; pos: Point }[] {
  return stones.map(s => ({
    color: s.color,
    pos: [s.pos[0] + offsetR, s.pos[1] + offsetC] as Point,
  }));
}

const TEMPLATES: Template[] = [
  {
    // Surrounded group with few liberties in corner
    name: 'corner-capture',
    generate: (rng, size) => {
      const stones: { color: StoneColor; pos: Point }[] = [];
      // White group in corner area (1-3 stones)
      const whiteCount = 2 + Math.floor(rng() * 2); // 2-3
      const whitePositions: Point[] = [];
      const startR = Math.floor(rng() * 3);
      const startC = Math.floor(rng() * 3);
      whitePositions.push([startR, startC]);

      for (let i = 1; i < whiteCount; i++) {
        const last = whitePositions[whitePositions.length - 1];
        const dirs: Point[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        shuffle(dirs, rng);
        for (const [dr, dc] of dirs) {
          const nr = last[0] + dr;
          const nc = last[1] + dc;
          if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 &&
              !whitePositions.some(([r, c]) => r === nr && c === nc)) {
            whitePositions.push([nr, nc]);
            break;
          }
        }
      }

      for (const pos of whitePositions) {
        stones.push({ color: 'W', pos });
      }

      // Black stones partially surrounding white
      const blackCandidates: Point[] = [];
      for (const [wr, wc] of whitePositions) {
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]] as Point[]) {
          const nr = wr + dr;
          const nc = wc + dc;
          if (nr >= 0 && nr < 6 && nc >= 0 && nc < 6 &&
              !whitePositions.some(([r, c]) => r === nr && c === nc) &&
              !blackCandidates.some(([r, c]) => r === nr && c === nc)) {
            blackCandidates.push([nr, nc]);
          }
        }
      }

      // Leave 1-2 liberties open (so there's a correct capturing move)
      shuffle(blackCandidates, rng);
      const libertiesToLeave = 1 + Math.floor(rng() * 2); // 1-2
      const blackCount = Math.max(1, blackCandidates.length - libertiesToLeave);
      for (let i = 0; i < blackCount && i < blackCandidates.length; i++) {
        stones.push({ color: 'B', pos: blackCandidates[i] });
      }

      // Pick a corner to place this in
      const corners: [number, number][] = [[0, 0], [0, size - 6], [size - 6, 0], [size - 6, size - 6]];
      const corner = corners[Math.floor(rng() * corners.length)];
      return offsetPositions(stones, corner[0], corner[1]);
    },
  },
  {
    // Edge life-and-death: black group on edge needs to make two eyes
    name: 'edge-life',
    generate: (rng, size) => {
      const stones: { color: StoneColor; pos: Point }[] = [];
      // Black stones along an edge
      const edgeRow = rng() < 0.5 ? 0 : size - 1;
      const startCol = 1 + Math.floor(rng() * 4);
      const blackCount = 3 + Math.floor(rng() * 2); // 3-4

      for (let i = 0; i < blackCount; i++) {
        stones.push({ color: 'B', pos: [edgeRow, startCol + i] });
      }
      // Add a second row
      const secondRow = edgeRow === 0 ? 1 : size - 2;
      stones.push({ color: 'B', pos: [secondRow, startCol] });
      stones.push({ color: 'B', pos: [secondRow, startCol + blackCount - 1] });

      // White stones surrounding (not fully, leave vital points)
      const thirdRow = edgeRow === 0 ? 2 : size - 3;
      for (let i = -1; i <= blackCount; i++) {
        const c = startCol + i;
        if (c >= 0 && c < size) {
          stones.push({ color: 'W', pos: [thirdRow, c] });
        }
      }
      // Side walls
      if (startCol - 1 >= 0) {
        stones.push({ color: 'W', pos: [secondRow, startCol - 1] });
      }
      if (startCol + blackCount < size) {
        stones.push({ color: 'W', pos: [secondRow, startCol + blackCount] });
      }

      return stones;
    },
  },
  {
    // Ladder/net setup: a stone that needs to be captured via net
    name: 'net-capture',
    generate: (rng, size) => {
      const stones: { color: StoneColor; pos: Point }[] = [];
      const cr = 2 + Math.floor(rng() * (size - 5));
      const cc = 2 + Math.floor(rng() * (size - 5));

      // White stone to capture
      stones.push({ color: 'W', pos: [cr, cc] });

      // Black stones forming partial net
      const blackPositions: Point[] = [
        [cr - 1, cc], [cr, cc - 1], [cr + 1, cc - 1], [cr + 1, cc + 1],
      ];
      // Randomly include some, leave gaps for the puzzle
      shuffle(blackPositions, rng);
      const include = 2 + Math.floor(rng() * 2); // 2-3
      for (let i = 0; i < include; i++) {
        const [r, c] = blackPositions[i];
        if (r >= 0 && r < size && c >= 0 && c < size) {
          stones.push({ color: 'B', pos: [r, c] });
        }
      }

      // Add some context stones
      const contextCount = 2 + Math.floor(rng() * 3);
      for (let i = 0; i < contextCount; i++) {
        const dr = Math.floor(rng() * 5) - 2;
        const dc = Math.floor(rng() * 5) - 2;
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size &&
            !stones.some(s => s.pos[0] === nr && s.pos[1] === nc)) {
          stones.push({ color: rng() < 0.5 ? 'B' : 'W', pos: [nr, nc] });
        }
      }

      return stones;
    },
  },
];

function buildBoardFromStones(
  size: number,
  stones: { color: StoneColor; pos: Point }[]
): GoBoard | null {
  let board = createBoard(size);
  // Place stones directly (bypass move validation since this is setup)
  for (const { color, pos: [r, c] } of stones) {
    if (r < 0 || r >= size || c < 0 || c >= size) continue;
    if (board.grid[r][c] !== null) continue;
    board.grid[r][c] = color;
  }

  // Validate: remove any groups with 0 liberties (invalid positions)
  // This is a cleanup step for generated positions
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board.grid[r][c] === null) continue;
        const { liberties } = getGroupFromBoard(board, r, c);
        if (liberties.length === 0) {
          // Remove this dead group
          const { stones: deadStones } = getGroupFromBoard(board, r, c);
          for (const [dr, dc] of deadStones) {
            board.grid[dr][dc] = null;
          }
          changed = true;
        }
      }
    }
  }

  // Check that both colors have stones
  let hasBlack = false, hasWhite = false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board.grid[r][c] === 'B') hasBlack = true;
      if (board.grid[r][c] === 'W') hasWhite = true;
    }
  }

  return (hasBlack && hasWhite) ? board : null;
}

// Inline getGroup to avoid circular issues during board building
function getGroupFromBoard(board: GoBoard, row: number, col: number) {
  const color = board.grid[row][col];
  if (!color) return { stones: [] as Point[], liberties: [] as Point[] };

  const visited = new Set<string>();
  const stones: Point[] = [];
  const liberties: Point[] = [];
  const libertiesSet = new Set<string>();
  const queue: Point[] = [[row, col]];
  visited.add(`${row},${col}`);

  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [r, c] = queue.pop()!;
    stones.push([r, c]);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= board.size || nc < 0 || nc >= board.size) continue;
      const key = `${nr},${nc}`;
      if (visited.has(key)) continue;
      const neighbor = board.grid[nr][nc];
      if (neighbor === null) {
        if (!libertiesSet.has(key)) {
          liberties.push([nr, nc]);
          libertiesSet.add(key);
        }
      } else if (neighbor === color) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  return { stones, liberties };
}

function evaluatePosition(board: GoBoard, color: StoneColor): {
  bestMove: Point | null;
  gap: number;
  bestWinRate: number;
} {
  // Two-stage evaluation: quick screen first, then refine only promising positions.
  const quickResults = runMCTS(board, color, 60);
  if (quickResults.length === 0) return { bestMove: null, gap: 0, bestWinRate: 0 };

  const quickBest = quickResults[0];
  const quickSecondBest = quickResults.length > 1 ? quickResults[1] : { winRate: 0 };
  const quickGap = quickBest.winRate - quickSecondBest.winRate;
  if (quickBest.winRate < 0.45 || quickGap < 0.08) {
    return { bestMove: null, gap: 0, bestWinRate: 0 };
  }

  const deepResults = runMCTS(board, color, 110);
  if (deepResults.length === 0) return { bestMove: null, gap: 0, bestWinRate: 0 };

  const best = deepResults[0];
  const secondBest = deepResults.length > 1 ? deepResults[1] : { winRate: 0 };
  const gap = best.winRate - secondBest.winRate;

  return { bestMove: best.move, gap, bestWinRate: best.winRate };
}

export function generateDailyPuzzle(dateStr: string): DailyPuzzle {
  const seed = hashString(dateStr);
  const rng = mulberry32(seed);
  const boardSize = 9;

  for (let attempt = 0; attempt < 5; attempt++) {
    const templateIdx = Math.floor(rng() * TEMPLATES.length);
    const template = TEMPLATES[templateIdx];
    const stones = template.generate(rng, boardSize);
    const board = buildBoardFromStones(boardSize, stones);
    if (!board) continue;

    const legal = getLegalMoves(board, 'B');
    if (legal.length < 3) continue;

    const { bestMove, gap, bestWinRate } = evaluatePosition(board, 'B');
    if (!bestMove) continue;

    if (bestWinRate > 0.5 && gap > 0.15) {
      const difficulty = gap > 0.4 ? 1 : gap > 0.25 ? 2 : 3;
      return { board, correctMove: bestMove, difficulty, dateStr };
    }
  }

  // Fallback: generate a simple capture puzzle (always works, instant)
  return generateFallbackPuzzle(rng, boardSize, dateStr);
}

function generateFallbackPuzzle(rng: () => number, size: number, dateStr: string): DailyPuzzle {
  // Simple guaranteed puzzle: white stone with one liberty, black to capture
  let board = createBoard(size);
  const cr = 2 + Math.floor(rng() * (size - 4));
  const cc = 2 + Math.floor(rng() * (size - 4));

  board.grid[cr][cc] = 'W';
  // Surround on 3 sides
  const dirs: Point[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  shuffle(dirs, rng);
  for (let i = 0; i < 3; i++) {
    const [dr, dc] = dirs[i];
    board.grid[cr + dr][cc + dc] = 'B';
  }

  // The correct move is the remaining liberty
  const [dr, dc] = dirs[3];
  const correctMove: Point = [cr + dr, cc + dc];

  return { board, correctMove, difficulty: 1, dateStr };
}

// Cache key
function getCacheKey(dateStr: string): string {
  return `andgo-puzzle-${dateStr}`;
}

export function getCachedPuzzle(dateStr: string): DailyPuzzle | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(getCacheKey(dateStr));
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export function cachePuzzle(puzzle: DailyPuzzle): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCacheKey(puzzle.dateStr), JSON.stringify(puzzle));
  } catch {
    // localStorage full or unavailable
  }
}

export function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDaysToDateStr(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
