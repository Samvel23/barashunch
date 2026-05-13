"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { FaCheck, FaTimes, FaTrophy } from "react-icons/fa";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
const bibleWords = [
  // --- FIGURES (Characters) ---
  "Ադամ",
  "Եվա",
  "Կայեն",
  "Աբել",
  "Սեթ",
  "Ենովք",
  "Մաթուսաղա",
  "Նոյ",
  "Սեմ",
  "Քամ",
  "Հաբեթ",
  "Աբրահամ",
  "Սառա",
  "Հագար",
  "Իսմայել",
  "Իսահակ",
  "Ռեբեկա",
  "Եսավ",
  "Հակոբ",
  "Ռաքել",
  "Լիա",
  "Հովսեփ",
  "Բենիամին",
  "Ռուբեն",
  "Հուդա",
  "Լևի",
  "Փարավոն",
  "Մովսես",
  "Ահարոն",
  "Մարիամ",
  "Հեսու",
  "Քաղեբ",
  "Ռախաբ",
  "Գեդեոն",
  "Աբիմելեք",
  "Սամսոն",
  "Դալիլա",
  "Հռութ",
  "Նոեմի",
  "Բոոս",
  "Սամուել",
  "Հեղի",
  "Աննա",
  "Սավուղ",
  "Դավիթ",
  "Գոլիաթ",
  "Հովնաթան",
  "Բերսաբե",
  "Աբիսողոմ",
  "Սողոմոն",
  "Սաբայի թագուհի",
  "Ռոբովամ",
  "Հերոբովամ",
  "Եղիա",
  "Եղիսե",
  "Հեզաբել",
  "Աքաաբ",
  "Եսայի",
  "Երեմիա",
  "Եզեկիել",
  "Դանիել",
  "Ովսեե",
  "Հովել",
  "Ամովս",
  "Աբդիու",
  "Հովնան",
  "Միքիա",
  "Նավում",
  "Ամբակում",
  "Սոփոնիա",
  "Անգե",
  "Զաքարիա",
  "Մաղաքիա",
  "Եզրաս",
  "Նեեմիա",
  "Եսթեր",
  "Մուրթքե",
  "Համան",
  "Հոբ",
  "Շադրաք",
  "Մեսաք",
  "Աբեդնագով",
  "Մելքիսեդեկ",
  "Մարիամ Աստվածածին",
  "Հովսեփ",
  "Հովհաննես Մկրտիչ",
  "Զաքարիա",
  "Եղիսաբեթ",
  "Գաբրիել",
  "Պետրոս",
  "Անդրեաս",
  "Հակոբոս",
  "Հովհաննես",
  "Փիլիպպոս",
  "Բարթողիմեոս",
  "Թովմաս",
  "Մատթեոս",
  "Թադեոս",
  "Սիմոն",
  "Հուդա Իսկարիովտացի",
  "Մաթաթիա",
  "Պողոս",
  "Բառնաբաս",
  "Ղուկաս",
  "Մարկոս",
  "Ղազարոս",
  "Մարթա",
  "Մարիամ Մագդաղենացի",
  "Նիկոդեմոս",
  "Զաքեոս",
  "Ստեփանոս",
  "Փիլիմոն",
  "Տիմոթեոս",
  "Տիտոս",
  "Սիլաս",
  "Լիդիա",
  "Ապողոս",
  "Ակյուղաս",
  "Պրիսկիղա",
  "Կոռնելիոս",
  "Փիղատոս",
  "Հերովդես",
  "Կայիափա",
  "Բարաբբա",
  "Միքայել Հրեշտակապետ",
  "Գամաղիել",

  // --- PLACES (Locations) ---
  "Եդեմ",
  "Արարատ",
  "Բաբելոն",
  "Ուր",
  "Քանան",
  "Սոդոմ",
  "Գոմոր",
  "Եգիպտոս",
  "Նեղոս",
  "Կարմիր ծով",
  "Սինա լեռ",
  "Քորեբ",
  "Անապատ",
  "Փարան",
  "Երիքով",
  "Գայ",
  "Բեթել",
  "Շիլո",
  "Հորդանան",
  "Երուսաղեմ",
  "Բեթղեհեմ",
  "Նազարեթ",
  "Կանա",
  "Կապառնաում",
  "Գալիլեա",
  "Տիբերիա",
  "Ձիթենյաց լեռ",
  "Գեթսեմանի",
  "Գողգոթա",
  "Էմմաուս",
  "Յոպպե",
  "Դամասկոս",
  "Անտիոք",
  "Եփեսոս",
  "Կորնթոս",
  "Փիլիպպե",
  "Թեսաղոնիկե",
  "Գաղատիա",
  "Կրետե",
  "Կիպրոս",
  "Պատմոս",
  "Հռոմ",
  "Տարսոն",
  "Մարսի բլուր",
  "Քեբրոն",
  "Սամարիա",
  "Կարմելոս լեռ",
  "Թաբոր լեռ",
  "Հերմոն լեռ",
  "Մեռյալ ծով",
  "Եփրատ",
  "Տիգրիս",

  // --- OBJECTS & NATURE (Items, Plants, Animals) ---
  "Տապան",
  "Աշտարակ",
  "Ծիածան",
  "Գավազան",
  "Մանանա",
  "Տասը պատվիրաններ",
  "Ուխտի տապանակ",
  "Խորան",
  "Տաճար",
  "Ոսկե հորթ",
  "Պարսատիկ",
  "Քնար",
  "Տավիղ",
  "Փող",
  "Թագ",
  "Գահ",
  "Աստվածաշունչ",
  "Ավետարան",
  "Խաչ",
  "Փշե պսակ",
  "Սկիհ",
  "Լվացարան",
  "Բուրվառ",
  "Խունկ",
  "Զմուռս",
  "Կնդրուկ",
  "Ոսկի",
  "Արծաթ",
  "Քար",
  "Կավ",
  "Ավազ",
  "Ցորեն",
  "Գարի",
  "Որոմ",
  "Թզենի",
  "Ձիթենի",
  "Որթատունկ",
  "Մայրի",
  "Հալվե",
  "Նարդոս",
  "Գառ",
  "Ոչխար",
  "Այծ",
  "Ցուլ",
  "Կով",
  "Առյուծ",
  "Արջ",
  "Գայլ",
  "Աղվես",
  "Օձ",
  "Կարիճ",
  "Մորեխ",
  "Աղավնի",
  "Արծիվ",
  "Աքաղաղ",
  "Ձուկ",
  "Ուղտ",
  "Էշ",
  "Ձի",

  // --- CONCEPTS & EVENTS (Theology & Stories) ---
  "Արարչագործություն",
  "Ջրհեղեղ",
  "Ելք",
  "Մարգարեություն",
  "Ավետում",
  "Ծնունդ",
  "Մկրտություն",
  "Փորձություն",
  "Հրաշք",
  "Առակ",
  "Քարոզ",
  "Վերջին ընթրիք",
  "Դավաճանություն",
  "Խաչելություն",
  "Հարություն",
  "Համբարձում",
  "Հոգեգալուստ",
  "Հայտնություն",
  "Դատաստան",
  "Փրկություն",
  "Քավություն",
  "Շնորհ",
  "Հավատք",
  "Սեր",
  "Հույս",
  "Խաղաղություն",
  "Ուրախություն",
  "Համբերություն",
  "Սրբություն",
  "Մեղք",
  "Ապաշխարություն",
  "Թողություն",
  "Օրհնություն",
  "Անեծք",
  "Աղոթք",
  "Պահք",
  "Ողորմություն",
  "Զոհաբերություն",
  "Պատարագ",
  "Երկնքի Արքայություն",
  "Դրախտ",
  "Դժոխք",
  "Հրեշտակ",
  "Դև",
  "Սատանա",
  "Կռապաշտություն",
  "Ուխտ",
  "Օրենք",
  "Շաբաթ",
  "Զատիկ",
  "Պենտեկոստե",
  "Տաղավարահարաց տոն",
  "Բարի Սամարացի",
  "Անառակ որդի",
  "Սերմնացան",
  "Տաղանդների առակը",
  "Տասը կույսերը",
  "Վերածնունդ",
  "Հավիտենական կյանք",
  "Սուրբ Հոգի",
  "Երրորդություն",
  "Ամեն",
  "Ալելուիա",
  "Ովսաննա",

  // --- HARDER/SPECIFIC TERMS ---
  "Մանասե",
  "Եփրեմ",
  "Բեն-Հադադ",
  "Ղովտ",
  "Կյուրոս",
  "Դարեհ",
  "Քսերքսես",
  "Գամաղիել",
  "Փարիսեցի",
  "Սադուկեցի",
  "Մաքսավոր",
  "Օրինական",
  "Դպիր",
  "Կեղծավոր",
  "Հեթանոս",
  "Ուխտադրժություն",
  "Պանդխտություն",
  "Գերություն",
  "Ավետյաց երկիր",
  "Կենաց ծառ",
  "Բարու և չարի գիտության ծառ",
  "Կայեն",
  "Սողոմոնի տաճարը",
  "Վկայության խորան",
  "Անկյունաքար",
  "Լույս",
  "Աղ",
  "Ճշմարտություն",
  "Ճանապարհ",
  "Կյանք",
  "Հովիվ",
  "Հունձք",
  "Մատնություն",
  "Գանձանակ",
  "Տաղավար",
  "Այլակերպություն",
  "Անապատի ձայնը",
  "Գառն Աստծո",
  "Կենդանի ջուր",
  "Լույս աշխարհի",
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
  const [wordDeck, setWordDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    // Update scores
    if (isCorrect) {
      if (isTeam1Turn) setScore1((prev) => prev + 1);
      else setScore2((prev) => prev + 1);
    }

    // Check if we reached the end of the deck
    if (currentIndex >= wordDeck.length - 1) {
      const reshuffled = shuffle(bibleWords);
      setWordDeck(reshuffled);
      setCurrentIndex(0);
      setCurrentWord(reshuffled[0]);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentWord(wordDeck[nextIndex]);
    }
  };

  useEffect(() => {
    if (start) {
      setWordDeck(shuffle(bibleWords));
      setCurrentIndex(0);
    }
  }, [start]);

  const handleTimerComplete = () => {
    setStartTimer(false);
    setIsTeam1Turn(!isTeam1Turn);
    alert("Ժամանակը լրացավ!");
    return { shouldRepeat: false };
  };
  useEffect(() => {
    if (startTimer && wordDeck.length > 0) {
      setCurrentWord(wordDeck[currentIndex]);
    }
  }, [startTimer, wordDeck]);

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
              trailColor="#d9d9d9"
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
