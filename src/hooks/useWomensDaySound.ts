import { useCallback, useEffect, useRef } from 'react';
import type { ActionKind } from './useWomensDayEffects';
type Note = readonly [frequency: number, offset: number, duration: number];
const notes: Record<ActionKind, readonly Note[]> = {
  bouquet: [[659, 0, .28], [831, .14, .28], [988, .28, .32]],
  compliment: [[880, 0, .16], [1175, .12, .18]],
  photo: [[440, 0, .12]],
  bot: [[523, 0, .10], [659, .10, .10], [784, .20, .18]],
};
export function useWomensDaySound() {
  const context = useRef<AudioContext | null>(null);
  const voices = useRef(new Map<OscillatorNode, GainNode>());
  const generation = useRef(0);
  const alive = useRef(true);
  const stop = useCallback(() => {
    generation.current += 1;
    for (const [voice, gain] of voices.current) {
      voice.onended = null;
      try { voice.stop(); } catch { /* A finished voice is already stopped. */ }
      voice.disconnect(); gain.disconnect();
    }
    voices.current.clear();
  }, []);
  useEffect(() => {
    alive.current = true;
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      alive.current = false; stop();
      document.removeEventListener('visibilitychange', visibility);
      const old = context.current; context.current = null;
      if (old && old.state !== 'closed') void old.close().catch(() => {});
    };
  }, [stop]);
  const play = useCallback((kind: ActionKind | null) => {
    stop();
    if (!kind || document.hidden || !alive.current) return;
    const token = generation.current;
    const gestureAt = performance.now();
    try {
      const Audio = window.AudioContext;
      if (!Audio) return;
      const audio = context.current ??= new Audio();
      const schedule = () => {
        if (!alive.current || token !== generation.current || document.hidden || audio.state !== 'running'
          || performance.now() - gestureAt > 180) return;
        const start = audio.currentTime + .01;
        for (const [frequency, offset, duration] of notes[kind]) {
          const oscillator = audio.createOscillator(); const gain = audio.createGain();
          const at = start + offset;
          oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, at);
          if (kind === 'photo') oscillator.frequency.exponentialRampToValueAtTime(220, at + duration);
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(.025, at + .012);
          gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
          oscillator.connect(gain); gain.connect(audio.destination);
          voices.current.set(oscillator, gain);
          oscillator.onended = () => { voices.current.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
          oscillator.start(at); oscillator.stop(at + duration + .01);
        }
      };
      if (audio.state === 'running') schedule();
      else void audio.resume().then(schedule).catch(() => {});
    } catch { stop(); }
  }, [stop]);
  return { play };
}
