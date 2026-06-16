import styles from './Timer.module.css';

interface TimerProps {
  elapsedSeconds: number;
}

export function Timer({ elapsedSeconds }: TimerProps) {
  const display = String(Math.min(999, elapsedSeconds)).padStart(3, '0');

  return (
    <div className={styles.timer} aria-label={`${elapsedSeconds} seconds elapsed`}>
      <span className={styles.icon}>⏱</span>
      <span className={styles.digits}>{display}</span>
    </div>
  );
}
