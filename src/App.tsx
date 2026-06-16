import { useState, useCallback, useEffect, useRef } from 'react';
import type { DifficultyConfig } from './types/game';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { useLeaderboard } from './hooks/useLeaderboard';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import { GameOverlay } from './components/GameOverlay/GameOverlay';
import { Leaderboard } from './components/Leaderboard/Leaderboard';
import { CustomModal } from './components/CustomModal/CustomModal';
import styles from './App.module.css';

function App() {
  const { state, reveal, flag, newGame } = useGame();
  const { playClick, playFlag, playExplosion, playWin, muted, toggleMute } =
    useSound();
  const { entries, addEntry, clearEntries } = useLeaderboard();

  const [showCustom, setShowCustom] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const prevPhaseRef = useRef(state.phase);
  const prevRevealedRef = useRef(state.revealedCount);
  const prevFlaggedRef = useRef(state.flaggedCount);

  // Sound effects based on state changes
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const prevRevealed = prevRevealedRef.current;
    const prevFlagged = prevFlaggedRef.current;

    if (state.phase === 'lost' && prevPhase !== 'lost') {
      playExplosion();
    } else if (state.phase === 'won' && prevPhase !== 'won') {
      playWin();
      // Add to leaderboard for preset difficulties
      if (state.difficulty.preset !== 'custom') {
        addEntry(state.difficulty.preset, state.elapsedSeconds);
      }
    } else if (state.revealedCount > prevRevealed && state.phase === 'playing') {
      playClick();
    } else if (state.flaggedCount > prevFlagged) {
      playFlag();
    }

    prevPhaseRef.current = state.phase;
    prevRevealedRef.current = state.revealedCount;
    prevFlaggedRef.current = state.flaggedCount;
  }, [
    state.phase,
    state.revealedCount,
    state.flaggedCount,
    state.difficulty.preset,
    state.elapsedSeconds,
    playClick,
    playFlag,
    playExplosion,
    playWin,
    addEntry,
  ]);

  const handleReveal = useCallback(
    (row: number, col: number) => {
      reveal(row, col);
    },
    [reveal]
  );

  const handleFlag = useCallback(
    (row: number, col: number) => {
      flag(row, col);
    },
    [flag]
  );

  const handleNewGame = useCallback(() => {
    newGame(state.difficulty);
  }, [newGame, state.difficulty]);

  const handleSelectDifficulty = useCallback(
    (config: DifficultyConfig) => {
      newGame(config);
    },
    [newGame]
  );

  const handleCustom = useCallback(() => {
    setShowCustom(true);
  }, []);

  const handleCustomConfirm = useCallback(
    (config: DifficultyConfig) => {
      setShowCustom(false);
      newGame(config);
    },
    [newGame]
  );

  const handleCustomCancel = useCallback(() => {
    setShowCustom(false);
  }, []);

  const isDisabled = state.phase === 'won' || state.phase === 'lost';

  return (
    <div className={styles.app}>
      <Header
        phase={state.phase}
        totalMines={state.difficulty.mines}
        flaggedCount={state.flaggedCount}
        elapsedSeconds={state.elapsedSeconds}
        currentPreset={state.difficulty.preset}
        muted={muted}
        onNewGame={handleNewGame}
        onSelectDifficulty={handleSelectDifficulty}
        onCustom={handleCustom}
        onToggleMute={toggleMute}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />

      <div className={styles.boardWrapper}>
        <Board
          board={state.board}
          onReveal={handleReveal}
          onFlag={handleFlag}
          disabled={isDisabled}
        />
        <GameOverlay
          phase={state.phase}
          elapsedSeconds={state.elapsedSeconds}
          onNewGame={handleNewGame}
        />
      </div>

      <p className={styles.footer}>
        左键翻开 | 右键标记 | 双击数字快速翻开
      </p>

      {showCustom && (
        <CustomModal
          onConfirm={handleCustomConfirm}
          onCancel={handleCustomCancel}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          entries={entries}
          onClear={clearEntries}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}

export default App;
