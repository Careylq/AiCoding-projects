import type { DifficultyConfig, DifficultyPreset, GamePhase } from '../../types/game';
import { MineCounter } from '../MineCounter/MineCounter';
import { Timer } from '../Timer/Timer';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import styles from './Header.module.css';

interface HeaderProps {
  phase: GamePhase;
  totalMines: number;
  flaggedCount: number;
  elapsedSeconds: number;
  currentPreset: DifficultyPreset;
  muted: boolean;
  onNewGame: () => void;
  onSelectDifficulty: (config: DifficultyConfig) => void;
  onCustom: () => void;
  onToggleMute: () => void;
  onShowLeaderboard: () => void;
}

const FACE_EMOJI: Record<GamePhase, string> = {
  idle: '🙂',
  playing: '🙂',
  won: '😎',
  lost: '😵',
};

export function Header({
  phase,
  totalMines,
  flaggedCount,
  elapsedSeconds,
  currentPreset,
  muted,
  onNewGame,
  onSelectDifficulty,
  onCustom,
  onToggleMute,
  onShowLeaderboard,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <MineCounter totalMines={totalMines} flaggedCount={flaggedCount} />
        <button
          className={styles.faceBtn}
          onClick={onNewGame}
          aria-label="New game"
        >
          {FACE_EMOJI[phase]}
        </button>
        <Timer elapsedSeconds={elapsedSeconds} />
      </div>
      <div className={styles.bottomRow}>
        <DifficultySelector
          currentPreset={currentPreset}
          onSelect={onSelectDifficulty}
          onCustom={onCustom}
        />
        <div className={styles.utilBtns}>
          <button
            className={styles.utilBtn}
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            title={muted ? '开启音效' : '静音'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            className={styles.utilBtn}
            onClick={onShowLeaderboard}
            aria-label="Leaderboard"
            title="排行榜"
          >
            🏆
          </button>
        </div>
      </div>
    </div>
  );
}
