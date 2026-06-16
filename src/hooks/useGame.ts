import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { DifficultyConfig } from '../types/game';
import { gameReducer, createInitialState } from '../logic/gameReducer';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const phaseRef = useRef(state.phase);

  // Keep ref in sync for timer effect deps
  useEffect(() => {
    phaseRef.current = state.phase;
  }, [state.phase]);

  // Timer
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  const reveal = useCallback(
    (row: number, col: number) => dispatch({ type: 'REVEAL_CELL', row, col }),
    []
  );
  const flag = useCallback(
    (row: number, col: number) => dispatch({ type: 'FLAG_CELL', row, col }),
    []
  );
  const chord = useCallback(
    (row: number, col: number) => dispatch({ type: 'CHORD_REVEAL', row, col }),
    []
  );
  const newGame = useCallback(
    (difficulty: DifficultyConfig) => dispatch({ type: 'NEW_GAME', difficulty }),
    []
  );

  return { state, reveal, flag, chord, newGame };
}
