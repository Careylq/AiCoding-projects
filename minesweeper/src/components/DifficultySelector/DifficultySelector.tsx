import type { DifficultyPreset, DifficultyConfig } from '../../types/game';
import { DIFFICULTY_PRESETS } from '../../constants/difficulties';
import styles from './DifficultySelector.module.css';

interface DifficultySelectorProps {
  currentPreset: DifficultyPreset;
  onSelect: (config: DifficultyConfig) => void;
  onCustom: () => void;
}

const LABELS: Record<DifficultyPreset, string> = {
  beginner: '初级',
  intermediate: '中级',
  expert: '高级',
  custom: '自定义',
};

export function DifficultySelector({
  currentPreset,
  onSelect,
  onCustom,
}: DifficultySelectorProps) {
  const presets = Object.entries(DIFFICULTY_PRESETS) as [
    Exclude<DifficultyPreset, 'custom'>,
    DifficultyConfig,
  ][];

  return (
    <div className={styles.selector}>
      {presets.map(([key, config]) => (
        <button
          key={key}
          className={`${styles.btn} ${currentPreset === key ? styles.active : ''}`}
          onClick={() => onSelect(config)}
        >
          {LABELS[key]}
          <span className={styles.detail}>
            {config.rows}×{config.cols}
          </span>
        </button>
      ))}
      <button
        className={`${styles.btn} ${currentPreset === 'custom' ? styles.active : ''}`}
        onClick={onCustom}
      >
        {LABELS.custom}
      </button>
    </div>
  );
}
