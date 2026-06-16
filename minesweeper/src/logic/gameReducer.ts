import type { GameState, GameAction } from '../types/game';
import { DEFAULT_DIFFICULTY } from '../constants/difficulties';
import {
  createEmptyBoard,
  placeMines,
  floodFill,
  chordReveal,
  revealAllMines,
} from './board';

export function createInitialState(): GameState {
  const diff = DEFAULT_DIFFICULTY;
  return {
    phase: 'idle',
    difficulty: diff,
    board: createEmptyBoard(diff.rows, diff.cols),
    minesPlaced: false,
    firstClick: null,
    elapsedSeconds: 0,
    flaggedCount: 0,
    revealedCount: 0,
  };
}

function checkWin(revealedCount: number, totalCells: number, mines: number): boolean {
  return revealedCount === totalCells - mines;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const { difficulty } = action;
      return {
        phase: 'idle',
        difficulty,
        board: createEmptyBoard(difficulty.rows, difficulty.cols),
        minesPlaced: false,
        firstClick: null,
        elapsedSeconds: 0,
        flaggedCount: 0,
        revealedCount: 0,
      };
    }

    case 'REVEAL_CELL': {
      const { row, col } = action;
      const cell = state.board[row]?.[col];
      if (!cell) return state;

      // Ignore if already revealed, flagged, or questioned
      if (
        cell.status === 'revealed' ||
        cell.status === 'flagged' ||
        cell.status === 'questioned'
      ) {
        // If it's a revealed number, treat as chord
        if (cell.status === 'revealed' && cell.adjacentMines > 0) {
          return gameReducer(state, { type: 'CHORD_REVEAL', row, col });
        }
        return state;
      }

      // Ignore if game is over
      if (state.phase === 'won' || state.phase === 'lost') return state;

      // First click: place mines with protection, then reveal
      let board = state.board;
      let minesPlaced = state.minesPlaced;
      let firstClick = state.firstClick;

      if (!minesPlaced) {
        board = placeMines(
          state.board,
          state.difficulty.mines,
          row,
          col
        );
        minesPlaced = true;
        firstClick = { row, col };
      }

      // Check if this cell is a mine
      if (board[row][col].isMine) {
        // Explode this cell
        board = board.map((r) => r.map((c) => ({ ...c })));
        board[row][col].status = 'exploded';
        // Reveal all mines and mark misflags
        board = revealAllMines(board);
        return {
          ...state,
          phase: 'lost',
          board,
          minesPlaced,
          firstClick,
        };
      }

      // Safe reveal with flood fill
      const result = floodFill(board, row, col);
      const newRevealedCount = state.revealedCount + result.revealedCount;
      const totalCells = state.difficulty.rows * state.difficulty.cols;
      const won = checkWin(newRevealedCount, totalCells, state.difficulty.mines);

      return {
        ...state,
        phase: won ? 'won' : 'playing',
        board: result.board,
        minesPlaced,
        firstClick,
        revealedCount: newRevealedCount,
      };
    }

    case 'FLAG_CELL': {
      const { row, col } = action;
      if (state.phase === 'won' || state.phase === 'lost') return state;

      const cell = state.board[row]?.[col];
      if (!cell) return state;
      if (cell.status === 'revealed') return state;

      const newBoard = state.board.map((r) => r.map((c) => ({ ...c })));
      const cur = newBoard[row][col];
      let flaggedDelta = 0;

      // Cycle: hidden → flagged → questioned → hidden
      if (cur.status === 'hidden') {
        cur.status = 'flagged';
        flaggedDelta = 1;
      } else if (cur.status === 'flagged') {
        cur.status = 'questioned';
        flaggedDelta = -1;
      } else if (cur.status === 'questioned') {
        cur.status = 'hidden';
        flaggedDelta = 0;
      }

      return {
        ...state,
        board: newBoard,
        flaggedCount: state.flaggedCount + flaggedDelta,
      };
    }

    case 'CHORD_REVEAL': {
      const { row, col } = action;
      if (state.phase === 'won' || state.phase === 'lost') return state;
      if (!state.minesPlaced) return state;

      const result = chordReveal(state.board, row, col);

      if (result.hitMine) {
        return {
          ...state,
          phase: 'lost',
          board: result.board,
        };
      }

      const newRevealedCount = state.revealedCount + result.revealedCount;
      const totalCells = state.difficulty.rows * state.difficulty.cols;
      const won = checkWin(newRevealedCount, totalCells, state.difficulty.mines);

      return {
        ...state,
        phase: won ? 'won' : state.phase,
        board: result.board,
        revealedCount: newRevealedCount,
      };
    }

    case 'TICK': {
      if (state.phase !== 'playing') return state;
      const next = state.elapsedSeconds + 1;
      return {
        ...state,
        elapsedSeconds: next > 999 ? 999 : next,
      };
    }

    default:
      return state;
  }
}
