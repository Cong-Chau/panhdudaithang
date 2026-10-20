import type { DayEffects } from '../../hooks/useWomensDayEffects';
import { Flower, ParticleLayer } from './FloralScene';
import PagedText from './PagedText';
const palettes = [['#F6ABC4', '#B99CD6'], ['#FFF0DD', '#F2C768'], ['#F6ABC4', '#FFF0DD']];
export default function GiftStage({ effects: e }: { effects: DayEffects }) {
  const colors = palettes[e.palette];
  return <section className={`wd-stage wd-stage-${e.stage}`} aria-label="Quà dành cho Pành">
    <div className={`wd-stage-art ${e.active === 'bouquet' ? 'wd-presenting' : ''}`} key={`art-${e.run}`}>
      {e.stage === 'compliment' ? <div className={`wd-sticker ${e.active === 'compliment' ? 'wd-sticker-enter' : ''}`}><span aria-hidden="true">✦</span><strong>BOT XÁC NHẬN</strong><span aria-hidden="true">♡</span></div>
        : <svg className={`wd-bouquet ${e.stage === 'idle' ? 'wd-bud' : ''}`} viewBox="0 0 320 220" aria-hidden="true">
          <path d="m72 94 88 112L247 94 190 203h-60Z" fill="#EFE0C6" stroke="#C6AC8E" strokeWidth="2"/>
          {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${22 + i * 33} ${Math.abs(i - 3) * 10}) scale(.65)`}><Flower index={i} variant={i} color={colors[i % 2]}/></g>)}
          <g className="wd-bow"><path d="M160 165Q100 124 124 181Q141 187 160 165Q220 124 195 181Q180 187 160 165" fill="#8652B8"/><path d="m155 170-11 39 17-9 17 9-12-39" fill="#8652B8"/><circle cx="160" cy="169" r="8" fill="#F6ABC4"/></g>
        </svg>}
    </div>
    <div className="wd-stage-message"><PagedText text={e.message}/></div>
    {e.active !== 'photo' && <ParticleLayer key={`particles-${e.run}`} items={e.particles} mode="interaction"/>}
  </section>;
}
