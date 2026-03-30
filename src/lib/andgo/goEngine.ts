import { Cell, GoBoard, GroupInfo, MoveResult, Point, StoneColor } from './types';

export function createBoard(size: number): GoBoard {
  const grid: Cell[][] = Array.from({ length: size }, () => Array(size).fill(null));
  return { size, grid, koPoint: null };
}

export function cloneBoard(board: GoBoard): GoBoard {
  return {
    size: board.size,
    grid: board.grid.map(row => [...row]),
    koPoint: board.koPoint,
  };
}

export function inBounds(board: GoBoard, row: number, col: number): boolean {
  return row >= 0 && row < board.size && col >= 0 && col < board.size;
}

const NEIGHBORS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function getNeighbors(board: GoBoard, row: number, col: number): Point[] {
  return NEIGHBORS
    .map(([dr, dc]) => [row + dr, col + dc] as Point)
    .filter(([r, c]) => inBounds(board, r, c));
}

export function getGroup(board: GoBoard, row: number, col: number): GroupInfo {
  const color = board.grid[row][col];
  if (!color) return { stones: [], liberties: [] };

  const size = board.size;
  const toKey = (r: number, c: number) => r * size + c;
  const visited = new Set<number>();
  const stones: Point[] = [];
  const liberties: Point[] = [];
  const libertiesSet = new Set<number>();
  const queue: Point[] = [[row, col]];
  visited.add(toKey(row, col));

  while (queue.length > 0) {
    const [r, c] = queue.pop()!;
    stones.push([r, c]);

    for (const [nr, nc] of getNeighbors(board, r, c)) {
      const key = toKey(nr, nc);
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

function opponent(color: StoneColor): StoneColor {
  return color === 'B' ? 'W' : 'B';
}

export function boardHash(board: GoBoard): string {
  return board.grid.map(row => row.map(c => c || '.').join('')).join('|');
}

export function placeStone(board: GoBoard, row: number, col: number, color: StoneColor): MoveResult {
  if (!inBounds(board, row, col) || board.grid[row][col] !== null) {
    return { valid: false, reason: 'occupied', board, captured: [] };
  }

  // Ko check
  if (board.koPoint && board.koPoint[0] === row && board.koPoint[1] === col) {
    return { valid: false, reason: 'ko', board, captured: [] };
  }

  const newBoard = cloneBoard(board);
  newBoard.grid[row][col] = color;
  newBoard.koPoint = null;

  // Check captures of opponent groups adjacent to placed stone
  const allCaptured: Point[] = [];
  const opp = opponent(color);

  for (const [nr, nc] of getNeighbors(newBoard, row, col)) {
    if (newBoard.grid[nr][nc] === opp) {
      const group = getGroup(newBoard, nr, nc);
      if (group.liberties.length === 0) {
        for (const [sr, sc] of group.stones) {
          newBoard.grid[sr][sc] = null;
          allCaptured.push([sr, sc]);
        }
      }
    }
  }

  // Suicide check: if placed stone's group has no liberties after captures, move is illegal
  const ownGroup = getGroup(newBoard, row, col);
  if (ownGroup.liberties.length === 0) {
    return { valid: false, reason: 'suicide', board, captured: [] };
  }

  // Set ko point if exactly one stone was captured and the capturing stone has exactly one liberty
  if (allCaptured.length === 1 && ownGroup.stones.length === 1 && ownGroup.liberties.length === 1) {
    newBoard.koPoint = allCaptured[0];
  }

  return { valid: true, board: newBoard, captured: allCaptured };
}

export function getLegalMoves(board: GoBoard, color: StoneColor): Point[] {
  const moves: Point[] = [];
  for (let r = 0; r < board.size; r++) {
    for (let c = 0; c < board.size; c++) {
      if (board.grid[r][c] !== null) continue;
      const result = placeStone(board, r, c, color);
      if (result.valid) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

// Candidate moves near existing stones. Falls back to full legal move generation.
export function getCandidateMoves(board: GoBoard, color: StoneColor): Point[] {
  const size = board.size;
  const toKey = (r: number, c: number) => r * size + c;
  const candidates = new Set<number>();
  let hasAnyStone = false;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board.grid[r][c] === null) continue;
      hasAnyStone = true;
      for (const [nr, nc] of getNeighbors(board, r, c)) {
        if (board.grid[nr][nc] === null) {
          candidates.add(toKey(nr, nc));
        }
      }
    }
  }

  if (!hasAnyStone || candidates.size === 0) {
    return getLegalMoves(board, color);
  }

  const moves: Point[] = [];
  candidates.forEach((key) => {
    const r = Math.floor(key / size);
    const c = key % size;
    const result = placeStone(board, r, c, color);
    if (result.valid) {
      moves.push([r, c]);
    }
  });

  if (moves.length >= 6) {
    return moves;
  }

  // If candidate pruning got too narrow, use full legal moves for quality.
  return getLegalMoves(board, color);
}

// Simple territory estimation: flood-fill empty regions and assign to the color that fully surrounds them
export function estimateScore(board: GoBoard): { B: number; W: number } {
  const size = board.size;
  const toKey = (r: number, c: number) => r * size + c;
  const visited = new Set<number>();
  let bScore = 0;
  let wScore = 0;

  // Count stones
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board.grid[r][c] === 'B') bScore++;
      else if (board.grid[r][c] === 'W') wScore++;
    }
  }

  // Flood-fill empty regions
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board.grid[r][c] !== null || visited.has(toKey(r, c))) continue;

      const region: Point[] = [];
      const queue: Point[] = [[r, c]];
      const borderingColors = new Set<StoneColor>();
      visited.add(toKey(r, c));

      while (queue.length > 0) {
        const [cr, cc] = queue.pop()!;
        region.push([cr, cc]);

        for (const [nr, nc] of getNeighbors(board, cr, cc)) {
          const key = toKey(nr, nc);
          if (visited.has(key)) continue;
          const cell = board.grid[nr][nc];
          if (cell === null) {
            visited.add(key);
            queue.push([nr, nc]);
          } else {
            borderingColors.add(cell);
          }
        }
      }

      // If region is bordered by only one color, it's that color's territory
      if (borderingColors.size === 1) {
        const owner = borderingColors.values().next().value!;
        if (owner === 'B') bScore += region.length;
        else wScore += region.length;
      }
    }
  }

  return { B: bScore, W: wScore };
}

// Check if a point is an eye for the given color (all neighbors are same color or edge)
export function isEye(board: GoBoard, row: number, col: number, color: StoneColor): boolean {
  if (board.grid[row][col] !== null) return false;

  for (const [nr, nc] of getNeighbors(board, row, col)) {
    if (board.grid[nr][nc] !== color) return false;
  }

  // Check diagonals: at most one can be opponent or empty (for corner/edge eyes)
  const diagonals: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  let badDiagonals = 0;
  let totalDiagonals = 0;
  for (const [dr, dc] of diagonals) {
    const nr = row + dr;
    const nc = col + dc;
    if (!inBounds(board, nr, nc)) continue;
    totalDiagonals++;
    if (board.grid[nr][nc] !== color) badDiagonals++;
  }

  return badDiagonals <= (totalDiagonals <= 2 ? 0 : 1);
}
