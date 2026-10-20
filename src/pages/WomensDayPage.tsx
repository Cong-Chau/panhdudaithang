import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FloralScene, { ParticleLayer } from '../components/womens-day/FloralScene';
import GiftStage from '../components/womens-day/GiftStage';
import FlowerBot from '../components/womens-day/FlowerBot';
import PagedText from '../components/womens-day/PagedText';
import { copy } from '../content/womensDay';
import { useWomensDayEffects } from '../hooks/useWomensDayEffects';
import { useWomensDaySound } from '../hooks/useWomensDaySound';
import '../styles/womens-day.css';

const faces = ['Chiếc thiệp', 'Lời chúc', 'Nhận hoa', 'Người giao hoa'] as const;
const wishes = [copy.intro, ...copy.paragraphs, copy.closing, copy.signature].join('\n\n');
const senderText = 'Hoa đã có. Người giao hoa cũng đã có mặt 😎\n\nHoa tặng Pành. Còn người giao hoa xin một lời khen.';

export default function WomensDayPage() {
  const { play } = useWomensDaySound();
  const e = useWomensDayEffects(play);
  const [face, setFace] = useState(0);
  const facesRef = useRef<HTMLDivElement>(null);
  const focusOnFace = useRef(false);
  useLayoutEffect(() => {
    const active = document.activeElement;
    if (focusOnFace.current || active?.closest('.wd-face[hidden]') || active instanceof HTMLButtonElement && active.disabled) {
      facesRef.current?.querySelector<HTMLElement>('.wd-face:not([hidden])')?.focus({ preventScroll: true });
    }
    focusOnFace.current = false;
  }, [face]);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [coverMessage, setCoverMessage] = useState<string>(copy.intro);
  const [senderLoaded, setSenderLoaded] = useState(false);
  const [senderFailed, setSenderFailed] = useState(false);
  const [senderEntered, setSenderEntered] = useState(false);
  const senderEntranceStarted = useRef(false);
  useEffect(() => {
    if (senderLoaded && (e.disabledMotion || e.hidden || face !== 3 && senderEntranceStarted.current)) setSenderEntered(true);
  }, [senderLoaded, e.disabledMotion, e.hidden, face]);

  function receiveFlowers() {
    e.act('bouquet');
    openFace(2);
  }

  function openFace(index: number) {
    focusOnFace.current = !!document.activeElement?.closest('.wd-face');
    setFace(index);
  }

  const classes = ['womens-day-page', e.opening ? 'wd-opening' : '', e.disabledMotion ? 'wd-static' : '',
    e.hidden ? 'wd-hidden' : '', e.active === 'bouquet' ? 'wd-focus-gift' : ''].filter(Boolean).join(' ');

  return <div className={classes}>
    <FloralScene effects={e}/>
    <header className="wd-header">
      <button type="button" className="wd-brand" onClick={() => { setCoverMessage(copy.intro); openFace(0); }} aria-label="Về mặt đầu của thiệp">
        <img src={`${import.meta.env.BASE_URL}brand-mark.svg`} width="32" height="32" alt=""/>
        <span>bot gửi thương ♡</span>
      </button>
      <button type="button" className="wd-motion" onClick={e.toggleMotion} disabled={e.reduced}
        aria-label={e.reduced ? 'Đang giảm chuyển động' : e.paused ? 'Bật chuyển động' : 'Tạm dừng chuyển động'}
        title={e.paused ? 'Bật chuyển động' : 'Tạm dừng chuyển động'} aria-pressed={e.disabledMotion}>
        <span aria-hidden="true">{e.disabledMotion ? '▶' : 'Ⅱ'}</span>
      </button>
    </header>

    <main id="womens-day-card" className="wd-card">
      <div className="wd-heading">
        <p className="wd-label">MỘT CHIẾC THIỆP 20/10</p>
        <h1 aria-label={copy.title}><span className="wd-title-full"><span>Pành ơi,</span> <span>20/10 vui nha! 🌷</span></span><span className="wd-title-compact" aria-hidden="true">20/10 ♡</span></h1>
      </div>

      <div className="wd-faces" ref={facesRef}>
        <section className="wd-face wd-cover" hidden={face !== 0} tabIndex={-1} aria-label="Chiếc thiệp dành cho Pành" data-photo-touched={coverMessage === copy.photo}>
          <div className="wd-cover-visual">
            <div className="wd-photo-float">
              <button type="button" className="wd-photo-button" onClick={() => { e.act('photo'); setCoverMessage(copy.photo); }} aria-label="Chạm ảnh để gửi tim cho Pành">
                <span className="wd-tape" aria-hidden="true"/>
                {photoFailed ? <span className="wd-photo-fallback">🌷<br/>Dành riêng cho Pành ♡</span> : <img src={`${import.meta.env.BASE_URL}customer.webp`} width="720" height="950" alt="Pành cầm cờ Việt Nam giữa không gian cây xanh" fetchPriority="high" decoding="async" onError={() => setPhotoFailed(true)}/>}
                <span className="wd-photo-caption">NHÂN VẬT CHÍNH HÔM NAY</span>
                <span className="wd-photo-heart" aria-hidden="true">♡</span>
              </button>
              {e.active === 'photo' && <ParticleLayer key={e.run} items={e.particles} mode="interaction"/>}
            </div>
          </div>
          <div className="wd-cover-note"><PagedText text={coverMessage}/></div>
          <div className="wd-actions wd-cover-actions">
            <button type="button" className="wd-secondary" onClick={() => openFace(1)}>Đọc lời chúc ♡</button>
            <button type="button" className="wd-primary" onClick={receiveFlowers} aria-label="Nhận hoa, khỏi khách sáo 🌷">Nhận hoa 🌷</button>
          </div>
        </section>

        <section className="wd-face wd-letter" hidden={face !== 1} tabIndex={-1} aria-label="Lời chúc dành cho Pành">
          <PagedText text={wishes} className="wd-letter-text" announce/>
        </section>

        <section className="wd-face wd-gift-face" hidden={face !== 2} tabIndex={-1} aria-label="Nhận hoa và lời khen">
          <div className="wd-gift-main">
            <GiftStage effects={e}/>
            <div className="wd-bot-section">
              <button type="button" className="wd-bot-button" onClick={() => e.act('bot')} aria-label="Chạm bot ba lần để khám phá bất ngờ" aria-pressed={e.cool}>
                <FlowerBot key={e.run} cool={e.cool} waving={e.active === 'compliment' || e.active === 'bot' && e.cool}/>
              </button>
              <span>Chạm bot<br/>3 lần nhé!</span>
            </div>
          </div>
          <div className="wd-actions">
            <button type="button" className="wd-primary" onClick={receiveFlowers} aria-label="Nhận hoa, khỏi khách sáo 🌷"><span className="wd-action-label">{e.received ? 'Thêm hoa 🌷' : 'Nhận hoa 🌷'}</span><span className="wd-action-icon" aria-hidden="true">🌷</span></button>
            <button type="button" className="wd-secondary" onClick={() => e.act('compliment')} aria-label="Khen thêm câu nữa 😌"><span className="wd-action-label">Khen thêm 😌</span><span className="wd-action-icon" aria-hidden="true">😌</span></button>
            <button type="button" className="wd-compact-bot" onClick={() => e.act('bot')} aria-label="Chạm bot ba lần để khám phá bất ngờ" aria-pressed={e.cool}>🤖</button>
          </div>
          {e.received && <button type="button" className="wd-sender-link" onClick={() => openFace(3)}>Xem người giao hoa →</button>}
        </section>

        <section className="wd-face wd-sender-card" hidden={face !== 3} tabIndex={-1} aria-label="Người giao hoa" data-loading={e.received && (!senderLoaded || senderFailed)}>
          {e.received ? <>
            <div className="wd-sender-frame">
              {!senderFailed && <img className={senderLoaded && !senderEntered ? 'wd-sender-ready' : ''} src={`${import.meta.env.BASE_URL}sender-rose.png`} width="2730" height="1536" alt="Người gửi mặc vest, đưa một bông hồng đỏ về phía máy ảnh" decoding="async" onLoad={() => setSenderLoaded(true)} onAnimationStart={() => { senderEntranceStarted.current = true; }} onAnimationEnd={() => setSenderEntered(true)} onError={() => setSenderFailed(true)}/>}
            </div>
            {(!senderLoaded || senderFailed) && <div className="wd-sender-loading"><PagedText text={senderFailed ? `Người giao hoa đang kẹt mạng. Hoa vẫn tới đúng người nhé! 🌷\n\n${senderText}` : 'Người giao hoa đang tới…'}/></div>}
            <div className="wd-sender-caption" hidden={!senderLoaded || senderFailed}><PagedText text={senderText}/></div>
          </> : <>
            <div className="wd-locked-note"><PagedText text="Người giao hoa đang đợi Pành nhận hoa nè. Nhận một bó trước nhé! 🌷"/></div>
            <button type="button" className="wd-primary" onClick={receiveFlowers}>Nhận hoa 🌷</button>
          </>}
        </section>
      </div>

      <nav className="wd-face-nav" aria-label="Các mặt của thiệp">
        <button type="button" onClick={() => openFace(Math.max(0, face - 1))} disabled={face === 0} aria-label="Mặt trước">←</button>
        <span className="wd-face-indicator" aria-live="polite"><span className="wd-face-name">{faces[face]}</span><span>{face + 1} / {faces.length}</span></span>
        <button type="button" onClick={() => openFace(Math.min(faces.length - 1, face + 1))} disabled={face === faces.length - 1} aria-label="Mặt tiếp theo">→</button>
      </nav>
    </main>

    <footer className="wd-footer">{copy.signature}</footer>
    <div className="wd-sr-only" role="status" aria-live="polite" aria-atomic="true">{e.run > 0 && <span key={e.run}>{e.message}</span>}</div>
  </div>;
}
