import type { DifficultyConfig, DifficultyPreset } from '../types/game';

export const DIFFICULTY_PRESETS: Record<
  Exclude<DifficultyPreset, 'custom'>,
  DifficultyConfig
> = {
  beginner: { preset: 'beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { preset: 'intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { preset: 'expert', rows: 16, cols: 30, mines: 99 },
};

export const DEFAULT_DIFFICULTY: DifficultyConfig = DIFFICULTY_PRESETS.beginner;

export const CUSTOM_LIMITS = {
  minRows: 2,
  maxRows: 40,
  minCols: 2,
  maxCols: 60,
  minMines: 1,
  // maxMines is computed: (rows - 1) * (cols - 1)
};

export function getMaxMines(rows: number, cols: number): number {
  return Math.max(1, (rows - 1) * (cols - 1));
}

export function validateCustom(
  rows: number,
  cols: number,
  mines: number
): string | null {
  if (rows < CUSTOM_LIMITS.minRows || rows > CUSTOM_LIMITS.maxRows) {
    return `Rows must be between ${CUSTOM_LIMITS.minRows} and ${CUSTOM_LIMITS.maxRows}`;
  }
  if (cols < CUSTOM_LIMITS.minCols || cols > CUSTOM_LIMITS.maxCols) {
    return `Columns must be between ${CUSTOM_LIMITS.minCols} and ${CUSTOM_LIMITS.maxCols}`;
  }
  const maxMines = getMaxMines(rows, cols);
  if (mines < CUSTOM_LIMITS.minMines || mines > maxMines) {
    return `Mines must be between ${CUSTOM_LIMITS.minMines} and ${maxMines}`;
  }
  return null;
}
