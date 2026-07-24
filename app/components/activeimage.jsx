"use client";

import { memo, useEffect } from "react";
import { FaCheck, FaTimes, FaKeyboard } from "react-icons/fa";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "../page.module.css";

function ActiveGame({
  team1,
  team2,
  score1,
  score2,
  isTeam1Turn,
  currentTurnPoints,
  currentWord,
  duration,
  timerKey,
  onAnswer,
  onTimerComplete,
}) {
  // Keyboard shortcuts only need to be live while this screen is mounted.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowLeft") {
        e.preventDefault();
        onAnswer(false);
      } else if (e.code === "Enter" || e.code === "ArrowRight") {
        e.preventDefault();
        onAnswer(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onAnswer]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.topBar}>
        <div className={styles.scoreBoard}>
          <div className={`${styles.scoreBox} ${isTeam1Turn ? styles.activeScoreBox : ""}`}>
            <small>{team1}</small>
            <span>
              {score1 + (isTeam1Turn ? currentTurnPoints : 0)}
              {isTeam1Turn && currentTurnPoints > 0 && (
                <small className={styles.turnIncrement}>(+{currentTurnPoints})</small>
              )}
            </span>
          </div>

          <div className={`${styles.scoreBox} ${!isTeam1Turn ? styles.activeScoreBox : ""}`}>
            <small>{team2}</small>
            <span>
              {score2 + (!isTeam1Turn ? currentTurnPoints : 0)}
              {!isTeam1Turn && currentTurnPoints > 0 && (
                <small className={styles.turnIncrement}>(+{currentTurnPoints})</small>
              )}
            </span>
          </div>
        </div>

        <div className={styles.timerWrapper}>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying
            duration={duration}
            size={76}
            strokeWidth={6}
            colors={["#22c55e", "#eab308", "#ef4444"]}
            colorsTime={[duration, duration / 2, 0]}
            onComplete={onTimerComplete}
            trailColor="rgba(255, 255, 255, 0.1)"
          >
            {({ remainingTime }) => (
              <span className={styles.timerText} aria-live="polite">
                {remainingTime}
              </span>
            )}
          </CountdownCircleTimer>
        </div>
      </div>

      <div className={styles.wordCard}>
        <div className={styles.wordSubHeader}>
          <span className={styles.wordHeader}>Բացատրեք բառը</span>
          <span className={styles.liveScoreBadge}>
            Այս փուլում՝ <strong>+{currentTurnPoints}</strong>
          </span>
        </div>
        <h1 className={styles.currentWord}>{currentWord}</h1>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.skipButton}
          onClick={() => onAnswer(false)}
          aria-label="Բաց թողնել բառը"
        >
          <FaTimes aria-hidden="true" /> Բաց թողնել
        </button>

        <button
          className={styles.correctButton}
          onClick={() => onAnswer(true)}
          aria-label="Նշել բառը որպես ճիշտ"
        >
          <FaCheck aria-hidden="true" /> Ճիշտ է
        </button>
      </div>

      <div className={styles.keyboardHint}>
        <FaKeyboard aria-hidden="true" /> Ստեղնաշար՝ [Space/←] Բաց թողնել | [Enter/→] Ճիշտ է
      </div>
    </div>
  );
}

// Memoized so ticking the timer doesn't cascade re-renders into
// screens that aren't mounted, and re-renders here only happen when
// the props that actually matter to gameplay change.
export default memo(ActiveGame);