// Small, dependency-free audio + haptics + shuffle helpers.
// Kept separate from UI components so they can be unit-tested and reused.

/** Fisher–Yates shuffle. Returns a new array, never mutates the input. */
export const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Short vibration for correct/skip feedback on supported devices. */
export const triggerHaptic = (pattern = 35) => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Reuse a single AudioContext instead of creating a new one per sound
// effect. Browsers cap the number of live contexts and repeatedly
// constructing/discarding them is wasted work and can trigger warnings.
let sharedAudioCtx = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    sharedAudioCtx = new AudioCtx();
  }
  // Some browsers suspend the context until a user gesture resumes it.
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

const playTone = (ctx, { frequency, type = "sine", start = 0, duration = 0.2, gain = 0.25 }) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime + start);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
  return osc;
};

/** Plays one of: "correct" | "skip" | "win". Fails silently if audio is unavailable. */
export const playSFX = (type) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (type === "correct") {
      const osc = playTone(ctx, { frequency: 523.25, duration: 0.2 });
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
    } else if (type === "skip") {
      const osc = playTone(ctx, { frequency: 220, type: "sawtooth", duration: 0.18, gain: 0.2 });
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
    } else if (type === "win") {
      [261.63, 329.63, 392.0, 523.25].forEach((frequency, idx) => {
        playTone(ctx, { frequency, start: idx * 0.1, duration: 0.3, gain: 0.2 });
      });
    }
  } catch {
    // Sound is a nice-to-have; never let it break gameplay.
  }
};