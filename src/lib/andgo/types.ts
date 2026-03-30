export type StoneColor = 'B' | 'W';
export type Cell = StoneColor | null;
export type Point = [number, number]; // [row, col]

export interface GoBoard {
  size: number;
  grid: Cell[][];
  koPoint: Point | null;
}

export interface MoveResult {
  valid: boolean;
  reason?: 'occupied' | 'suicide' | 'ko';
  board: GoBoard;
  captured: Point[];
}

export interface GroupInfo {
  stones: Point[];
  liberties: Point[];
}

export interface MCTSNode {
  board: GoBoard;
  color: StoneColor;
  move: Point | null; // null for root
  parent: MCTSNode | null;
  children: MCTSNode[];
  wins: number;
  visits: number;
  untriedMoves: Point[];
}

export interface MCTSMoveResult {
  move: Point;
  visits: number;
  winRate: number;
}

export interface DailyPuzzle {
  board: GoBoard;
  correctMove: Point;
  difficulty: number;
  dateStr: string;
}

export interface AndGoState {
  phase: 'loading' | 'puzzle' | 'freeplay' | 'gameover';
  board: GoBoard;
  correctMove: Point | null;
  moveHistory: { point: Point; color: StoneColor }[];
  wrongAttempts: number;
  hintAvailable: boolean;
  botThinking: boolean;
  lastMove: Point | null;
  capturedCount: { B: number; W: number };
  scores: { B: number; W: number } | null;
}
