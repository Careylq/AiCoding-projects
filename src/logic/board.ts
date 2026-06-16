import type { CellData } from '../types/game';

// ── Helpers ──

function inBounds(
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function key(row: number, col: number): string {
  return `${row},${col}`;
}

// Fisher-Yates random integer in [min, max] inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Board creation ──

export function createEmptyBoard(rows: number, cols: number): CellData[][] {
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        adjacentMines: 0,
        status: 'hidden',
      });
    }
    board.push(row);
  }
  return board;
}

// ── Mine placement (first-click protection via Fisher-Yates partial shuffle) ──

export function placeMines(
  board: CellData[][],
  mineCount: number,
  safeRow: number,
  safeCol: number
): CellData[][] {
  const rows = board.length;
  const cols = board[0].length;

  // Deep clone the board
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  // Build exclusion zone: safe cell + its 8 neighbors
  const exclusion = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr;
      const c = safeCol + dc;
      if (inBounds(r, c, rows, cols)) {
        exclusion.add(key(r, c));
      }
    }
  }

  // Build list of eligible positions
  const eligible: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!exclusion.has(key(r, c))) {
        eligible.push([r, c]);
      }
    }
  }

  // Clamp mine count
  const actualMines = Math.min(mineCount, eligible.length);

  // Fisher-Yates partial shuffle: shuffle only the first actualMines elements
  for (let i = 0; i < actualMines; i++) {
    const j = randomInt(i, eligible.length - 1);
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  // Place mines
  for (let i = 0; i < actualMines; i++) {
    const [r, c] = eligible[i];
    newBoard[r][c].isMine = true;
  }

  // Compute adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc, rows, cols)) {
              newBoard[nr][nc].adjacentMines++;
            }
          }
        }
      }
    }
  }

  return newBoard;
}

// ── Flood fill (iterative stack to avoid recursive stack overflow) ──

export function floodFill(
  board: CellData[][],
  startRow: number,
  startCol: number
): { board: CellData[][]; revealedCount: number } {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  let revealedCount = 0;

  const cell = newBoard[startRow][startCol];

  // If starting cell has adjacent mines, reveal just it
  if (cell.adjacentMines > 0) {
    if (cell.status === 'hidden') {
      cell.status = 'revealed';
      revealedCount = 1;
    }
    return { board: newBoard, revealedCount };
  }

  // BFS with explicit stack
  const stack: [number, number][] = [[startRow, startCol]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const cur = newBoard[r][c];

    // Skip already revealed or flagged/questioned cells
    if (cur.status === 'revealed') continue;
    if (cur.status === 'flagged' || cur.status === 'questioned') continue;

    cur.status = 'revealed';
    revealedCount++;

    // Only expand from empty cells
    if (cur.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (
            inBounds(nr, nc, rows, cols) &&
            newBoard[nr][nc].status === 'hidden'
          ) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  }

  return { board: newBoard, revealedCount };
}

// ── Chord reveal ──

export function chordReveal(
  board: CellData[][],
  row: number,
  col: number
): { board: CellData[][]; hitMine: boolean; revealedCount: number } {
  const rows = board.length;
  const cols = board[0].length;
  const cell = board[row][col];

  // Guard: only on revealed numbered cells
  if (cell.status !== 'revealed' || cell.adjacentMines === 0) {
    return { board, hitMine: false, revealedCount: 0 };
  }

  // Count flagged neighbors
  let flaggedCount = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (inBounds(nr, nc, rows, cols) && board[nr][nc].status === 'flagged') {
        flaggedCount++;
      }
    }
  }

  // Only chord if flags match number
  if (flaggedCount !== cell.adjacentMines) {
    return { board, hitMine: false, revealedCount: 0 };
  }

  // Reveal all non-flagged, non-revealed neighbors
  let currentBoard = board.map((r) => r.map((c) => ({ ...c })));
  let hitMine = false;
  let totalRevealed = 0;

  const neighbors: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (!inBounds(nr, nc, rows, cols)) continue;
      const neighbor = currentBoard[nr][nc];
      if (neighbor.status === 'flagged') continue;
      if (neighbor.status === 'revealed') continue;
      neighbors.push([nr, nc]);
    }
  }

  for (const [nr, nc] of neighbors) {
    const neighbor = currentBoard[nr][nc];
    if (neighbor.isMine) {
      neighbor.status = 'exploded';
      hitMine = true;
    } else {
      const result = floodFill(currentBoard, nr, nc);
      currentBoard = result.board;
      totalRevealed += result.revealedCount;
    }
  }

  return { board: currentBoard, hitMine, revealedCount: totalRevealed };
}

// ── Build lose-state board (reveal all mines, mark misflags) ──

export function revealAllMines(board: CellData[][]): CellData[][] {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.isMine && cell.status !== 'flagged') {
        return { ...cell, status: 'revealed' as const };
      }
      if (cell.isMine && cell.status === 'flagged') {
        return { ...cell }; // correctly flagged, leave as is
      }
      if (!cell.isMine && cell.status === 'flagged') {
        return { ...cell, status: 'misflagged' as const };
      }
      return { ...cell };
    })
  );
}

// ── Count revealed cells (for initial board without counter) ──

export function countRevealed(board: CellData[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.status === 'revealed') count++;
    }
  }
  return count;
}
