"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";
import {
  FaCheck,
  FaTimes,
  FaTrophy,
  FaPlay,
  FaRedo,
  FaCheckCircle,
  FaTimesCircle,
  FaKeyboard,
} from "react-icons/fa";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// --- WEB AUDIO SFX HELPER ---
const playSFX = (type) => {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "skip") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === "win") {
      [261.63, 329.63, 392.0, 523.25].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3);
        o.start(ctx.currentTime + idx * 0.1);
        o.stop(ctx.currentTime + idx * 0.1 + 0.3);
      });
    }
  } catch (e) {
    // Audio Context fail-safe
  }
};

const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    navigator.vibrate(35);
  }
};

const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const bibleWords = [
  // --- FIGURES ---
  "Ադամ", "Եվա", "Կայեն", "Աբել", "Սեթ", "Ենովք", "Մաթուսաղա", "Նոյ", "Սեմ", "Քամ",
  "Հաբեթ", "Նեբրովթ", "Աբրահամ", "Սառա", "Հագար", "Իսմայել", "Իսահակ", "Ռեբեկա", "Եսավ", "Հակոբ",
  "Ռաքել", "Լիա", "Բիլհա", "Զիլփա", "Հովսեփ", "Բենիամին", "Ռուբեն", "Շմավոն", "Ղևի", "Հուդա",
  "Իսաքար", "Զաբուղոն", "Դան", "Նեփթաղիմ", "Գադ", "Ասեր", "Թամար", "Փարավոն", "Պոտիֆար", "Մովսես",
  "Ահարոն", "Մարիամ", "Սեպփորա", "Եղիազար", "Հեսու", "Քաղեբ", "Ռախաբ", "Գեդեոն", "Աբիմելեք", "Հեփթայե",
  "Սամսոն", "Դալիլա", "Հռութ", "Նոեմի", "Բոոս", "Սամուել", "Հեղի", "Աննա", "Սավուղ", "Դավիթ",
  "Գոլիաթ", "Հովնաթան", "Բերսաբե", "Աբիսողոմ", "Ադոնիա", "Սողոմոն", "Սաբայի թագուհի", "Ռոբովամ", "Հերոբովամ", "Եղիա",
  "Եղիսե", "Հեզաբել", "Աքաաբ", "Եսայի", "Երեմիա", "Եզեկիել", "Դանիել", "Ովսեե", "Հովել", "Ամովս",
  "Աբդիու", "Հովնան", "Միքիա", "Նավում", "Ամբակում", "Սոփոնիա", "Անգե", "Զաքարիա", "Մաղաքիա", "Եզրաս",
  "Նեեմիա", "Եսթեր", "Մուրթքե", "Համան", "Հոբ", "Շադրաք", "Մեսաք", "Աբեդնագով", "Մելքիսեդեկ", "Բաղաամ",
  "Գեհեզի", "Նեեման", "Եզեկիա", "Մանասե", "Եփրեմ", "Հովսիա", "Նաբուգոդոնոսոր", "Բաղտասար", "Կյուրոս", "Դարեհ",
  "Քսերքսես", "Տոբիթ", "Հուդիթ", "Մակաբե", "Մարիամ Աստվածածին", "Հովսեփ", "Հովհաննես Մկրտիչ", "Զաքարիա", "Եղիսաբեթ", "Գաբրիել Հրեշտակապետ",
  "Միքայել Հրեշտակապետ", "Պետրոս", "Անդրեաս", "Հակոբոս", "Հովհաննես", "Փիլիպպոս", "Բարթողիմեոս", "Թովմաս", "Մատթեոս", "Թադեոս",
  "Սիմոն", "Հուդա Իսկարիովտացի", "Մաթաթիա", "Պողոս", "Բառնաբաս", "Ղուկաս", "Մարկոս", "Ղազարոս", "Մարթա", "Մարիամ Մագդաղենացի",
  "Նիկոդեմոս", "Զաքեոս", "Ստեփանոս", "Փիլիմոն", "Տիմոթեոս", "Տիտոս", "Սիլաս", "Լիդիա", "Ապողոս", "Ակյուղաս",
  "Պրիսկիղա", "Կոռնելիոս", "Փիղատոս", "Հերովդես", "Կայիափա", "Աննա քահանայապետ", "Բարաբբա", "Գամաղիել", "Սիմեոն Ծերունի", "Աննա մարգարեուհի",
  "Նաթանայել", "Օնեսիմոս", "Եպաֆրաս",

  // --- PLACES ---
  "Եդեմ", "Արարատ", "Բաբելոն", "Ուր", "Քանան", "Սոդոմ", "Գոմոր", "Եգիպտոս", "Նեղոս", "Կարմիր ծով",
  "Սինա լեռ", "Քորեբ", "Անապատ", "Փարան", "Երիքով", "Գայ", "Բեթել", "Շիլո", "Հորդանան", "Երուսաղեմ",
  "Բեթղեհեմ", "Նազարեթ", "Կանա", "Կապառնաում", "Գալիլեա", "Տիբերիա", "Ձիթենյաց լեռ", "Գեթսեմանի", "Գողգոթա", "Էմմաուս",
  "Յոպպե", "Դամասկոս", "Անտիոք", "Եփեսոս", "Կորնթոս", "Փիլիպպե", "Թեսաղոնիկե", "Գաղատիա", "Կրետե", "Կիպրոս",
  "Պատմոս", "Հռոմ", "Տարսոն", "Մարսի բլուր", "Քեբրոն", "Սամարիա", "Կարմելոս լեռ", "Թաբոր լեռ", "Հերմոն լեռ", "Մեռյալ ծով",
  "Եփրատ", "Տիգրիս", "Խառան", "Գերար", "Բերսաբեե", "Սյուքեմ", "Գոսեն", "Մարա", "Ռափիդիմ", "Կադես-Բառնեա",
  "Նեբով լեռ", "Գալգալա", "Շուշան", "Նինվե", "Բեթանիա", "Բեթսայոդա", "Քորազին", "Նային", "Բեթփագե", "Կեդրոնի ձոր",
  "Հիննոմի ձոր", "Սիլովամի ավազան", "Բեթհեզդա", "Կեսարիա", "Տյուրոս", "Սիդոն", "Լյուստրա", "Դերբե", "Իկոնիոն", "Տրովադա",
  "Բերիա", "Աթենք", "Կոլոսիա", "Լաոդիկիա", "Զմյուռնիա", "Պերգամոն", "Թյուատիր", "Սարդիս", "Ֆիլադելֆիա", "Մալթա",

  // --- OBJECTS & NATURE ---
  "Տապան", "Աշտարակ", "Ծիածան", "Գավազան", "Մանանա", "Տասը պատվիրաններ", "Ուխտի տապանակ", "Խորան", "Տաճար", "Ոսկե հորթ",
  "Պարսատիկ", "Քնար", "Տավիղ", "Փող", "Թագ", "Գահ", "Աստվածաշունչ", "Ավետարան", "Խաչ", "Փշե պսակ",
  "Սկիհ", "Լվացարան", "Բուրվառ", "Խունկ", "Զմուռս", "Կնդրուկ", "Ոսկի", "Արծաթ", "Քար", "Կավ",
  "Ավազ", "Յուղ", "Օծության յուղ", "Մագաղաթ", "Կնիք", "Դենար", "Դրախմա", "Քանքար", "Լումա", "Պատմուճան",
  "Քուրձ", "Մոխիր", "Գոտի", "Սուր", "Վահան", "Սաղավարտ", "Զրահ", "Աշտանակ", "Առաջավորության հացեր", "Քավության կափարիչ",
  "Լանջապանական", "Ուրիմ և Թումիմ", "Սափոր", "Կշեռք", "Լուծ", "Մանգաղ", "Ցորեն", "Գարի", "Որոմ", "Թզենի",
  "Ձիթենի", "Որթատունկ", "Մայրի", "Հալվե", "Նարդոս", "Գառ", "Ոչխար", "Այծ", "Ցուլ", "Կով",
  "Առյուծ", "Արջ", "Գայլ", "Աղվես", "Օձ", "Կարիճ", "Մորեխ", "Աղավնի", "Արծիվ", "Աքաղաղ",
  "Ձուկ", "Ուղտ", "Էշ", "Ձի", "Եղևին", "Կաղնի", "Արմավենի", "Նռնենի", "Մրտենի", "Խնձորենի",
  "Զոպա", "Կասիա", "Կինամոն", "Մանանեխի հատիկ", "Եզ", "Ջորի", "Շուն", "Խոզ", "Վիշապ", "Կետ", "Ագռավ",

  // --- CONCEPTS & TERMS ---
  "Արարչագործություն", "Ջրհեղեղ", "Ելք", "Մարգարեություն", "Ավետում", "Ծնունդ", "Մկրտություն", "Փորձություն", "Հրաշք", "Առակ",
  "Քարոզ", "Վերջին ընթրիք", "Դավաճանություն", "Խաչելություն", "Հարություն", "Համբարձում", "Հոգեգալուստ", "Հայտնություն", "Դատաստան", "Փրկություն",
  "Քավություն", "Շնորհ", "Հավատք", "Սեր", "Հույս", "Խաղաղություն", "Ուրախություն", "Համբերություն", "Սրբություն", "Մեղք",
  "Ապաշխարություն", "Թողություն", "Օրհնություն", "Անեծք", "Աղոթք", "Պահք", "Ողորմություն", "Զոհաբերություն", "Պատարագ", "Երկնքի Արքայություն",
  "Դրախտ", "Դժոխք", "Հրեշտակ", "Դև", "Սատանա", "Կռապաշտություն", "Ուխտ", "Օրենք", "Շաբաթ", "Զատիկ",
  "Պենտեկոստե", "Տաղավարահարաց տոն", "Բարի Սամարացի", "Անառակ որդի", "Սերմնացան", "Տաղանդների առակը", "Տասը կույսերը", "Վերածնունդ", "Հավիտենական կյանք", "Սուրբ Հոգի",
  "Երրորդություն", "Ամեն", "Ալելուիա", "Ովսաննա", "Արդարացում", "Սրբացում", "Փառավորում", "Երկրորդ Գալուստ", "Վերջին Դատաստան", "Գեհեն",
  "Լիճ Կրակի", "Նոր Երուսաղեմ", "Քերովբե", "Սերովբե", "Մարտիրոսություն", "Նահատակություն", "Հալածանք", "Լեռան Քարոզ", "Երանիներ", "Տերունական Աղոթք",
  "Այլակերպություն", "Պայծառակերպություն", "Ոտնլվա", "Խորհրդավոր Ընթրիք", "Ղովտ", "Փարիսեցի", "Սադուկեցի", "Մաքսավոր", "Օրինական", "Դպիր",
  "Կեղծավոր", "Հեթանոս", "Ուխտադրժություն", "Պանդխտություն", "Գերություն", "Ավետյաց երկիր", "Կենաց ծառ", "Բարու և չարի գիտության ծառ", "Սողոմոնի տաճարը", "Վկայության խորան",
  "Անկյունաքար", "Լույս", "Աղ", "Ճշմարտություն", "Ճանապարհ", "Կյանք", "Հովիվ", "Հունձք", "Մատնություն", "Գանձանակ",
  "Տաղավար", "Անապատի ձայնը", "Գառն Աստծո", "Կենդանի ջուր", "Լույս աշխարհի", "Մեսիա", "Քրիստոս", "Օծյալ", "Մարգարե", "Առաքյալ",
  "Եպիսկոպոս", "Քահանայապետ", "Քահանա", "Ղևտացի", "Սարկավագ", "Երեց", "Հովվապետ", "Նազովրեցի", "Անտիքրիստ", "Բեելզեբուղ",
  "Աստծո Որդի", "Մարդու Որդի", "Տեր Աստված", "Ամենակալ", "Ալֆա և Օմեգա", "Սուրբ Սրբոց"
];

export default function Home() {
  // Game Flow States: 'SETUP' | 'READY' | 'PLAYING' | 'SUMMARY' | 'GAME_OVER'
  const [gameState, setGameState] = useState("SETUP");

  // Setup Options
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [duration, setDuration] = useState(60);
  const [targetScore, setTargetScore] = useState(30);

  // Scores & Turns
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isTeam1Turn, setIsTeam1Turn] = useState(true);
  const [winnerTeam, setWinnerTeam] = useState("");

  // Word Deck Management
  const [wordDeck, setWordDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");

  // Active Turn History: Array of { word: string, isCorrect: boolean }
  const [turnHistory, setTurnHistory] = useState([]);
  const [timerKey, setTimerKey] = useState(0);

  const durationOptions = [30, 60, 90];
  const targetOptions = [20, 30, 50];

  // Calculate correct points during current turn dynamically
  const currentTurnPoints = turnHistory.reduce(
    (acc, item) => (item.isCorrect ? acc + 1 : acc),
    0
  );

  // Start entire new game session
  const handleStartGame = () => {
    if (!team1.trim() || !team2.trim()) {
      alert("Խնդրում ենք մուտքագրել երկու թիմերի անունները:");
      return;
    }
    const shuffledDeck = shuffle(bibleWords);
    setWordDeck(shuffledDeck);
    setCurrentIndex(0);
    setCurrentWord(shuffledDeck[0]);
    setScore1(0);
    setScore2(0);
    setIsTeam1Turn(true);
    setGameState("READY");
  };

  // Start active turn timer
  const handleStartTurn = () => {
    setTurnHistory([]);
    setTimerKey((prev) => prev + 1);
    setGameState("PLAYING");
  };

  // Advance to next word during gameplay
  const handleNextWord = useCallback(
    (isCorrect) => {
      triggerHaptic();
      playSFX(isCorrect ? "correct" : "skip");

      setTurnHistory((prev) => [...prev, { word: currentWord, isCorrect }]);

      if (currentIndex >= wordDeck.length - 1) {
        const reshuffled = shuffle(bibleWords);
        setWordDeck(reshuffled);
        setCurrentIndex(0);
        setCurrentWord(reshuffled[0]);
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setCurrentWord(wordDeck[nextIdx]);
      }
    },
    [currentWord, currentIndex, wordDeck]
  );

  // Keyboard Shortcuts (Space / LeftArrow = Skip, Enter / RightArrow = Correct)
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowLeft") {
        e.preventDefault();
        handleNextWord(false);
      } else if (e.code === "Enter" || e.code === "ArrowRight") {
        e.preventDefault();
        handleNextWord(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleNextWord]);

  // When turn timer runs out
  const handleTimerComplete = () => {
    setGameState("SUMMARY");
    return { shouldRepeat: false };
  };

  // Toggle word result during Turn Summary review
  const toggleTurnWord = (index) => {
    triggerHaptic();
    setTurnHistory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isCorrect: !item.isCorrect } : item
      )
    );
  };

  // Confirm turn summary scores and check for winner
  const handleConfirmSummary = () => {
    let newScore1 = score1;
    let newScore2 = score2;

    if (isTeam1Turn) {
      newScore1 += currentTurnPoints;
      setScore1(newScore1);
    } else {
      newScore2 += currentTurnPoints;
      setScore2(newScore2);
    }

    // Check Win Condition
    if (newScore1 >= targetScore) {
      setWinnerTeam(team1);
      playSFX("win");
      setGameState("GAME_OVER");
    } else if (newScore2 >= targetScore) {
      setWinnerTeam(team2);
      playSFX("win");
      setGameState("GAME_OVER");
    } else {
      setIsTeam1Turn(!isTeam1Turn);
      setGameState("READY");
    }
  };

  const currentTeamName = isTeam1Turn ? team1 : team2;

  return (
    <div className={styles.container}>
      {/* --- 1. SETUP SCREEN --- */}
      {gameState === "SETUP" && (
        <div className={styles.card}>
          <h1 className={styles.title}>Բառաշունչ</h1>
          <p className={styles.subtitle}>Աստվածաշնչյան Alias</p>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Թիմ 1</label>
            <input
              type="text"
              placeholder="Օրինակ՝ Արարատ"
              className={styles.input}
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
            />

            <label className={styles.label}>Թիմ 2</label>
            <input
              type="text"
              placeholder="Օրինակ՝ Սիոն"
              className={styles.input}
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
            />
          </div>

          <div className={styles.optionSection}>
            <p className={styles.label}>Փուլի տևողությունը</p>
            <div className={styles.buttonGroup}>
              {durationOptions.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  className={`${styles.optionBtn} ${
                    duration === sec ? styles.selectedOption : ""
                  }`}
                  onClick={() => setDuration(sec)}
                >
                  {sec} վրկ
                </button>
              ))}
            </div>
          </div>

          <div className={styles.optionSection}>
            <p className={styles.label}>Հաղթելու միավորը</p>
            <div className={styles.buttonGroup}>
              {targetOptions.map((pts) => (
                <button
                  key={pts}
                  type="button"
                  className={`${styles.optionBtn} ${
                    targetScore === pts ? styles.selectedOption : ""
                  }`}
                  onClick={() => setTargetScore(pts)}
                >
                  {pts} միավոր
                </button>
              ))}
            </div>
          </div>

          <button className={styles.primaryButton} onClick={handleStartGame}>
            <FaPlay size={14} /> Սկսել Խաղը
          </button>
        </div>
      )}

      {/* --- 2. READY PREVIEW SCREEN --- */}
      {gameState === "READY" && (
        <div className={styles.card}>
          <div className={styles.readyHeader}>
            <FaTrophy size={56} className={styles.trophyIcon} />
            <span className={styles.turnBadge}>Հերթը պատկանում է</span>
            <h1 className={styles.activeTeamTitle}>{currentTeamName}</h1>
          </div>

          <div className={styles.scoreOverview}>
            <div
              className={`${styles.scorePill} ${
                isTeam1Turn ? styles.activePill : ""
              }`}
            >
              <span>{team1}</span>
              <strong>{score1}</strong>
            </div>
            <div
              className={`${styles.scorePill} ${
                !isTeam1Turn ? styles.activePill : ""
              }`}
            >
              <span>{team2}</span>
              <strong>{score2}</strong>
            </div>
          </div>

          <p className={styles.targetHint}>
            Նպատակ՝ առաջինը հավաքել <strong>{targetScore}</strong> միավոր
          </p>

          <button className={styles.primaryButton} onClick={handleStartTurn}>
            <FaPlay size={14} /> Սկսել Փուլը
          </button>
        </div>
      )}

      {/* --- 3. ACTIVE GAMEPLAY SCREEN --- */}
      {gameState === "PLAYING" && (
        <div className={styles.gameContainer}>
          <div className={styles.topBar}>
            <div className={styles.scoreBoard}>
              <div
                className={`${styles.scoreBox} ${
                  isTeam1Turn ? styles.activeScoreBox : ""
                }`}
              >
                <small>{team1}</small>
                <span>
                  {score1 + (isTeam1Turn ? currentTurnPoints : 0)}
                  {isTeam1Turn && currentTurnPoints > 0 && (
                    <small className={styles.turnIncrement}>
                      (+{currentTurnPoints})
                    </small>
                  )}
                </span>
              </div>

              <div
                className={`${styles.scoreBox} ${
                  !isTeam1Turn ? styles.activeScoreBox : ""
                }`}
              >
                <small>{team2}</small>
                <span>
                  {score2 + (!isTeam1Turn ? currentTurnPoints : 0)}
                  {!isTeam1Turn && currentTurnPoints > 0 && (
                    <small className={styles.turnIncrement}>
                      (+{currentTurnPoints})
                    </small>
                  )}
                </span>
              </div>
            </div>

            <div className={styles.timerWrapper}>
              <CountdownCircleTimer
                key={timerKey}
                isPlaying={true}
                duration={duration}
                size={76}
                strokeWidth={6}
                colors={["#22c55e", "#eab308", "#ef4444"]}
                colorsTime={[duration, duration / 2, 0]}
                onComplete={handleTimerComplete}
                trailColor="rgba(255, 255, 255, 0.1)"
              >
                {({ remainingTime }) => (
                  <span className={styles.timerText}>{remainingTime}</span>
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
              onClick={() => handleNextWord(false)}
            >
              <FaTimes /> Բաց թողնել
            </button>

            <button
              className={styles.correctButton}
              onClick={() => handleNextWord(true)}
            >
              <FaCheck /> Ճիշտ է
            </button>
          </div>

          <div className={styles.keyboardHint}>
            <FaKeyboard /> Ստեղնաշար՝ [Space/←] Բաց թողնել | [Enter/→] Ճիշտ է
          </div>
        </div>
      )}

      {/* --- 4. TURN SUMMARY & DISPUTE REVIEW --- */}
      {gameState === "SUMMARY" && (
        <div className={styles.card}>
          <h2 className={styles.summaryTitle}>Փուլի Ամփոփում</h2>
          <p className={styles.subtitle}>{currentTeamName} - վերանայեք բառերը</p>

          <div className={styles.wordList}>
            {turnHistory.length === 0 ? (
              <p className={styles.emptyText}>Ոչ մի բառ չի գուշակվել</p>
            ) : (
              turnHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`${styles.wordListItem} ${
                    item.isCorrect ? styles.itemCorrect : styles.itemSkipped
                  }`}
                  onClick={() => toggleTurnWord(idx)}
                >
                  <span>{item.word}</span>
                  <button className={styles.toggleBtn}>
                    {item.isCorrect ? (
                      <FaCheckCircle color="#22c55e" size={20} />
                    ) : (
                      <FaTimesCircle color="#ef4444" size={20} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.summaryFooter}>
            <p>
              Փուլի միավորները՝ <strong>+{currentTurnPoints}</strong>
            </p>
            <button
              className={styles.primaryButton}
              onClick={handleConfirmSummary}
            >
              Հաստատել & Շարունակել
            </button>
          </div>
        </div>
      )}

      {/* --- 5. GAME OVER & WINNER SCREEN --- */}
      {gameState === "GAME_OVER" && (
        <div className={styles.card}>
          <div className={styles.readyHeader}>
            <FaTrophy size={80} className={styles.winTrophy} />
            <span className={styles.turnBadge}>Հաղթող Թիմ</span>
            <h1 className={styles.winnerTitle}>{winnerTeam}</h1>
          </div>

          <div className={styles.finalScoreBox}>
            <p>Վերջնական հաշիվ</p>
            <h3>
              {team1}: {score1} | {team2}: {score2}
            </h3>
          </div>

          <button
            className={styles.primaryButton}
            onClick={() => setGameState("SETUP")}
          >
            <FaRedo size={14} /> Նոր Խաղ
          </button>
        </div>
      )}
    </div>
  );
}