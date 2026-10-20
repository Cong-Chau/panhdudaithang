import { useEffect, useRef, useState } from 'react';
import { compliments, copy } from '../content/womensDay';

export type ActionKind = 'bouquet' | 'compliment' | 'photo' | 'bot';
export type Particle = { x: number; dx: number; dy: number; turn: number; delay: number; color: string; shape: 'petal' | 'heart' | 'star' };
type Stage = 'idle' | 'bouquet' | 'compliment';
type State = {
  stage: Stage; palette: number; compliment: number; taps: number; cool: boolean; received: boolean;
  message: string; run: number; active: ActionKind | null; particles: Particle[];
  opening: boolean; welcome: Particle[];
};
const colors = ['#F6ABC4', '#8652B8', '#F2C768', '#FFF0DD'];
function particles(count: number, kind: ActionKind | 'welcome'): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 10 + Math.random() * 80, dx: (Math.random() - .5) * 220,
    dy: -70 - Math.random() * 130, turn: (Math.random() - .5) * 500,
    delay: kind === 'bouquet' ? 450 : 0, color: colors[i % colors.length],
    shape: kind === 'photo' ? 'heart' : kind === 'compliment' ? 'star' : i % 4 === 0 ? 'heart' : 'petal',
  }));
}
export function useWomensDayEffects(onSound: (kind: ActionKind | null) => void) {
  const [state, setState] = useState<State>({
    stage: 'idle', palette: 0, compliment: -1, taps: 0, cool: false, received: false,
    message: copy.idle, run: 0, active: null, particles: [], opening: false, welcome: [],
  });
  const current = useRef(state);
  const [hidden, setHidden] = useState(document.hidden);
  const [small, setSmall] = useState(() => window.innerWidth < 640);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const serial = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bouquetNumber = useRef(0);
  function write(next: State) { current.current = next; setState(next); }
  function cancel() {
    serial.current += 1;
    timers.current.forEach(clearTimeout); timers.current = [];
  }
  function settle() {
    cancel();
    write({ ...current.current, active: null, particles: [], opening: false, welcome: [] });
  }
  function motionOff() {
    return pausedRef.current || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const width = matchMedia('(max-width: 639px)');
    function visibility() { setHidden(document.hidden); if (document.hidden) settle(); }
    function motion() { setReduced(media.matches); if (media.matches) settle(); }
    function resize() { setSmall(width.matches); }
    if (!motionOff()) {
      write({ ...current.current, opening: true, welcome: particles(width.matches ? 10 : 18, 'welcome') });
      const id = serial.current;
      timers.current.push(setTimeout(() => {
        if (id === serial.current) write({ ...current.current, opening: false, welcome: [] });
      }, 2400));
    }
    media.addEventListener('change', motion); width.addEventListener('change', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancel(); media.removeEventListener('change', motion); width.removeEventListener('change', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  function act(kind: ActionKind) {
    cancel();
    const old = current.current;
    const taps = kind === 'bot' ? Math.min(3, old.taps + 1) : old.taps;
    // Call synchronously in the user gesture; silent bot taps still stop previous audio.
    onSound(kind === 'bot' && taps < 3 ? null : kind);
    const off = motionOff();
    const mobile = window.innerWidth < 640;
    const compliment = kind === 'compliment' ? (old.compliment + 1) % compliments.length : old.compliment;
    const palette = kind === 'bouquet' ? bouquetNumber.current++ % 3 : old.palette;
    const count = kind === 'bouquet' ? (mobile ? 24 : 40) : kind === 'compliment' ? 8 : kind === 'photo' ? 6 : 0;
    const message = kind === 'bouquet' ? copy.bouquet : kind === 'compliment' ? compliments[compliment]
      : kind === 'photo' ? copy.photo : copy.bot[taps - 1];
    write({
      ...old, stage: kind === 'bouquet' ? 'bouquet' : kind === 'compliment' ? 'compliment' : old.stage,
      palette, compliment, taps, cool: old.cool || taps === 3, received: old.received || kind === 'bouquet',
      message, run: old.run + 1, active: off ? null : kind,
      particles: off ? [] : particles(count, kind), opening: false, welcome: [],
    });
    if (!off) {
      const id = serial.current;
      const duration = kind === 'bouquet' ? 1850 : kind === 'compliment' || kind === 'photo' ? 900 : taps < 3 ? 0 : 1200;
      timers.current.push(setTimeout(() => {
        if (id === serial.current) write({ ...current.current, active: null, particles: [] });
      }, duration));
    }
  }
  function toggleMotion() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current); settle();
  }
  return { ...state, small, hidden, reduced, paused, disabledMotion: paused || reduced, act, toggleMotion };
}
export type DayEffects = ReturnType<typeof useWomensDayEffects>;
