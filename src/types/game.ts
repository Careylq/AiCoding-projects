// ── Enums and literal unions ──

export type DifficultyPreset =
  | 'beginner'
  | 'intermediate'
  | 'expert'
  | 'custom';

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';

export type CellStatus =
  | 'hidden'
  | 'flagged'
  | 'questioned'
  | 'revealed'
  | 'exploded'
  | 'misflagged';

// ── Core data structures ──

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  adjacentMines: number; // 0-8
  status: CellStatus;
}

export interface DifficultyConfig {
  preset: DifficultyPreset;
  rows: number;
  cols: number;
  mines: number;
}

export interface CustomDifficultyInput {
  rows: number;
  cols: number;
  mines: number;
}

// ── Game state ──

export interface GameState {
  phase: GamePhase;
  difficulty: DifficultyConfig;
  board: CellData[][];
  minesPlaced: boolean;
  firstClick: { row: number; col: number } | null;
  elapsedSeconds: number;
  flaggedCount: number;
  revealedCount: number;
}

// ── Reducer actions ──

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: DifficultyConfig }
  | { type: 'REVEAL_CELL'; row: number; col: number }
  | { type: 'FLAG_CELL'; row: number; col: number }
  | { type: 'CHORD_REVEAL'; row: number; col: number }
  | { type: 'TICK' };

// ── Leaderboard ──

export interface LeaderboardEntry {
  difficulty: DifficultyPreset;
  timeSeconds: number;
  date: string; // ISO string
}

export interface StoredLeaderboard {
  beginner: LeaderboardEntry[];
  intermediate: LeaderboardEntry[];
  expert: LeaderboardEntry[];
}
