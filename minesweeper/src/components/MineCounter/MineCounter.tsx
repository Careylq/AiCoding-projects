import styles from './MineCounter.module.css';

interface MineCounterProps {
  totalMines: number;
  flaggedCount: number;
}

export function MineCounter({ totalMines, flaggedCount }: MineCounterProps) {
  const remaining = Math.max(0, totalMines - flaggedCount);
  const display = String(Math.min(999, remaining)).padStart(3, '0');

  return (
    <div className={styles.counter} aria-label={`${remaining} mines remaining`}>
      <span className={styles.icon}>💣</span>
      <span className={styles.digits}>{display}</span>
    </div>
  );
}
