"use client";

import { FaPlay } from "react-icons/fa";
import styles from "../page.module.css";

const DURATION_OPTIONS = [30, 60, 90];
const TARGET_OPTIONS = [20, 30, 50];

export default function SetupScreen({
  team1,
  team2,
  duration,
  targetScore,
  onTeam1Change,
  onTeam2Change,
  onDurationChange,
  onTargetScoreChange,
  onStart,
}) {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Բառաշունչ</h1>
      <p className={styles.subtitle}>Աստվածաշնչյան Alias</p>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="team1-input">
          Թիմ 1
        </label>
        <input
          id="team1-input"
          type="text"
          placeholder="Օրինակ՝ Արարատ"
          className={styles.input}
          value={team1}
          onChange={(e) => onTeam1Change(e.target.value)}
        />

        <label className={styles.label} htmlFor="team2-input">
          Թիմ 2
        </label>
        <input
          id="team2-input"
          type="text"
          placeholder="Օրինակ՝ Սիոն"
          className={styles.input}
          value={team2}
          onChange={(e) => onTeam2Change(e.target.value)}
        />
      </div>

      <fieldset className={styles.optionSection}>
        <legend className={styles.label}>Փուլի տևողությունը</legend>
        <div className={styles.buttonGroup} role="radiogroup" aria-label="Փուլի տևողությունը">
          {DURATION_OPTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              role="radio"
              aria-checked={duration === sec}
              className={`${styles.optionBtn} ${duration === sec ? styles.selectedOption : ""}`}
              onClick={() => onDurationChange(sec)}
            >
              {sec} վրկ
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.optionSection}>
        <legend className={styles.label}>Հաղթելու միավորը</legend>
        <div className={styles.buttonGroup} role="radiogroup" aria-label="Հաղթելու միավորը">
          {TARGET_OPTIONS.map((pts) => (
            <button
              key={pts}
              type="button"
              role="radio"
              aria-checked={targetScore === pts}
              className={`${styles.optionBtn} ${targetScore === pts ? styles.selectedOption : ""}`}
              onClick={() => onTargetScoreChange(pts)}
            >
              {pts} միավոր
            </button>
          ))}
        </div>
      </fieldset>

      <button className={styles.primaryButton} onClick={onStart}>
        <FaPlay size={14} aria-hidden="true" /> Սկսել Խաղը
      </button>
    </div>
  );
}