"use client";

import { FaTrophy, FaPlay } from "react-icons/fa";
import styles from "../page.module.css";

export default function ReadyScreen({
  activeTeamName,
  team1,
  team2,
  score1,
  score2,
  isTeam1Turn,
  targetScore,
  onStartTurn,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.readyHeader}>
        <FaTrophy size={56} className={styles.trophyIcon} aria-hidden="true" />
        <span className={styles.turnBadge}>Հերթը պատկանում է</span>
        <h1 className={styles.activeTeamTitle}>{activeTeamName}</h1>
      </div>

      <div className={styles.scoreOverview}>
        <div className={`${styles.scorePill} ${isTeam1Turn ? styles.activePill : ""}`}>
          <span>{team1}</span>
          <strong>{score1}</strong>
        </div>
        <div className={`${styles.scorePill} ${!isTeam1Turn ? styles.activePill : ""}`}>
          <span>{team2}</span>
          <strong>{score2}</strong>
        </div>
      </div>

      <p className={styles.targetHint}>
        Նպատակ՝ առաջինը հավաքել <strong>{targetScore}</strong> միավոր
      </p>

      <button className={styles.primaryButton} onClick={onStartTurn} autoFocus>
        <FaPlay size={14} aria-hidden="true" /> Սկսել Փուլը
      </button>
    </div>
  );
}