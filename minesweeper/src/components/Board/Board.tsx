import { useCallback } from 'react';
import type { CellData } from '../../types/game';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

interface BoardProps {
  board: CellData[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  disabled: boolean;
}

export function Board({ board, onReveal, onFlag, disabled }: BoardProps) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  // Determine cell size: smaller for large boards
  const maxDim = Math.max(rows, cols);
  const cellSize = maxDim > 20 ? 28 : maxDim > 16 ? 32 : 36;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={`${styles.board} ${disabled ? styles.disabled : ''}`}
      style={
        {
          '--board-cols': cols,
          '--cell-size': `${cellSize}px`,
          '--cell-radius': cellSize <= 30 ? '2px' : '3px',
        } as React.CSSProperties
      }
      onContextMenu={handleContextMenu}
    >
      {board.map((row, r) =>
        row.map((cell) => (
          <Cell
            key={`${r},${cell.col}`}
            cell={cell}
            onReveal={onReveal}
            onFlag={onFlag}
          />
        ))
      )}
    </div>
  );
}
