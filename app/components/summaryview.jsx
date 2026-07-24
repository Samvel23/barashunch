"use client";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "../page.module.css";

export default function SummaryView({
  teamName,
  turnHistory,
  currentTurnPoints,
  onToggleWord,
  onConfirm,
}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.summaryTitle}>Փուլի Ամփոփում</h2>
      <p className={styles.subtitle}>{teamName} - վերանայեք բառերը</p>

      <div className={styles.wordList}>
        {turnHistory.length === 0 ? (
          <p className={styles.emptyText}>Ոչ մի բառ չի գուշակվել</p>
        ) : (
          turnHistory.map((item, idx) => (
            <button
              key={`${item.word}-${idx}`}
              type="button"
              className={`${styles.wordListItem} ${
                item.isCorrect ? styles.itemCorrect : styles.itemSkipped
              }`}
              onClick={() => onToggleWord(idx)}
              aria-pressed={item.isCorrect}
              aria-label={`${item.word} — սեղմեք՝ փոխելու համար`}
            >
              <span>{item.word}</span>
              <span className={styles.toggleBtn} aria-hidden="true">
                {item.isCorrect ? (
                  <FaCheckCircle color="#22c55e" size={20} />
                ) : (
                  <FaTimesCircle color="#ef4444" size={20} />
                )}
              </span>
            </button>
          ))
        )}
      </div>

      <div className={styles.summaryFooter}>
        <p>
          Փուլի միավորները՝ <strong>+{currentTurnPoints}</strong>
        </p>
        <button className={styles.primaryButton} onClick={onConfirm}>
          Հաստատել &amp; Շարունակել
        </button>
      </div>
    </div>
  );
}