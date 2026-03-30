import { GoBoard, MCTSMoveResult, MCTSNode, Point, StoneColor } from './types';
import {
  boardHash,
  cloneBoard,
  estimateScore,
  getCandidateMoves,
  getGroup,
  getNeighbors,
  isEye,
  placeStone,
} from './goEngine';

type PositionStats = {
  wins: number;
  visits: number;
};

const MOVE_CACHE_MAX = 5000;
const POSITION_STATS_MAX = 12000;
const candidateMovesCache = new Map<string, Point[]>();
const positionStats = new Map<string, PositionStats>();

function cacheSet<T>(cache: Map<string, T>, key: string, value: T, maxSize: number): void {
  if (cache.size >= maxSize) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  cache.set(key, value);
}

function opponent(color: StoneColor): StoneColor {
  return color === 'B' ? 'W' : 'B';
}

function getCachedCandidateMoves(board: GoBoard, color: StoneColor): Point[] {
  const key = `${boardHash(board)}|${color}`;
  const cached = candidateMovesCache.get(key);
  if (cached) return cached.map(([r, c]) => [r, c]);
  const generated = getCandidateMoves(board, color);
  cacheSet(candidateMovesCache, key, generated, MOVE_CACHE_MAX);
  return generated.map(([r, c]) => [r, c]);
}

function moveHeuristic(board: GoBoard, move: Point, color: StoneColor): number {
  const result = placeStone(board, move[0], move[1], color);
  if (!result.valid) return -1e9;

  let score = 0;
  const captured = result.captured.length;
  const ownGroup = getGroup(result.board, move[0], move[1]);
  const ownLiberties = ownGroup.liberties.length;
  const opp = opponent(color);

  // Strongly prioritize tactical wins and avoiding self-atari.
  score += captured * 12;
  if (ownLiberties <= 1) score -= 10;
  else if (ownLiberties === 2) score -= 3;
  else score += Math.min(ownLiberties, 4) * 0.8;

  let putsOpponentInAtari = 0;
  let friendlyNeighbors = 0;
  for (const [nr, nc] of getNeighbors(result.board, move[0], move[1])) {
    const cell = result.board.grid[nr][nc];
    if (cell === color) {
      friendlyNeighbors++;
      continue;
    }
    if (cell === opp) {
      const group = getGroup(result.board, nr, nc);
      if (group.liberties.length === 1) {
        putsOpponentInAtari++;
      }
    }
  }

  score += putsOpponentInAtari * 5;
  score += friendlyNeighbors * 1.5;

  // Slight center preference early-ish, reduced later.
  let emptyCount = 0;
  for (let r = 0; r < board.size; r++) {
    for (let c = 0; c < board.size; c++) {
      if (board.grid[r][c] === null) emptyCount++;
    }
  }
  const center = (board.size - 1) / 2;
  const centerDist = Math.abs(move[0] - center) + Math.abs(move[1] - center);
  if (emptyCount > board.size * board.size * 0.45) {
    score += Math.max(0, 4 - centerDist * 0.7);
  }

  return score;
}

function shouldPass(board: GoBoard, color: StoneColor, bestWinRate: number): boolean {
  let empties = 0;
  for (let r = 0; r < board.size; r++) {
    for (let c = 0; c < board.size; c++) {
      if (board.grid[r][c] === null) empties++;
    }
  }
  if (empties > 12) return false;

  const score = estimateScore(board);
  const lead = color === 'W' ? score.W + 7 - score.B : score.B - (score.W + 7);

  // Prefer passing only late, when ahead, and no clearly strong continuation appears.
  return lead > 4 && bestWinRate < 0.53;
}

function createNode(board: GoBoard, color: StoneColor, move: Point | null, parent: MCTSNode | null): MCTSNode {
  const key = `${boardHash(board)}|${color}`;
  const prior = positionStats.get(key);
  const priorVisits = prior ? Math.min(prior.visits, 24) : 0;
  const priorWins = prior ? Math.min(prior.wins, priorVisits) : 0;

  return {
    board,
    color,
    move,
    parent,
    children: [],
    wins: priorWins,
    visits: priorVisits,
    untriedMoves: getCachedCandidateMoves(board, color),
  };
}

// UCB1 formula for tree selection
function ucb1(node: MCTSNode, parentVisits: number, C: number = 1.4): number {
  if (node.visits === 0) return Infinity;
  return (node.wins / node.visits) + C * Math.sqrt(Math.log(parentVisits) / node.visits);
}

// Select: descend tree picking highest UCB1 child
function select(node: MCTSNode): MCTSNode {
  let current = node;
  while (current.untriedMoves.length === 0 && current.children.length > 0) {
    let bestChild = current.children[0];
    let bestScore = -Infinity;
    for (const child of current.children) {
      const score = ucb1(child, current.visits);
      if (score > bestScore) {
        bestScore = score;
        bestChild = child;
      }
    }
    current = bestChild;
  }
  return current;
}

// Expand: add a child for one untried move
function expand(node: MCTSNode): MCTSNode {
  if (node.untriedMoves.length === 0) return node;

  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < node.untriedMoves.length; i++) {
    const score = moveHeuristic(node.board, node.untriedMoves[i], node.color);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  const move = node.untriedMoves[bestIdx];
  node.untriedMoves.splice(bestIdx, 1);

  const result = placeStone(node.board, move[0], move[1], node.color);
  if (!result.valid) return node;

  const child = createNode(result.board, opponent(node.color), move, node);
  node.children.push(child);
  return child;
}

// Simulate: random playout from position to terminal state
function simulate(board: GoBoard, startColor: StoneColor): StoneColor {
  let currentBoard = cloneBoard(board);
  let color = startColor;
  let consecutivePasses = 0;

  for (let i = 0; i < 80; i++) {
    const moves = getCachedCandidateMoves(currentBoard, color);

    // Filter out eye-filling moves (basic heuristic)
    const nonEyeMoves = moves.filter(([r, c]) => !isEye(currentBoard, r, c, color));
    const candidateMoves = nonEyeMoves.length > 0 ? nonEyeMoves : moves;

    if (candidateMoves.length === 0) {
      consecutivePasses++;
      if (consecutivePasses >= 2) break;
      color = opponent(color);
      continue;
    }

    consecutivePasses = 0;

    // Mostly-guided rollout with a touch of randomness.
    let chosenMove = candidateMoves[0];
    let chosenScore = -Infinity;
    for (const move of candidateMoves) {
      const score = moveHeuristic(currentBoard, move, color);
      if (score > chosenScore) {
        chosenScore = score;
        chosenMove = move;
      }
    }

    // Keep some exploration so rollouts don't become deterministic.
    if (candidateMoves.length > 1 && Math.random() < 0.2) {
      chosenMove = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
    }

    const result = placeStone(currentBoard, chosenMove[0], chosenMove[1], color);
    if (result.valid) {
      currentBoard = result.board;
    }

    color = opponent(color);
  }

  // Simple scoring: count stones + territory
  let bScore = 0;
  let wScore = 0;
  for (let r = 0; r < currentBoard.size; r++) {
    for (let c = 0; c < currentBoard.size; c++) {
      const cell = currentBoard.grid[r][c];
      if (cell === 'B') bScore++;
      else if (cell === 'W') wScore++;
    }
  }
  // Komi for White (6.5 simplified to 7 for integer comparison)
  wScore += 7;

  return bScore > wScore ? 'B' : 'W';
}

// Backpropagate: update wins/visits up the tree
function backpropagate(node: MCTSNode | null, winner: StoneColor): void {
  let current = node;
  while (current) {
    current.visits++;
    // A node's "wins" count from the perspective of the player who just moved TO this node
    // So if the winner matches the opponent of node.color, it's a win for the player who moved here
    if (winner !== current.color) {
      current.wins++;
    }

    const key = `${boardHash(current.board)}|${current.color}`;
    const stat = positionStats.get(key) ?? { wins: 0, visits: 0 };
    stat.visits++;
    if (winner !== current.color) stat.wins++;
    if (stat.visits > 250) {
      stat.visits = Math.floor(stat.visits * 0.7);
      stat.wins = Math.min(stat.wins, stat.visits);
    }
    cacheSet(positionStats, key, stat, POSITION_STATS_MAX);

    current = current.parent;
  }
}

// Run MCTS for a given number of playouts
export function runMCTS(board: GoBoard, color: StoneColor, playouts: number): MCTSMoveResult[] {
  const root = createNode(board, color, null, null);

  for (let i = 0; i < playouts; i++) {
    // Select
    let node = select(root);

    // Expand
    if (node.untriedMoves.length > 0) {
      node = expand(node);
    }

    // Simulate
    const winner = simulate(node.board, node.color);

    // Backpropagate
    backpropagate(node, winner);
  }

  // Collect results from root's children
  return root.children
    .filter(child => child.move !== null)
    .map(child => ({
      move: child.move!,
      visits: child.visits,
      winRate: child.visits > 0 ? child.wins / child.visits : 0,
    }))
    .sort((a, b) => b.visits - a.visits);
}

// Get the best move from MCTS
export function getBestMove(board: GoBoard, color: StoneColor, playouts: number = 1500): Point | null {
  const results = runMCTS(board, color, playouts);
  if (results.length === 0) return null;
  if (shouldPass(board, color, results[0].winRate)) return null;
  return results[0].move;
}
