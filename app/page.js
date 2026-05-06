"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { FaCheck, FaTimes, FaTrophy } from "react-icons/fa";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
const bibleWords = [
  // Old Testament Figures (Հնակտակարանյան կերպարներ)
  "Ադամ",
  "Եվա",
  "Կայեն",
  "Աբել",
  "Նոյ",
  "Աբրահամ",
  "Սառա",
  "Իսահակ",
  "Ռեբեկա",
  "Հակոբ",
  "Ռաքել",
  "Հովսեփ",
  "Մովսես",
  "Ահարոն",
  "Մարիամ",
  "Հեսու",
  "Գեդեոն",
  "Սամսոն",
  "Դալիլա",
  "Հռութ",
  "Սամուել",
  "Սավուղ",
  "Դավիթ",
  "Գոլիաթ",
  "Հովնաթան",
  "Բերսաբե",
  "Սողոմոն",
  "Եղիա",
  "Եղիսե",
  "Եսայի",
  "Երեմիա",
  "Դանիել",
  "Հոբ",
  "Հովնան",

  // New Testament Figures (Նորկտակարանյան կերպարներ)
  "Մարիամ Աստվածածին",
  "Հովսեփ",
  "Հովհաննես Մկրտիչ",
  "Պետրոս",
  "Անդրեաս",
  "Հովհաննես",
  "Հակոբոս",
  "Փիլիպպոս",
  "Թովմաս",
  "Մատթեոս",
  "Հուդա Իսկարիովտացի",
  "Պողոս Առաքյալ",
  "Ղուկաս",
  "Մարկոս",
  "Ղազարոս",
  "Մարթա",
  "Մարիամ Մագդաղենացի",
  "Նիկոդեմոս",
  "Զաքեոս",
  "Ստեփանոս",
  "Կոռնելիոս",
  "Տիմոթեոս",
  "Փիղատոս",
  "Վառաբբա",

  // Places (Վայրեր)
  "Եդեմ",
  "Արարատ լեռ",
  "Բաբելոն",
  "Ուր",
  "Քանան",
  "Սոդոմ",
  "Գոմոր",
  "Եգիպտոս",
  "Կարմիր ծով",
  "Սինա լեռ",
  "Քորեբ",
  "Երիքով",
  "Բեթղեհեմ",
  "Նազարեթ",
  "Կանա",
  "Երուսաղեմ",
  "Հորդանան",
  "Գալիլեա",
  "Կապառնաում",
  "Տիբերիա",
  "Ձիթենյաց լեռ",
  "Գեթսեմանի",
  "Գողգոթա",
  "Դամասկոս",
  "Անտիոք",
  "Հռոմ",
  "Պատմոս",

  // Objects & Symbols (Իրեր և Խորհրդանիշներ)
  "Նոյյան Տապան",
  "Բաբելոնի աշտարակ",
  "Ծիածան",
  "Տասը պատվիրաններ",
  "Ուխտի տապանակ",
  "Մանանա",
  "Գավազան",
  "Տաճար",
  "Խորան",
  "Ոսկե հորթ",
  "Աստվածաշունչ",
  "Ավետարան",
  "Խաչ",
  "Փշե պսակ",
  "Սկիհ",
  "Արծաթի կտոր",
  "Սուրբ Հոգի",
  "Հրեշտակ",
  "Դև",

  // Events & Concepts (Իրադարձություններ և Հասկացություններ)
  "Արարչագործություն",
  "Ջրհեղեղ",
  "Ելք",
  "Մարգարեություն",
  "Ավետում",
  "Ծնունդ",
  "Մկրտություն",
  "Փորձություն",
  "Լեռան քարոզ",
  "Առակ",
  "Հրաշք",
  "Վերջին ընթրիք",
  "Դավաճանություն",
  "Խաչելություն",
  "Հարություն",
  "Համբարձում",
  "Հոգեգալուստ",
  "Հայտնություն",
  "Դրախտ",
  "Դժոխք",
  "Հավատք",
  "Սեր",
  "Հույս",
  "Շնորհ",
  "Մեղք",
  "Ապաշխարություն",
  "Օրհնություն",
  "Աղոթք",
  "Պահք",
  "Ողորմություն",
  "Երկնքի Արքայություն",
];
export default function Home() {
  const [start, setStart] = useState(false);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [time, setTime] = useState(30);
  const [startTimer, setStartTimer] = useState(false);
  const [remTime, setRemTime] = useState(time);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // word management

  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [isTeam1Turn, setIsTeam1Turn] = useState(true);

  const getRandomWord = () => {
    const avaliableWords = bibleWords.filter(
      (word) => !usedWords.includes(word),
    );

    if (avaliableWords.length === 0) {
      setUsedWords([]);
      return bibleWords[Math.floor(Math.random() * bibleWords.length)];
    }

    const randomIndex = Math.floor(Math.random() * avaliableWords.length);
    return avaliableWords[randomIndex];
  };

  const handleNextWord = (isCorrect) => {
    if (isCorrect) {
      if (isTeam1Turn) setScore1((prev) => prev + 1);
      else setScore2((prev) => prev + 1);
    }

    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setUsedWords((prev) => [...prev, newWord]);
  };

  useEffect(() => {
    if (startTimer) {
      const firstWord = getRandomWord();
      setCurrentWord(firstWord);
      setUsedWords([firstWord]);
    }
  }, [startTimer]);

  const handleTimerComplete = () => {
    setStartTimer(false);
    setIsTeam1Turn(!isTeam1Turn);
    alert("Ժամանակը լրացավ!");
    return { shouldRepeat: false };
  };

  // for styles
  const [selectedId, setSelectedId] = useState(null);
  const buttons = [
    { id: 1, label: "30 վրկ" },
    { id: 2, label: "60 վրկ" },
    { id: 3, label: "90 վրկ" },
  ];

  function handleStart() {
    if (!team1 || !team2) {
      alert("Խնդրում ենք մուտքագրել երկու թիմի անունները");
      return;
    }
    setStart(true);
  }
  function handleTimerStart() {}
  return (
    <>
      {!start ? (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>Բառաշունչ</h1>
            <div className={styles.card}>
              <p>Թիմի անուններ</p>
              <div className={styles.inputs}>
                <label>Թիմ 1</label>
                <input
                  type="text"
                  placeholder="Թիմ 1 անվանում"
                  className={styles.teamName}
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                />
                <label>Թիմ 2</label>
                <input
                  type="text"
                  placeholder="Թիմ 2 անվանում"
                  className={styles.teamName}
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                />
              </div>
              <p>Ժամանակ</p>
              <div className={styles.buttons}>
                {buttons.map((button) => (
                  <button
                    key={button.id}
                    className={`${styles.timeButton} ${
                      selectedId === button.id ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setSelectedId(button.id);
                      setTime(button.id * 30);
                    }}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
              <hr />
              <button
                className={styles.startButton}
                onClick={() => handleStart()}
              >
                Սկսել խաղը
              </button>
            </div>
          </div>
        </div>
      ) : !startTimer ? (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.gameStartPreview}>
              <FaTrophy size={100} color="#FFD700" />
              <h1>{team1}</h1>
              <button
                className={styles.startButton}
                onClick={() => setStartTimer(true)}
              >
                Սկսել Խաղը
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.scoreBoard}>
            <div className={styles.teamScore}>
              <h2 className={isTeam1Turn ? styles.activeTeam : ""}>
                {team1}: {score1}
              </h2>
              <h2 className={!isTeam1Turn ? styles.activeTeam : ""}>
                {team2}: {score2}
              </h2>
            </div>

            <CountdownCircleTimer
              isPlaying={startTimer}
              duration={time}
              size={100}
              colors={["#004777", "#F7B801", "#A30000"]}
              colorsTime={[time, time / 2, 0]}
              onComplete={handleTimerComplete}
            >
              {({ remainingTime }) => (
                <div className={styles.timerText}>{remainingTime}</div>
              )}
            </CountdownCircleTimer>
          </div>

          <div className={styles.gamePlay}>
            <div className={styles.wordCard}>
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
          </div>
        </div>
      )}
    </>
  );
}
