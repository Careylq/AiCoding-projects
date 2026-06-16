import { useState } from 'react';
import type { DifficultyPreset, StoredLeaderboard } from '../../types/game';
import styles from './Leaderboard.module.css';

interface LeaderboardProps {
  entries: StoredLeaderboard;
  onClear: () => void;
  onClose: () => void;
}

const LABELS: Record<Exclude<DifficultyPreset, 'custom'>, string> = {
  beginner: '初级',
  intermediate: '中级',
  expert: '高级',
};

const DIFF_ORDER: (Exclude<DifficultyPreset, 'custom'>)[] = [
  'beginner',
  'intermediate',
  'expert',
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function Leaderboard({ entries, onClear, onClose }: LeaderboardProps) {
  const [tab, setTab] = useState<Exclude<DifficultyPreset, 'custom'>>('beginner');

  const list = entries[tab] || [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>🏆 排行榜</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          {DIFF_ORDER.map((d) => (
            <button
              key={d}
              className={`${styles.tab} ${tab === d ? styles.activeTab : ''}`}
              onClick={() => setTab(d)}
            >
              {LABELS[d]}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {list.length === 0 ? (
            <p className={styles.empty}>暂无记录</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>时间</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {list.map((entry, i) => (
                  <tr key={i} className={i === 0 ? styles.top1 : ''}>
                    <td className={styles.rank}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </td>
                    <td className={styles.time}>{formatTime(entry.timeSeconds)}</td>
                    <td className={styles.date}>{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {list.length > 0 && (
          <button className={styles.clearBtn} onClick={onClear}>
            清除记录
          </button>
        )}
      </div>
    </div>
  );
}
