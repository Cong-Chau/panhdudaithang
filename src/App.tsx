import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useSoundEffects, type SoundEffect } from './useSoundEffects';

const compliments = ['Chiến thần chốt sheet!', 'Cho phép gáy!', 'Đỉnh nóc, kịch trần!', 'Hệ điều hành: đại thắng!'];
type Particle = { x: number; y: number; dx: number; dy: number; rotation: number; color: string };

function Trophy() {
  return <svg viewBox="0 0 320 290" fill="none" aria-hidden="true">
    <path d="M92 65H54v24c0 44 30 66 62 64M228 65h38v24c0 44-30 66-62 64" stroke="#352044" strokeWidth="13" strokeLinejoin="round"/>
    <path d="M92 65H54v24c0 44 30 66 62 64M228 65h38v24c0 44-30 66-62 64" stroke="#FFB829" strokeWidth="7"/>
    <path d="M153 168h19v57h-19z" fill="#FFB829" stroke="#352044" strokeWidth="5"/>
    <path d="M119 223h84l13 24H105l14-24Z" fill="#F69C20" stroke="#352044" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M96 49h130l-9 71c-5 40-28 62-56 62s-51-22-56-62l-9-71Z" fill="#FFD33E" stroke="#352044" strokeWidth="5"/>
    <path d="m202 56-6 66c-4 26-16 44-32 54 32-2 47-29 49-58l8-62h-19Z" fill="#FFB127"/>
    <path d="m115 65 4 32" stroke="#FFF5B3" strokeWidth="10" strokeLinecap="round"/>
    <path d="m161 89 10 20 22 3-16 16 4 22-20-10-20 10 4-22-16-16 22-3 10-20Z" fill="#FFF8D6" stroke="#352044" strokeWidth="4" strokeLinejoin="round"/>
    <rect x="100" y="247" width="121" height="22" rx="5" fill="#8850ED" stroke="#352044" strokeWidth="5"/>
    <g className="crown"><path d="m129 26-8-23 25 12 15-15 15 15 25-12-8 23h-64Z" fill="#D4F46A" stroke="#352044" strokeWidth="4" strokeLinejoin="round"/><circle cx="161" cy="23" r="3" fill="#7138ED"/></g>
    <path className="sparkle" d="m253 174 6 15 16 6-16 6-6 15-6-15-15-6 15-6 6-15Z" fill="#7138ED"/>
    <path d="m64 174 4 10 11 4-11 4-4 10-4-10-11-4 11-4 4-10Z" fill="#FF7150"/>
  </svg>;
}

function Bot({ cool }: { cool: boolean }) {
  return <svg viewBox="0 0 120 125" fill="none" aria-hidden="true"><path d="M60 23V12" stroke="#352044" strokeWidth="4"/><circle cx="60" cy="9" r="6" fill="#FF7150" stroke="#352044" strokeWidth="3"/><rect x="27" y="26" width="66" height="55" rx="17" fill="#D4F46A" stroke="#352044" strokeWidth="4"/><rect x="36" y="37" width="48" height="29" rx="10" fill="#FFFBEF" stroke="#352044" strokeWidth="3"/>{cool ? <><path d="M36 44h48" stroke="#352044" strokeWidth="4"/><path d="M39 43h17v13H39zM64 43h17v13H64z" fill="#352044"/></> : <><circle cx="48" cy="48" r="4" fill="#352044"/><circle cx="72" cy="48" r="4" fill="#352044"/><path d="M54 57q6 5 12 0" stroke="#352044" strokeWidth="3" strokeLinecap="round"/></>}<rect x="36" y="86" width="48" height="26" rx="8" fill="#A882F4" stroke="#352044" strokeWidth="4"/><path d="M43 114v7M77 114v7M30 90l-12 8" stroke="#352044" strokeWidth="6" strokeLinecap="round"/><g className="bot-hand"><path d="m87 91 13-14V65" stroke="#352044" strokeWidth="6" strokeLinecap="round"/><path d="m94 66 6 8 8-7" stroke="#352044" strokeWidth="5" strokeLinecap="round"/></g><path d="M52 98h16" stroke="#FFFBEF" strokeWidth="4" strokeLinecap="round"/></svg>;
}

export default function App() {
  const sound = useSoundEffects();
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(false);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cool, setCool] = useState(false);
  const taps = useRef(0);
  const lastCompliment = useRef(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { setReduced(media.matches); if (media.matches) setParticles([]); };
    const updateVisibility = () => { setHidden(document.hidden); if (document.hidden) { clearTimers(); setParticles([]); setMessage(''); } };
    updateMotion(); media.addEventListener('change', updateMotion); document.addEventListener('visibilitychange', updateVisibility);
    return () => { clearTimers(); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  function announce(text: string) {
    clearTimers(); setParticles([]); setMessage(text);
    timers.current.push(setTimeout(() => setMessage(''), 3800));
  }
  function burst(event: MouseEvent<HTMLButtonElement>, text: string, effect: SoundEffect) {
    sound.play(effect);
    announce(text);
    if (reduced || hidden) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
    const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
    const count = window.innerWidth < 600 ? 28 : 44;
    setParticles(Array.from({ length: count }, (_, i) => ({ x, y, dx: (Math.random() - .5) * 380, dy: -100 - Math.random() * 240, rotation: Math.random() * 700 - 350, color: ['#7138ED', '#FF7150', '#D4F46A', '#FFD33E', '#FF9EC8'][i % 5] })));
    timers.current.push(setTimeout(() => setParticles([]), 1100));
  }
  function praise() {
    sound.play('trophy');
    const next = (lastCompliment.current + 1 + Math.floor(Math.random() * (compliments.length - 1))) % compliments.length;
    lastCompliment.current = next; announce(compliments[next]);
  }
  function tapBot() {
    taps.current += 1;
    if (taps.current >= 3) { sound.play('bot'); setCool(true); announce('Bot lên đồ. Cùng ăn mừng nào! 🎉'); }
    else announce(taps.current === 1 ? 'Psst… chạm bot thêm 2 lần nhé!' : 'Một lần nữa. Có bất ngờ đó!');
  }
  return <div className={`page ${hidden ? 'is-paused' : ''} ${reduced ? 'reduce-motion' : ''}`}>
    <header className="topbar mx-auto flex items-center justify-between"><a href="#card" className="brand" aria-label="Bot ăn mừng — đến thiệp chúc mừng"><img className="brand-mark" src={`${import.meta.env.BASE_URL}brand-mark.svg`} width="32" height="32" alt=""/><span className="brand-name">bot ăn mừng<span className="brand-dot">.</span></span></a><span className="delivery"><span /> TIN VUI ĐÃ TỚI</span></header>
    <main id="card" className="mx-auto">
      <div className="intro flex items-center justify-center gap-2"><span className="tiny-mail">✉</span> MỘT CHIẾC THIỆP DÀNH RIÊNG CHO BẠN</div>
      <div className="card-wrap">
        <div className="envelope" aria-hidden="true"><div className="envelope-flap"/><span>GỬI CHIẾN THẦN ♡</span></div>
        <article className="celebration-card">
          <div className="card-top flex items-center justify-between"><span className="status"><span>✓</span> KOC ĐÃ LÊN SHEET</span><span className="issue">THIỆP SỐ 001 ↗</span></div>
          <div className="hero-grid">
            <div className="hero-copy"><figure className="customer-photo"><span className="photo-tape" aria-hidden="true"/><img src={`${import.meta.env.BASE_URL}customer.webp`} alt="Ảnh khách hàng Pành Đù cầm cờ Việt Nam giữa không gian cây xanh" width="720" height="950" fetchPriority="high" decoding="async"/><figcaption>CHIẾN THẦN HÔM NAY <span aria-hidden="true">✦</span></figcaption><span className="photo-heart" aria-hidden="true">♡</span></figure><div className="eyebrow">HÔM NAY LÀ NGÀY CỦA BẠN!</div><h1><span>Pành Đù</span><span className="headline-bottom">đại thắng! <span className="sr-only">🏆</span></span></h1><p className="description">KOC đã lên sheet.<br/><strong>Hai con quỷ đã bị bỏ lại phía sau!</strong></p><div className="devils" aria-label="Hai con quỷ đã bị bỏ lại"><span>👿</span><span>👿</span><span className="devils-note">bye bye, hai đứa nhé ↗</span></div></div>
            <div className="trophy-scene"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="scene-star star-one">✦</span><span className="scene-star star-two">✳</span><span className="winner-tag">WINNER ENERGY</span><button className="trophy-button" onClick={praise} aria-label="Chạm cúp để nhận một lời khen"><Trophy /></button><span className="trophy-hint">↑ chạm cúp, nhận lời khen</span><div className="stamp" aria-label="Đại thắng">ĐẠI THẮNG<span>100% XỨNG ĐÁNG</span></div></div>
          </div>
          <div className="celebrate-area"><p>Hôm nay bạn có quyền gáy.<br className="mobile-break"/> <strong>Happy happy nhé! 🎉</strong></p><div className="actions flex flex-col sm:flex-row"><button className="primary-button" onClick={e => burst(e, 'Đại thắng rồi! Tung hoa cho chiến thần! 🎉', 'cheer')}><span>Ăn mừng thôi!</span><span aria-hidden="true">↗</span></button><button className="secondary-button" onClick={e => burst(e, 'Alo alo! Pành Đù đại thắng, nghe rõ trả lời! 📣', 'yay')}>Gáy một phát <span aria-hidden="true">📣</span></button></div><span className="little-note">Cứ gáy đi. Hôm nay bot chống lưng.</span></div>
          <div className="card-bottom flex items-center justify-between"><span>GỬI BẰNG 100% SỰ TỰ HÀO ♡</span><span className="mini-stars">✦ ✦ ✦</span></div>
        </article>
        <span className="outside-star" aria-hidden="true">✳</span>
      </div>
      <section className="bot-section"><button className={`bot-button ${cool ? 'cool' : ''}`} onClick={tapBot} aria-label="Chạm bot ba lần để khám phá bất ngờ" aria-pressed={cool}><Bot cool={cool}/></button><div className="bot-note"><span className="verified">✦ ĐÃ ĐƯỢC BOT BẢO LÃNH</span><p><strong>Bot cùng bạn ăn mừng! 🎉</strong></p><span className="bot-secret">Bot có một bí mật. Thử chạm 3 lần.</span></div></section>
    </main>
    <footer><p>Thân ái, bot chăm chỉ của bạn 🤖</p><span>MADE WITH LOVE, A LITTLE CHAOS & A LOT OF KOC.</span></footer>
    <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">{message}</div>
    <div className="confetti-layer" aria-hidden="true">{particles.map((p, i) => <i key={i} style={{ left: p.x, top: p.y, backgroundColor: p.color, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rotation': `${p.rotation}deg`, borderRadius: i % 3 === 0 ? '50%' : '1px' } as CSSProperties}/>)}</div>
  </div>;
}
