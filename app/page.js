"use client";

import { useReducer, useEffect, useCallback } from "react";
import { FaTrophy, FaRedo } from "react-icons/fa";
// ✅ CORRECT: Default imports (no curly braces)
import SetupScreen from "./components/setupscreen.jsx";
import ReadyScreen from "./components/readyscreen.jsx";
import ActiveGame from "./components/activeimage.jsx";
import SummaryView from "./components/summaryview.jsx";

// Keep curly braces for named exports from utility files
import { gameReducer, initialState } from "./logic/gamereducer";
import { playSFX, triggerHaptic } from "./logic/sfx";
import styles from "./page.module.css";

export default function GamePage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Derived state values
  const activeTeamName = state.isTeam1Turn
    ? state.team1 || "Թիմ 1"
    : state.team2 || "Թիմ 2";

  const currentTurnPoints = state.turnHistory.reduce(
    (acc, item) => (item.isCorrect ? acc + 1 : acc),
    0,
  );

  // Sound & haptic effects on word answer
  const handleAnswer = useCallback((isCorrect) => {
    playSFX(isCorrect ? "correct" : "skip");
    triggerHaptic(isCorrect ? 35 : [20, 20]);
    dispatch({ type: "NEXT_WORD", payload: { isCorrect } });
  }, []);

  // Sound trigger on victory
  useEffect(() => {
    if (state.gameState === "GAME_OVER") {
      playSFX("win");
    }
  }, [state.gameState]);

  return (
    <main className={styles.main}>
      {/* 1. SETUP SCREEN */}
      {state.gameState === "SETUP" && (
        <SetupScreen
          team1={state.team1}
          team2={state.team2}
          duration={state.duration}
          targetScore={state.targetScore}
          onTeam1Change={(val) => dispatch({ type: "SET_TEAM1", payload: val })}
          onTeam2Change={(val) => dispatch({ type: "SET_TEAM2", payload: val })}
          onDurationChange={(val) =>
            dispatch({ type: "SET_DURATION", payload: val })
          }
          onTargetScoreChange={(val) =>
            dispatch({ type: "SET_TARGET_SCORE", payload: val })
          }
          onStart={() => dispatch({ type: "START_GAME" })}
        />
      )}

      {/* 2. READY SCREEN */}
      {state.gameState === "READY" && (
        <ReadyScreen
          activeTeamName={activeTeamName}
          team1={state.team1 || "Թիմ 1"}
          team2={state.team2 || "Թիմ 2"}
          score1={state.score1}
          score2={state.score2}
          isTeam1Turn={state.isTeam1Turn}
          targetScore={state.targetScore}
          onStartTurn={() => dispatch({ type: "START_TURN" })}
        />
      )}

      {/* 3. ACTIVE GAMEPLAY SCREEN */}
      {state.gameState === "PLAYING" && (
        <ActiveGame
          team1={state.team1 || "Թիմ 1"}
          team2={state.team2 || "Թիմ 2"}
          score1={state.score1}
          score2={state.score2}
          isTeam1Turn={state.isTeam1Turn}
          currentTurnPoints={currentTurnPoints}
          currentWord={state.currentWord}
          duration={state.duration}
          timerKey={state.timerKey}
          onAnswer={handleAnswer}
          onTimerComplete={() => dispatch({ type: "TIMER_COMPLETE" })}
        />
      )}

      {/* 4. SUMMARY SCREEN */}
      {state.gameState === "SUMMARY" && (
        <SummaryView
          teamName={activeTeamName}
          turnHistory={state.turnHistory}
          currentTurnPoints={currentTurnPoints}
          onToggleWord={(index) =>
            dispatch({ type: "TOGGLE_WORD", payload: index })
          }
          onConfirm={() => dispatch({ type: "CONFIRM_SUMMARY" })}
        />
      )}

      {/* 5. GAME OVER SCREEN */}
      {state.gameState === "GAME_OVER" && (
        <div className={styles.card}>
          <div className={styles.readyHeader}>
            <FaTrophy size={64} color="#eab308" aria-hidden="true" />
            <span className={styles.turnBadge}>Հաղթող թիմն է</span>
            <h1 className={styles.activeTeamTitle}>{state.winnerTeam}</h1>
          </div>

          <div className={styles.scoreOverview}>
            <div className={styles.scorePill}>
              <span>{state.team1 || "Թիմ 1"}</span>
              <strong>{state.score1}</strong>
            </div>
            <div className={styles.scorePill}>
              <span>{state.team2 || "Թիմ 2"}</span>
              <strong>{state.score2}</strong>
            </div>
          </div>

          <button
            className={styles.primaryButton}
            onClick={() => dispatch({ type: "RESET" })}
          >
            <FaRedo size={14} aria-hidden="true" /> Նոր Խաղ
          </button>
        </div>
      )}
    </main>
  );
}
