import { useState, useCallback } from 'react';
import type {
  DifficultyPreset,
  LeaderboardEntry,
  StoredLeaderboard,
} from '../types/game';

const STORAGE_KEY = 'minesweeper-leaderboard';

function loadFromStorage(): StoredLeaderboard {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // corrupted data, reset
  }
  return { beginner: [], intermediate: [], expert: [] };
}

function saveToStorage(data: StoredLeaderboard): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<StoredLeaderboard>(loadFromStorage);

  const addEntry = useCallback(
    (difficulty: Exclude<DifficultyPreset, 'custom'>, timeSeconds: number) => {
      const newEntry: LeaderboardEntry = {
        difficulty,
        timeSeconds,
        date: new Date().toISOString(),
      };

      setEntries((prev) => {
        const updated = { ...prev };
        const list = [...(updated[difficulty] || []), newEntry];
        list.sort((a, b) => a.timeSeconds - b.timeSeconds);
        updated[difficulty] = list.slice(0, 10);
        saveToStorage(updated);
        return updated;
      });

      return newEntry;
    },
    []
  );

  const clearEntries = useCallback(() => {
    const empty: StoredLeaderboard = {
      beginner: [],
      intermediate: [],
      expert: [],
    };
    setEntries(empty);
    saveToStorage(empty);
  }, []);

  return { entries, addEntry, clearEntries };
}
