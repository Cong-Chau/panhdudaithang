import { useEffect, useRef } from 'react';

export type SoundEffect = 'cheer' | 'yay' | 'trophy' | 'bot';
type Note = { frequency: number; at: number; duration: number; volume: number; type?: OscillatorType; endFrequency?: number };
const sounds: Record<Exclude<SoundEffect, 'yay' | 'cheer'>, Note[]> = {
  trophy: [{ frequency: 1047, at: 0, duration: .35, volume: .07 }, { frequency: 1568, at: .1, duration: .4, volume: .045 }],
  bot: [440, 880, 660, 1320].map((frequency, i) => ({ frequency, at: i * .085, duration: .09, volume: .06, type: 'square', endFrequency: frequency * 1.1 })),
};

// Short effects, including a local Yay voice clip; no loops or autoplay.
export function useSoundEffects() {
  const context = useRef<AudioContext | null>(null);
  const yay = useRef<HTMLAudioElement | null>(null);
  const celebrationClip = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const voices = useRef(new Map<OscillatorNode, GainNode>());
  const mounted = useRef(true);

  function stop() {
    generation.current += 1;
    for (const clip of [yay.current, celebrationClip.current]) {
      if (clip) { clip.pause(); clip.currentTime = 0; }
    }
    for (const [voice, envelope] of voices.current) { voice.onended = null; try { voice.stop(); } catch { /* Already stopped. */ } voice.disconnect(); envelope.disconnect(); }
    voices.current.clear();
  }

  function schedule(effect: Exclude<SoundEffect, 'yay' | 'cheer'>, audio: AudioContext) {
    const start = audio.currentTime + .015;
    for (const note of sounds[effect]) {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      const at = start + note.at;
      oscillator.type = note.type ?? 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, at);
      if (note.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, at + note.duration);
      envelope.gain.setValueAtTime(0, at);
      envelope.gain.linearRampToValueAtTime(note.volume, at + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, at + note.duration);
      oscillator.connect(envelope); envelope.connect(audio.destination);
      voices.current.set(oscillator, envelope);
      oscillator.onended = () => { voices.current.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
      oscillator.start(at); oscillator.stop(at + note.duration + .02);
    }
  }

  function createClip(filename: string) {
    const clip = new Audio(`${import.meta.env.BASE_URL}sounds/${filename}`);
    clip.preload = 'auto';
    clip.volume = .55;
    clip.loop = false;
    return clip;
  }

  function play(effect: SoundEffect) {
    if (document.hidden) return;
    // Replace the previous effect so rapid taps never stack loud sounds.
    stop();
    const currentGeneration = generation.current;
    try {
      if (effect === 'yay' || effect === 'cheer') {
        // Create and play the requested clip in the very first button gesture.
        const ref = effect === 'yay' ? yay : celebrationClip;
        ref.current ??= createClip(effect === 'yay' ? 'yay-kids.mp3' : 'celebration.mp3');
        void ref.current.play().catch(() => {
          if (mounted.current && currentGeneration === generation.current) stop();
        });
        return;
      }
      const AudioConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioConstructor) return;
      const audio = context.current ??= new AudioConstructor();
      void audio.resume().then(() => {
        if (mounted.current && !document.hidden && currentGeneration === generation.current) schedule(effect, audio);
      }).catch(() => { if (mounted.current && currentGeneration === generation.current) stop(); });
    } catch { stop(); }
  }

  useEffect(() => {
    mounted.current = true;
    const visibility = () => {
      if (document.hidden) { stop(); void context.current?.suspend().catch(() => {}); }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted.current = false; stop();
      document.removeEventListener('visibilitychange', visibility);
      const audio = context.current; context.current = null;
      for (const clip of [yay.current, celebrationClip.current]) {
        if (clip) { clip.removeAttribute('src'); clip.load(); }
      }
      yay.current = null; celebrationClip.current = null;
      void audio?.close().catch(() => {});
    };
  }, []);

  return { play, stop };
}
