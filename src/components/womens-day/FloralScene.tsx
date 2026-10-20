import { useMemo, type CSSProperties } from 'react';
import type { DayEffects, Particle } from '../../hooks/useWomensDayEffects';

export function Flower({ variant = 0, index = 0, color = '#F6ABC4' }: { variant?: number; index?: number; color?: string }) {
  return <g className="wd-flower" style={{ '--i': index } as CSSProperties}>
    <g className="wd-grow"><path d="M50 155Q40 100 50 50" fill="none" stroke="#7B9B72" strokeWidth="5"/>
      <g className="wd-leaf"><path d="M47 113Q12 115 18 83Q44 86 47 113" fill="#7B9B72"/></g>
      <g className="wd-leaf wd-leaf-right"><path d="M48 94Q80 96 83 64Q54 66 48 94" fill="#9BAE78"/></g>
      <g className="wd-flower-head">
        {variant % 3 === 0 ? <path d="M22 38Q35 40 37 26L50 40L64 26Q68 42 79 38Q79 79 50 80Q21 76 22 38" fill={color} stroke="#45253D" strokeWidth="1.5"/>
          : <g>{Array.from({ length: variant % 3 === 1 ? 8 : 5 }, (_, i) => <ellipse key={i} cx="50" cy="31" rx={variant % 3 === 1 ? 9 : 13} ry="20" fill={color} stroke="#45253D" strokeWidth=".7" transform={`rotate(${i * 360 / (variant % 3 === 1 ? 8 : 5)} 50 50)`}/>)}<circle cx="50" cy="50" r="12" fill="#F2C768"/></g>}
      </g>
    </g>
  </g>;
}

export function ParticleLayer({ items, mode }: { items: Particle[]; mode: 'ambient' | 'welcome' | 'interaction' }) {
  return <div className={`wd-particles wd-${mode}`} aria-hidden="true">{items.map((p, i) => {
    const edgeX = p.x < 50 ? p.x * .12 : 94 + (p.x - 50) * .12;
    return <svg key={i} viewBox="0 0 24 24" className={`wd-particle wd-shape-${p.shape}`} style={{
      left: `${mode === 'interaction' ? 50 : edgeX}%`, color: p.color,
      '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--turn': `${p.turn}deg`,
      '--delay': `${mode === 'ambient' ? -i * .91 : p.delay / 1000}s`,
      '--duration': mode === 'ambient' ? `${9 + i % 6}s` : mode === 'welcome' ? '2.4s' : '1.4s',
    } as CSSProperties}>
      {p.shape === 'heart' ? <path d="M12 21 3 12C-4 3 8-2 12 6C16-2 28 3 21 12Z" fill="currentColor"/>
        : p.shape === 'star' ? <path d="m12 0 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="currentColor"/>
        : <path d="M3 20Q-2 0 21 3Q25 22 3 20Z" fill="currentColor"/>}
    </svg>;
  })}</div>;
}

export default function FloralScene({ effects }: { effects: DayEffects }) {
  const ambient = useMemo<Particle[]>(() => Array.from({ length: 14 }, (_, i) => ({
    x: (i * 37 + 11) % 100, dx: i % 2 ? 14 : -14, dy: 0, turn: 120 + i * 19,
    delay: 0, color: i % 2 ? '#F6ABC4' : '#8652B8', shape: 'petal',
  })), []);
  return <div className="wd-scene" aria-hidden="true">
    <div className="wd-ambient-loops">
      {[0, 1, 2].map(i => <i className={`wd-glow wd-glow-${i}`} key={i}/>)}
      {['left', 'right'].map(side => <svg key={side} className={`wd-garden wd-garden-${side}`} viewBox="0 0 180 260">
        {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${i * 22 - 25} ${80 + i % 3 * 22}) scale(.85)`}><Flower index={i} variant={i} color={i % 2 ? '#F6ABC4' : '#B99CD6'}/></g>)}
      </svg>)}
      <ParticleLayer items={ambient.slice(0, effects.small ? 8 : 14)} mode="ambient"/>
      {Array.from({ length: effects.small ? 4 : 6 }, (_, i) => <span key={i} className="wd-spark" style={{ left: `${i % 2 ? 96 : 2}%`, top: `${12 + i * 13}%`, '--i': i } as CSSProperties}>✦</span>)}
    </div>
    <ParticleLayer items={effects.welcome} mode="welcome"/>
  </div>;
}
