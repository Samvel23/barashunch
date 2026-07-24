import { bibleWords } from "./words";
import { shuffle } from "./sfx";

// gameState machine: SETUP -> READY -> PLAYING -> SUMMARY -> (READY | GAME_OVER)
export const initialState = {
  gameState: "SETUP",
  team1: "",
  team2: "",
  duration: 60,
  targetScore: 30,
  score1: 0,
  score2: 0,
  isTeam1Turn: true,
  winnerTeam: "",
  wordDeck: [],
  currentIndex: 0,
  currentWord: "",
  turnHistory: [],
  timerKey: 0,
};

export function gameReducer(state, action) {
  switch (action.type) {
    case "SET_TEAM1":
      return { ...state, team1: action.payload };

    case "SET_TEAM2":
      return { ...state, team2: action.payload };

    case "SET_DURATION":
      return { ...state, duration: action.payload };

    case "SET_TARGET_SCORE":
      return { ...state, targetScore: action.payload };

    case "START_GAME": {
      const deck = shuffle(bibleWords);
      return {
        ...state,
        wordDeck: deck,
        currentIndex: 0,
        currentWord: deck[0],
        score1: 0,
        score2: 0,
        isTeam1Turn: true,
        gameState: "READY",
      };
    }

    case "START_TURN":
      return {
        ...state,
        turnHistory: [],
        timerKey: state.timerKey + 1,
        gameState: "PLAYING",
      };

    case "NEXT_WORD": {
      const { isCorrect } = action.payload;
      const turnHistory = [...state.turnHistory, { word: state.currentWord, isCorrect }];

      let wordDeck = state.wordDeck;
      let currentIndex = state.currentIndex;
      if (currentIndex >= wordDeck.length - 1) {
        wordDeck = shuffle(bibleWords);
        currentIndex = 0;
      } else {
        currentIndex += 1;
      }

      return {
        ...state,
        turnHistory,
        wordDeck,
        currentIndex,
        currentWord: wordDeck[currentIndex],
      };
    }

    case "TIMER_COMPLETE":
      return { ...state, gameState: "SUMMARY" };

    case "TOGGLE_WORD": {
      const turnHistory = state.turnHistory.map((item, i) =>
        i === action.payload ? { ...item, isCorrect: !item.isCorrect } : item
      );
      return { ...state, turnHistory };
    }

    case "CONFIRM_SUMMARY": {
      const points = state.turnHistory.reduce(
        (acc, item) => (item.isCorrect ? acc + 1 : acc),
        0
      );
      const score1 = state.isTeam1Turn ? state.score1 + points : state.score1;
      const score2 = !state.isTeam1Turn ? state.score2 + points : state.score2;

      if (score1 >= state.targetScore) {
        return { ...state, score1, winnerTeam: state.team1, gameState: "GAME_OVER" };
      }
      if (score2 >= state.targetScore) {
        return { ...state, score2, winnerTeam: state.team2, gameState: "GAME_OVER" };
      }
      return {
        ...state,
        score1,
        score2,
        isTeam1Turn: !state.isTeam1Turn,
        gameState: "READY",
      };
    }

    // Keep team names + settings for an easy rematch, reset everything else.
    case "RESET":
      return {
        ...initialState,
        team1: state.team1,
        team2: state.team2,
        duration: state.duration,
        targetScore: state.targetScore,
      };

    default:
      return state;
  }
}