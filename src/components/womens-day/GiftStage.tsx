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
          <path d="M49 87Q160 112 271 87L207 205Q160 218 113 205Z" fill="#F7EBD8" stroke="#C6AC8E" strokeWidth="2" strokeLinejoin="round"/>
          {Array.from({ length: 7 }, (_, i) => {
            const x = 22 + i * 33;
            const y = Math.abs(i - 3) * 10;
            // Convert the shared tie point into each flower's local coordinates.
            return <g key={i} transform={`translate(${x} ${y}) scale(.65)`}>
              <Flower index={i} variant={i} color={colors[i % 2]} stemEnd={{ x: (160 - x) / .65, y: (174 - y) / .65 }}/>
            </g>;
          })}
          <path d="M54 101Q113 130 180 145L158 210L113 205Z" fill="#E8D6B8" stroke="#C6AC8E" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M266 101Q219 138 140 149L160 210L207 205Z" fill="#F4E6CE" stroke="#C6AC8E" strokeWidth="2" strokeLinejoin="round"/>
          <g className="wd-bow"><path d="M160 165Q100 124 124 181Q141 187 160 165Q220 124 195 181Q180 187 160 165" fill="#8652B8"/><path d="m155 170-11 39 17-9 17 9-12-39" fill="#8652B8"/><circle cx="160" cy="169" r="8" fill="#F6ABC4"/></g>
        </svg>}
    </div>
    <div className="wd-stage-message"><PagedText text={e.message}/></div>
    {e.active !== 'photo' && <ParticleLayer key={`particles-${e.run}`} items={e.particles} mode="interaction"/>}
  </section>;
}
