import type { CellData } from '../../types/game';
import styles from './Cell.module.css';

interface CellProps {
  cell: CellData;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

// Classic Minesweeper number colors
const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export function Cell({ cell, onReveal, onFlag }: CellProps) {
  const { row, col, status, isMine, adjacentMines } = cell;

  const handleClick = () => {
    if (status === 'revealed') {
      // Chord on revealed number
      onReveal(row, col);
    } else if (status !== 'flagged' && status !== 'questioned') {
      onReveal(row, col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (status !== 'revealed') {
      onFlag(row, col);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'hidden':
        return '';
      case 'flagged':
        return '🚩';
      case 'questioned':
        return '❓';
      case 'revealed':
        if (isMine) return '💣';
        if (adjacentMines > 0) return adjacentMines;
        return '';
      case 'exploded':
        return '💣';
      case 'misflagged':
        return (
          <span className={styles.misflagged}>
            🚩<span className={styles.xMark}>✕</span>
          </span>
        );
      default:
        return '';
    }
  };

  const isRevealed =
    status === 'revealed' || status === 'exploded' || status === 'misflagged';

  const cellClassName = [
    styles.cell,
    isRevealed ? styles.revealed : styles.hidden,
    status === 'exploded' ? styles.exploded : '',
    status === 'misflagged' ? styles.misflaggedCell : '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentStyle: React.CSSProperties = {};
  if (status === 'revealed' && adjacentMines > 0 && !isMine) {
    contentStyle.color = NUMBER_COLORS[adjacentMines] || '#000';
  }

  return (
    <button
      className={cellClassName}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={contentStyle}
      type="button"
      data-row={row}
      data-col={col}
      aria-label={`Cell ${row}-${col}: ${status}`}
    >
      {renderContent()}
    </button>
  );
}
