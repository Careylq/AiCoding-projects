import type { GamePhase } from '../../types/game';
import styles from './GameOverlay.module.css';

interface GameOverlayProps {
  phase: GamePhase;
  elapsedSeconds: number;
  onNewGame: () => void;
}

export function GameOverlay({ phase, elapsedSeconds, onNewGame }: GameOverlayProps) {
  if (phase !== 'won' && phase !== 'lost') return null;

  const isWin = phase === 'won';

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} ${isWin ? styles.win : styles.lose}`}>
        <div className={styles.emoji}>{isWin ? '🎉' : '💥'}</div>
        <h2 className={styles.title}>{isWin ? '你赢了！' : '游戏结束'}</h2>
        <p className={styles.time}>
          用时 <strong>{formatTime(elapsedSeconds)}</strong>
        </p>
        <button className={styles.btn} onClick={onNewGame}>
          🔄 再来一局
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
