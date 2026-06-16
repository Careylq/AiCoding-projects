import { useState } from 'react';
import type { DifficultyConfig } from '../../types/game';
import { CUSTOM_LIMITS, getMaxMines, validateCustom } from '../../constants/difficulties';
import styles from './CustomModal.module.css';

interface CustomModalProps {
  onConfirm: (config: DifficultyConfig) => void;
  onCancel: () => void;
}

export function CustomModal({ onConfirm, onCancel }: CustomModalProps) {
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [mines, setMines] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateCustom(rows, cols, mines);
    if (err) {
      setError(err);
      return;
    }
    onConfirm({ preset: 'custom', rows, cols, mines });
  };

  const handleRowsChange = (v: number) => {
    setRows(v);
    setError(null);
    const maxM = getMaxMines(v, cols);
    if (mines > maxM) setMines(maxM);
  };

  const handleColsChange = (v: number) => {
    setCols(v);
    setError(null);
    const maxM = getMaxMines(rows, v);
    if (mines > maxM) setMines(maxM);
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>自定义难度</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>行数 ({CUSTOM_LIMITS.minRows}-{CUSTOM_LIMITS.maxRows})</label>
            <input
              type="number"
              value={rows}
              min={CUSTOM_LIMITS.minRows}
              max={CUSTOM_LIMITS.maxRows}
              onChange={(e) => handleRowsChange(parseInt(e.target.value) || CUSTOM_LIMITS.minRows)}
            />
          </div>
          <div className={styles.field}>
            <label>列数 ({CUSTOM_LIMITS.minCols}-{CUSTOM_LIMITS.maxCols})</label>
            <input
              type="number"
              value={cols}
              min={CUSTOM_LIMITS.minCols}
              max={CUSTOM_LIMITS.maxCols}
              onChange={(e) => handleColsChange(parseInt(e.target.value) || CUSTOM_LIMITS.minCols)}
            />
          </div>
          <div className={styles.field}>
            <label>雷数 ({CUSTOM_LIMITS.minMines}-{getMaxMines(rows, cols)})</label>
            <input
              type="number"
              value={mines}
              min={CUSTOM_LIMITS.minMines}
              max={getMaxMines(rows, cols)}
              onChange={(e) => {
                setMines(parseInt(e.target.value) || 1);
                setError(null);
              }}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="submit" className={styles.confirm}>
              开始游戏
            </button>
            <button type="button" className={styles.cancel} onClick={onCancel}>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
