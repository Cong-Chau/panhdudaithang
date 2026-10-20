# Thiệp hoa 20/10 Implementation Plan

> **For agentic workers:** Use `.agents/skills/executing-plans/SKILL.md` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm thiệp hoa vui nhộn tại `/20-10`, bốn mặt trong cùng viewport no-scroll theo AGENTS.md, giữ trang KOC tại `/`.

**Architecture:** Hai HTML đầu vào Vite dùng chung React entry; App chọn trang theo pathname. Trang mới có bốn mặt với nút chuyển, cùng viewport cố định; nội dung dài phân trang theo đo đạc DOM. SVG/CSS thực hiện chuyển động, một hook quản lý phiên tương tác và một hook Web Audio riêng quản lý âm thanh. CSS của trang KOC được cô lập theo route trước khi nối trang mới vào App.

**Tech Stack:** React 19, TypeScript strict, Vite 6, Tailwind CSS 4, SVG/CSS, Web Audio; giữ nguyên dependency hiện tại.

**Spec:** `docs/specs/2026-10-20-womens-day-landing-design.md`. Đọc cả spec và plan. Người dùng đã yêu cầu thực thi và sau đó cho phép dừng chương trình, commit và push nhánh hiện tại; không yêu cầu deploy. Chỉ dẫn mới nhất: không dùng worktree, được phép dùng subagent; triển khai ngay trong checkout hiện tại trên nhánh `feature/womens-day-landing`.

## Global Constraints

Các dòng sau được giữ nguyên từ spec; mọi task đều phải tuân thủ:

- Route mới: `/20-10` (chấp nhận cả `/20-10/`).
- Route hiện tại: `/` — thiệp chúc mừng KOC.
- Không lưu trạng thái vào localStorage, không gọi API hoặc analytics.
- Không nhạc nền, không âm thanh lặp, không phát khi mở trang, hover, cuộn hoặc khi animation nền tự chạy.
- Âm thanh tương tác luôn sẵn sàng, không có nút bật/tắt, trạng thái mute hoặc bước yêu cầu bật âm riêng. Thao tác đầu tiên thuộc loại có âm phát tiếng ngay nếu trình duyệt cho phép; không tự phát khi mở trang.
- Không thêm runtime dependency, font ngoài hoặc ảnh tải từ dịch vụ ngoài. SVG hoa/bot được vẽ bằng code và asset ảnh hiện có được đóng gói cùng site.
- Chỉ animate transform/opacity; không animate kích thước bố cục, filter hoặc box-shadow. Không dùng vòng render React từng frame; vị trí ngẫu nhiên được tạo một lần khi bắt đầu phiên hạt.
- Hạt rời tối đa đồng thời: 42 mobile, 72 desktop, gồm cả nền, mở đầu và tương tác. Khi bắt đầu tương tác, xóa hạt mở đầu. Số DOM không tăng sau mỗi lần bấm.
- Mobile dưới 640px sử dụng ngân sách hạt mobile; số lượng được xác định theo viewport khi bắt đầu phiên hiệu ứng. Resize không tạo thêm phiên hiệu ứng.
- Chỉ một hoạt cảnh tương tác tạm thời hoạt động tại một thời điểm trên toàn trang. Tương tác mới hủy timer/hạt tạm thời của tương tác cũ và cập nhật sân khấu.

Không chạy test runner. Xác minh bằng build, đọc output, diff và trình duyệt. Không gọi script lint/typecheck không tồn tại. Không tự commit/push/deploy; các bước commit ở task là bước có điều kiện, chỉ thực hiện khi đã được người dùng cho phép. Không tạo thêm tài liệu evidence/tracking/handoff.

## File structure

| File | Trách nhiệm | Task |
| --- | --- | --- |
| `src/content/womensDay.ts` | Nội dung và lời khen | 1 |
| `src/hooks/useWomensDayEffects.ts` | State, một phiên animation, visibility, motion | 1 |
| `src/hooks/useWomensDaySound.ts` | Âm thanh nhẹ, dừng/thay thế/cleanup | 1 |
| `src/components/womens-day/FloralScene.tsx` | Hoa dùng chung, nền và các lớp hạt | 2 |
| `src/components/womens-day/GiftStage.tsx` | Sân khấu idle/bouquet/compliment | 2 |
| `src/components/womens-day/FlowerBot.tsx` | Bot, kính, tay giơ hoa | 2 |
| `src/pages/WomensDayPage.tsx` | Bố cục, nội dung, kết nối hooks | 2 |
| `src/styles/womens-day.css` | Layout no-scroll và mọi animation mới | 2 |
| `src/components/womens-day/PagedText.tsx` | Phân trang theo vùng đọc thực tế | No-scroll follow-up |
| `src/viewport.css` | Giới hạn viewport dùng chung | No-scroll follow-up |
| `public/sender-rose.png` | Ảnh người gửi cầm hoa, sao chép nguyên bản nguồn người dùng cung cấp | 2 |
| `src/pages/CelebrationPage.tsx` | Di chuyển nguyên component KOC, sửa import tương đối | 3 |
| `src/App.tsx`, `src/main.tsx` | Chọn route, trạng thái document theo route | 3 |
| `src/style.css` | Giới hạn CSS cũ, giữ nguyên thứ tự và specificity tương đối | 3 |
| `20-10/index.html`, `vite.config.ts` | HTML/metadata riêng và hai đầu vào build | 3 |
| Spec/plan hiện tại | Chỉ cập nhật quyết định hoặc checkbox khi thực thi | 4 |

## Task graph

| Task | Depends on | Parallel-safe with |
| --- | --- | --- |
| 1. Nội dung, state và âm thanh | none | none |
| 2. Thiệp, hoa và chuyển động | 1 | none |
| 3. Tích hợp route, CSS cũ và HTML build | 1, 2 | none |
| 4. Xác minh toàn bộ tiêu chí | 3 | none |

Thực thi trong checkout hiện tại, tuyệt đối không tạo hoặc dùng worktree theo chỉ dẫn mới nhất của người dùng. Đã kiểm tra checkout nguồn ở `main`, commit `a874d6a`, chỉ có `.agents/` và `docs/` untracked trước khi triển khai; tạo nhánh `feature/womens-day-landing` ngay tại checkout này. Người dùng cho phép subagent: có thể giao Task 1 trên ba file nội dung/hooks với contract đã định nghĩa, trong khi root dựng Task 2 trên các file khác; chỉ tích hợp/build sau khi Task 1 xong. Không có hai agent sửa cùng file. Không tự stage/commit/push/deploy hoặc thêm toàn bộ file untracked vào Git.

---

### Task 1: Nội dung, state và âm thanh

**Depends on:** none.

**Files:** Create `src/content/womensDay.ts`, `src/hooks/useWomensDayEffects.ts`, `src/hooks/useWomensDaySound.ts`.

**Interfaces:**
- Consumes: React hooks và Web APIs của trình duyệt; không import code KOC.
- Produces: `useWomensDayEffects(onSound: (kind: ActionKind | null) => void)`; gọi `act(kind)` trực tiếp từ cử chỉ người dùng. Giá trị trả về là `DayEffects` gồm state, `small`, `hidden`, `reduced`, `paused`, `disabledMotion`, `act`, `toggleMotion`.
- Produces: `ActionKind`, `Particle`, `DayEffects`; `useWomensDaySound(): { play(kind: ActionKind | null): void }`. `null` nghĩa là dừng tiếng cũ và không phát tiếng mới.

- [x] **Step 1: Tạo nội dung chính xác.**

`src/content/womensDay.ts`:

```ts
export const copy = {
  title: 'Pành ơi, 20/10 vui nha! 🌷',
  intro: 'Hôm nay bạn là nóc nhà. Bot đã xác nhận.',
  paragraphs: [
    'Chúc Pành luôn xinh đẹp, ví luôn có tiền, đặt món nào cũng ngon và chụp tấm nào cũng đẹp ngay từ lần đầu!',
    'Mong Pành bớt gặp chuyện đau đầu, gặp nhiều chuyện buồn cười, và luôn có người thương cả những hôm hơi khó ở.',
    'Riêng hôm nay, cứ thoải mái nhận hoa, nhận quà, nhận lời khen. Ai nhờ làm gì thì… để mai tính! 💅',
  ],
  idle: 'Một bó hoa đang chờ Pành nhận nè.',
  bouquet: 'Hoa này không cần tưới. Pành chỉ cần tươi thôi!',
  photo: 'Nhân vật chính hôm nay đây rồi!',
  bot: ['Chạm thêm 2 lần nhé!', 'Một lần nữa, sắp bật mí rồi!', 'Đã bật chế độ cưng Pành hết công suất.'],
  closing: 'Chúc Pành được cưng cả năm, chứ riêng hôm nay thì ít quá. ♡',
  signature: 'Thân ái, bot chăm chỉ của bạn 🤖',
} as const;

export const compliments = [
  'Đẹp vậy rồi, đề nghị bớt khiêm tốn!',
  'Hôm nay Pành đúng. Bot không nhận khiếu nại.',
  'Chúc tiền vào như thông báo nhóm chat. Đều và nhiều.',
  'Nhan sắc này xứng đáng được nghỉ một hôm để ăn mừng!',
  'Việc khó để mai. Hôm nay Pành bận được cưng.',
  'Bot đã kiểm tra: Pành xứng đáng nhận thêm một món quà.',
] as const;
```

- [x] **Step 2: Tạo state machine cho hiệu ứng.**

`src/hooks/useWomensDayEffects.ts`:

```ts
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
```

Opening replays only on a real mount. StrictMode setup/cleanup/setup clears the first setup's timer before creating the rendered session. A change of motion settings or visibility never starts opening again. Resize only updates background density; interaction count is captured at gesture time.

- [x] **Step 3: Tạo âm thanh riêng, không có mute.**

`src/hooks/useWomensDaySound.ts`:

```ts
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
```

At most three gain envelopes of .025 can overlap, so the sum remains below .08. Rejected or slow resume produces no delayed playback; a new gesture can try again. This is a sound design starting point, not proof of perceived volume on a phone.

- [x] **Step 4: Verify.** Run `npm run build` after the three files exist. Expected: TypeScript accepts the files even before they are imported into App; the old route remains the only rendered route at this task. Inspect for any changed legacy sound code: there must be none. No test runner.
- [x] **Step 5: Conditional commit — SKIPPED (not authorized).** Only with existing user authorization, stage the three exact files and commit `feat: add womens day content and interaction state`. Otherwise leave them uncommitted and continue; do not request approval for each task.

---

### Task 2: Thiệp hoa, sân khấu và animation

**Depends on:** 1.

**Files:** Create `src/components/womens-day/FloralScene.tsx`, `src/components/womens-day/GiftStage.tsx`, `src/components/womens-day/FlowerBot.tsx`, `src/pages/WomensDayPage.tsx`, `src/styles/womens-day.css`, `public/sender-rose.png`.

**Interfaces:**
- Consumes: `DayEffects`, `Particle`, `useWomensDayEffects(onSound)`, `useWomensDaySound().play`, `copy`, `compliments` from Task 1.
- Produces: default `WomensDayPage(): React.JSX.Element` for App.
- Component signatures: `FloralScene({ effects }: { effects: DayEffects })`; `ParticleLayer({ items, mode }: { items: Particle[]; mode: 'ambient' | 'welcome' | 'interaction' })`; `Flower({ variant, index, color }: { variant?: number; index?: number; color?: string })`; `GiftStage({ effects }: { effects: DayEffects })`; `FlowerBot({ cool, waving }: { cool: boolean; waving: boolean })`.

- [x] **Step 1: Sao chép ảnh người gửi, sau đó tạo hoa SVG và lớp trang trí.** Khi triển khai, dùng đúng ảnh người dùng cung cấp, không chỉnh khuôn mặt hoặc crop. Lệnh dưới đây giữ nguyên nguồn, không ghi đè asset đã có; nếu asset tồn tại thì đối chiếu hash và xử lý theo bản đang có. Chưa thực thi lệnh này ở giai đoạn viết plan.

```powershell
$senderSource = 'C:\Users\ADMIN\Downloads\Gemini_Generated_Image_sdwjj5sdwjj5sdwj.png'
$senderTarget = Join-Path (Get-Location) 'public\sender-rose.png'
if (-not (Test-Path -LiteralPath $senderTarget)) {
  Copy-Item -LiteralPath $senderSource -Destination $senderTarget -ErrorAction Stop
}
if ((Get-FileHash -LiteralPath $senderSource).Hash -ne (Get-FileHash -LiteralPath $senderTarget).Hash) {
  throw 'Sender photo differs from the supplied original; inspect before replacing it'
}
```

Nguồn PNG có 8.195.400 byte. Bản đầu giữ đúng nguyên ảnh và chỉ tải sau thao tác nhận hoa; khung loading được định nghĩa bên dưới. Không đưa file nguồn Downloads vào Git hoặc thay đổi nguồn đó.

`src/components/womens-day/FloralScene.tsx`:

```tsx
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
```

- [x] **Step 2: Sân khấu bó hoa và bot.**

`src/components/womens-day/GiftStage.tsx`:

```tsx
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
```

`src/components/womens-day/FlowerBot.tsx`:

```tsx
export default function FlowerBot({ cool, waving }: { cool: boolean; waving: boolean }) {
  return <svg className={`wd-bot ${waving ? 'wd-bot-waving' : ''}`} viewBox="0 0 150 160" fill="none" aria-hidden="true">
    <path d="M67 27V15" stroke="#45253D" strokeWidth="4"/><circle cx="67" cy="10" r="6" fill="#F6ABC4"/>
    <rect x="28" y="29" width="78" height="65" rx="22" fill="#EFE0F8" stroke="#45253D" strokeWidth="3"/>
    <rect x="38" y="42" width="58" height="36" rx="12" fill="#FFF8F0"/>
    {cool ? <g fill="#45253D"><path d="M39 47h24v17H43ZM71 47h24l-4 17H71Z"/><path d="M60 49h14v5H60Z"/></g>
      : <g fill="#45253D"><circle cx="53" cy="54" r="4"/><circle cx="81" cy="54" r="4"/></g>}
    <path d="M59 70q8 6 16 0" stroke="#45253D" strokeWidth="3" strokeLinecap="round"/>
    <rect x="42" y="99" width="50" height="34" rx="10" fill="#F6ABC4" stroke="#45253D" strokeWidth="3"/>
    <path d="m42 108-19 12M52 135v13M82 135v13" stroke="#45253D" strokeWidth="6" strokeLinecap="round"/>
    <g className="wd-bot-arm"><path d="m94 109 20-15 1-22" stroke="#45253D" strokeWidth="6" strokeLinecap="round"/><path d="m115 80 9-29" stroke="#7B9B72" strokeWidth="4"/><path d="M111 44q-5-17 9-12l6 8 9-9q14 9-3 23-15 10-21-10" fill="#F6ABC4" stroke="#45253D" strokeWidth="2"/></g>
    <path d="m61 112 6 9 7-9" stroke="#FFF8F0" strokeWidth="3"/>
  </svg>;
}
```

- [x] **Step 3: Ghép trang, ảnh dự phòng và live region.**

`src/pages/WomensDayPage.tsx`:

```tsx
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
```

- [x] **Step 4: CSS đầy đủ, chỉ tác động trang mới.**

`src/styles/womens-day.css`:

```css
html[data-landing="womens-day"] { background:#FFF8F0; color:#45253D; }
.womens-day-page { --wd-ink:#45253D; position:relative; isolation:isolate; width:100%; height:100%; min-width:0; min-height:0; overflow:hidden; display:grid; grid-template-rows:44px minmax(0,1fr) auto; gap:8px; font-family:ui-rounded,"Trebuchet MS",Arial,sans-serif; font-size:16px; color:var(--wd-ink); padding:max(8px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left)); }
.womens-day-page * { box-sizing:border-box; }
.womens-day-page [hidden] { display:none!important; }
.womens-day-page button,.womens-day-page a { font:inherit; color:inherit; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.womens-day-page button { cursor:pointer; }
.womens-day-page button:disabled { cursor:default; opacity:.45; }
.womens-day-page :focus-visible { outline:3px solid #8652B8; outline-offset:2px; }
.womens-day-page p { line-height:1.5; overflow-wrap:anywhere; }
.wd-header { position:relative; z-index:2; width:100%; max-width:1080px; min-width:0; margin:0 auto; display:flex; gap:8px; justify-content:space-between; align-items:center; }
.wd-brand { display:flex; min-width:0; padding:0; gap:8px; align-items:center; border:0; background:transparent; font-weight:700!important; min-height:44px; }
.wd-motion { flex:none; width:44px; height:44px; padding:0; border:1px solid #8652B860; border-radius:50%; background:#FFF8F0; }
.wd-card { position:relative; z-index:1; width:100%; max-width:960px; min-width:0; min-height:0; margin:0 auto; padding:16px 24px; display:grid; grid-template-rows:auto minmax(0,1fr) 44px; gap:10px; background:#FFFCF7; border:1px solid #D5BED0; border-radius:24px; box-shadow:0 6px 24px #8652B818; }
.wd-heading { text-align:center; min-width:0; }
.wd-label { margin:0; font-size:12px; line-height:1.2!important; letter-spacing:.12em; font-weight:700; }
.womens-day-page h1 { font-size:clamp(22px,4.5dvh,42px); line-height:1.1; letter-spacing:-.03em; margin:6px 0 0; font-weight:900; }
.wd-title-full>span { display:block; }
.wd-title-full>span:last-child { color:#8652B8; }
.wd-title-compact { display:none; }
.wd-faces { min-width:0; min-height:0; position:relative; }
.wd-face { position:relative; width:100%; height:100%; min-width:0; min-height:0; }
.wd-cover { display:flex; flex-direction:column; gap:8px; text-align:center; }
.wd-cover-visual { flex:1 1 0; min-height:0; display:flex; align-items:center; justify-content:center; padding:8px; }
.wd-photo-float { position:relative; height:min(100%,300px); width:auto; max-width:80%; aspect-ratio:720/1120; transform:rotate(-3deg); }
.wd-photo-button { display:grid; grid-template-rows:minmax(0,1fr) auto; position:relative; width:100%; height:100%; min-height:0; padding:6px; gap:5px; border:1px solid #D5BED0; background:white; box-shadow:0 4px 10px #45253D15; transition:transform .15s; }
.wd-photo-button img,.wd-photo-fallback { display:block; width:100%; height:100%; min-height:0; object-fit:contain; }
.wd-photo-fallback { display:flex; flex-direction:column; justify-content:center; align-items:center; background:#F8E5EB; font-size:14px; }
.wd-photo-caption { display:block; font-size:10px; line-height:1.2; font-weight:700; }
.wd-tape { position:absolute; width:46px; height:16px; background:#EFD89AC9; top:-8px; left:calc(50% - 23px); transform:rotate(6deg); }
.wd-photo-heart { position:absolute; right:-12px; bottom:12px; color:#8652B8; font-size:30px; line-height:1; }
.wd-cover-note { flex:0 0 72px; min-height:0; max-width:580px; width:100%; margin:auto; }
.wd-actions { flex:none; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; width:100%; margin:0; }
.wd-primary,.wd-secondary,.wd-compact-bot { min-width:0; min-height:44px; padding:8px; border:1.5px solid #8652B8; border-radius:12px; font-weight:700!important; transition:transform .18s; white-space:normal; line-height:1.3; }
.wd-primary { background:#F6ABC4; }
.wd-secondary,.wd-compact-bot { background:#F4EBFB; }
.wd-action-icon,.wd-compact-bot { display:none; }
.womens-day-page button:active { transform:translateY(1px); }
.wd-letter { padding:4px 2px; }
.wd-letter-text { max-width:680px; margin:auto; }
.wd-text { font-size:16px; line-height:1.5; }
.wd-text-copy { line-height:inherit!important; }
.wd-text-nav button { border:1px solid #D5BED0; border-radius:10px; background:#F4EBFB; color:#45253D; }
.wd-text-status { font-size:14px; min-width:32px; text-align:center; }
.wd-gift-face { display:flex; flex-direction:column; gap:6px; }
.wd-gift-main { display:grid; grid-template-columns:minmax(0,1fr) 64px; gap:8px; flex:1 1 0; min-height:0; min-width:0; }
.wd-stage { display:flex; flex-direction:column; min-width:0; min-height:0; position:relative; text-align:center; }
.wd-stage-art { flex:1 1 0; min-height:0; display:flex; align-items:center; justify-content:center; }
.wd-bouquet { width:100%; height:100%; max-width:300px; overflow:visible; }
.wd-bud .wd-flower-head { transform:scale(.45); }
.wd-stage-message { position:relative; z-index:1; flex:0 0 88px; min-height:0; font-weight:700; }
.wd-sticker { max-width:300px; max-height:100%; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:8px; border:2px dashed #8652B8; border-radius:16px; background:#F5E7F4; padding:10px; }
.wd-sticker span { font-size:24px; color:#8652B8; }
.wd-sticker strong { font-size:14px; }
.wd-bot-section { display:flex; flex-direction:column; justify-content:center; align-items:center; gap:4px; text-align:center; min-height:0; }
.wd-bot-section>span { font-size:12px; line-height:1.3; }
.wd-bot-button { width:64px; height:72px; min-height:44px; flex:none; border:0; background:transparent; padding:0; }
.wd-bot { width:100%; height:100%; display:block; }
.wd-bot-arm { transform-origin:94px 109px; }
.wd-sender-link { min-height:44px; border:0; background:transparent; padding:6px; text-decoration:underline; text-underline-offset:3px; }
.wd-sender-card { display:flex; flex-direction:column; gap:8px; text-align:center; }
.wd-sender-frame { position:relative; display:flex; flex:1 1 0; align-items:center; justify-content:center; min-height:0; min-width:0; }
.wd-sender-frame img { display:block; width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; border-radius:12px; }
.wd-sender-ready { animation:wd-sender-enter .5s ease-out; }
.wd-sender-caption { flex:0 0 104px; min-height:0; max-width:650px; width:100%; margin:auto; }
.wd-sender-loading { position:absolute; inset:0; padding:8px; }
.wd-sender-card[data-loading="true"] .wd-sender-frame { position:absolute; inset:0; visibility:hidden; }
.wd-locked-note { flex:1 1 0; min-height:0; }
.wd-face-nav { display:grid; grid-template-columns:44px minmax(0,1fr) 44px; gap:8px; align-items:center; min-width:0; padding-top:0; border-top:1px solid #D5BED060; }
.wd-face-nav>button { width:44px; height:44px; border:1px solid #D5BED0; border-radius:50%; background:#FFF8F0; font-size:22px; }
.wd-face-indicator { display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:4px 12px; text-align:center; line-height:1.2; font-size:14px; }
.wd-face-name { font-weight:700; }
.wd-footer { position:relative; z-index:1; text-align:center; min-width:0; margin:0; padding:0; line-height:1.25; font-size:16px; }
.wd-scene { position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none; }
.wd-glow { position:absolute; width:55vw; height:55vh; border-radius:50%; opacity:.55; background:radial-gradient(ellipse,#F6ABC460,transparent 70%); animation:wd-drift 18s ease-in-out infinite alternate; }
.wd-glow-0 { left:-15%; top:0; }.wd-glow-1 { right:-15%; top:30%; background:radial-gradient(ellipse,#B99CD64D,transparent 70%); animation-duration:21s; }.wd-glow-2 { left:15%; bottom:-20%; background:radial-gradient(ellipse,#F2C76840,transparent 70%); animation-duration:24s; }
.wd-garden { position:absolute; bottom:0; width:110px; height:220px; overflow:visible; }
.wd-garden-left { left:-38px; }.wd-garden-right { right:-38px; transform:scaleX(-1); }
.wd-flower { transform-origin:50px 155px; }
.wd-grow { transform-origin:50px 155px; }
.wd-leaf { transform-origin:47px 113px; }.wd-leaf-right { transform-origin:48px 94px; }
.wd-flower-head { transform-origin:50px 50px; }
.wd-ambient-loops .wd-flower { animation:wd-sway calc(5s + var(--i)*.5s) ease-in-out calc(var(--i)*-.7s) infinite; }
.wd-ambient-loops .wd-particle { animation:wd-fall var(--duration) linear var(--delay) infinite; }
.wd-particles { position:absolute; inset:0; pointer-events:none; overflow:visible; }
.wd-particle { position:absolute; width:14px; height:14px; will-change:transform; }
.wd-ambient .wd-particle,.wd-welcome .wd-particle { top:-24px; }
.wd-welcome .wd-particle { animation:wd-fall var(--duration) ease-in both; }
.wd-interaction { z-index:3; }
.wd-interaction .wd-particle { top:50%; animation:wd-burst var(--duration) ease-out var(--delay) both; }
.wd-shape-star { --duration:.7s!important; }
.wd-photo-float .wd-interaction { overflow:visible; }
.wd-photo-float .wd-particle { --duration:.9s!important; }
.wd-spark { position:absolute; color:#8652B8; animation:wd-twinkle calc(4s + var(--i)*.5s) ease-in-out calc(var(--i)*-.8s) infinite; }
.wd-photo-float { animation:wd-photo-float 6s ease-in-out infinite; }
.wd-photo-heart { animation:wd-heart 5s ease-in-out infinite; }
.wd-opening .wd-card { animation:wd-card-in .65s ease-out; }
.wd-opening h1 span { animation:wd-title .5s ease-out both; }
.wd-opening h1 span+span { animation-delay:.12s; }
.wd-opening .wd-garden .wd-grow { animation:wd-grow .9s ease-out calc(.1s + var(--i)*.1s) backwards; }
.wd-opening .wd-garden .wd-leaf { animation:wd-leaf .6s ease-out calc(.3s + var(--i)*.1s) backwards; }
.wd-opening .wd-garden .wd-flower-head { animation:wd-bloom .6s ease-out calc(.6s + var(--i)*.1s) backwards; }
.wd-presenting { animation:wd-present .35s ease-out; }
.wd-presenting .wd-flower-head { animation:wd-bloom .25s ease-out calc(.15s + var(--i)*.08s) backwards; }
.wd-bow { transform-origin:160px 169px; }
.wd-presenting .wd-bow { animation:wd-ribbon .6s ease-in-out; }
.wd-sticker-enter { animation:wd-sticker-in .3s ease-out; }
.wd-sticker-enter:after { content:''; position:absolute; inset:12px 8%; border:2px solid #F2C768; border-radius:50%; pointer-events:none; animation:wd-ring .7s ease-out both; }
.wd-bot-waving .wd-bot-arm { animation:wd-wave .3s ease-in-out 4; }
.wd-focus-gift .wd-ambient-loops *,.wd-focus-gift .wd-photo-float,.wd-focus-gift .wd-photo-heart { animation-play-state:paused!important; }
.wd-hidden *,.wd-hidden *:before,.wd-hidden *:after { animation-play-state:paused!important; }
.wd-static *,.wd-static *:before,.wd-static *:after { animation:none!important; transition:none!important; }
.wd-static .wd-particles,.wd-static .wd-spark { display:none; }
.wd-sr-only { position:absolute; width:1px; height:1px; margin:-1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
@media(hover:hover) { .womens-day-page button:not(:disabled):hover { transform:translateY(-2px); } }
@media(prefers-reduced-motion:reduce) { .womens-day-page *,.womens-day-page *:before,.womens-day-page *:after { animation:none!important; transition:none!important; }.womens-day-page .wd-particles,.womens-day-page .wd-spark { display:none; } }
@keyframes wd-card-in { from { transform:translateY(12px) rotate(-1deg); } to { transform:none; } }
@keyframes wd-title { from { transform:translateY(6px) scale(.98); } to { transform:none; } }
@keyframes wd-grow { from { transform:scaleY(0); } to { transform:scaleY(1); } }
@keyframes wd-leaf { from { transform:rotate(-50deg) scale(.1); } to { transform:none; } }
@keyframes wd-bloom { from { transform:scale(.05); } to { transform:scale(1); } }
@keyframes wd-sway { 0%,100% { transform:rotate(-3deg); } 50% { transform:rotate(3deg); } }
@keyframes wd-drift { from { transform:translate(-10px,-10px); } to { transform:translate(10px,10px); } }
@keyframes wd-fall { from { transform:translate(0,-20px) rotate(0); opacity:0; } 10%,85% { opacity:.7; } to { transform:translate(var(--dx),calc(100dvh + 50px)) rotate(var(--turn)); opacity:0; } }
@keyframes wd-photo-float { 0%,100% { transform:translateY(0) rotate(-3deg); } 50% { transform:translateY(-3px) rotate(-2deg); } }
@keyframes wd-heart { 0%,16%,100% { transform:scale(1); } 5%,11% { transform:scale(1.08); } }
@keyframes wd-twinkle { 0%,100% { opacity:.2; transform:scale(.8); } 50% { opacity:.7; transform:scale(1); } }
@keyframes wd-present { from { transform:translateY(36px) scale(.85); } to { transform:none; } }
@keyframes wd-ribbon { 25%,75% { transform:rotate(8deg); } 50% { transform:rotate(-8deg); } }
@keyframes wd-sticker-in { from { transform:rotate(-3deg) scale(.95); } to { transform:none; } }
@keyframes wd-ring { from { transform:scale(.7); opacity:.8; } to { transform:scale(1.15); opacity:0; } }
@keyframes wd-burst { 0% { transform:translate(0,0) rotate(0); opacity:0; } 5%,65% { opacity:1; } 100% { transform:translate(var(--dx),calc(var(--dy) + 200px)) rotate(var(--turn)); opacity:0; } }
@keyframes wd-wave { 50% { transform:rotate(-15deg); } }
@keyframes wd-sender-enter { from { transform:translateY(8px); opacity:0; } to { transform:none; opacity:1; } }

@media(min-width:640px) and (min-height:500px) { .wd-title-full>span { display:inline; }.wd-cover { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); grid-template-rows:minmax(0,1fr) auto; align-items:stretch; gap:20px; }.wd-cover-visual { grid-column:1; grid-row:1/3; }.wd-cover-note { grid-column:2; align-self:center; height:min(180px,100%); flex:auto; }.wd-cover-actions { grid-column:2; align-self:end; }.wd-gift-main { grid-template-columns:minmax(0,1fr) 100px; }.wd-bot-button { width:100px; height:110px; }.wd-garden { width:180px; height:300px; }.wd-garden-left { left:-40px; }.wd-garden-right { right:-40px; } }
@media(max-height:600px) { .wd-card { padding:10px 14px; gap:8px; }.wd-stage-message { flex-basis:80px; }.wd-cover-note { flex-basis:72px; }.wd-photo-caption { font-size:9px; } }
@media(max-height:440px) { .womens-day-page { grid-template-rows:44px minmax(0,1fr); gap:4px; padding-top:max(4px,env(safe-area-inset-top)); padding-bottom:max(4px,env(safe-area-inset-bottom)); }.wd-header { height:44px; }.wd-motion { height:44px; width:44px; border-radius:18px; }.wd-brand { min-height:44px; }.wd-brand img { width:28px; height:28px; }.wd-footer,.wd-label { display:none; }.wd-card { padding:8px 12px; gap:6px; }.womens-day-page h1 { font-size:22px; margin:0; }.wd-title-full>span { display:inline; }.wd-cover { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); grid-template-rows:minmax(0,1fr) auto; gap:6px 12px; }.wd-cover-visual { grid-column:1; grid-row:1/3; }.wd-cover-note { grid-column:2; height:100%; flex:auto; }.wd-cover-actions { grid-column:2; }.wd-bot-section>span { display:none; }.wd-garden { height:150px; } }
@media(max-width:340px) { .wd-brand>span { display:none; }.wd-face-name { display:none; }.wd-card { padding-left:10px; padding-right:10px; } }
@media(max-width:360px) and (max-height:440px) { .womens-day-page { padding-left:6px; padding-right:6px; }.wd-title-full { display:none; }.wd-title-compact { display:block; font-size:20px; }.wd-cover { display:flex; }.wd-cover-visual { flex:1; }.wd-cover-note,.wd-cover-actions { display:none; }.wd-photo-caption { display:none; }.wd-photo-float { aspect-ratio:720/950; }.wd-gift-main { display:block; }.wd-gift-main .wd-bot-section,.wd-stage-art,.wd-sender-link { display:none; }.wd-stage { height:100%; }.wd-stage-message { flex:1; }.wd-gift-face>.wd-actions { grid-template-columns:repeat(3,minmax(44px,1fr)); gap:4px; }.wd-gift-face .wd-action-label { display:none; }.wd-gift-face .wd-action-icon,.wd-gift-face .wd-compact-bot { display:block; }.wd-primary,.wd-secondary,.wd-compact-bot { padding:6px; }.wd-sender-caption { flex-basis:88px; } }

@media(max-width:360px) and (max-height:440px) { .wd-cover[data-photo-touched="true"] .wd-cover-note { display:block; flex:0 0 80px; } }
```

The idle heads remain closed. Remounting the art wrapper on a new gesture restarts only the relevant class-driven animation; photo/bot interactions retain bouquet or sticker mode. Layers use separate elements for stem growth, flower sway and bloom, and for photo float/press.

- [x] **Step 5: Verify.** Run `npm run build`; all new TSX files must typecheck without adding dependencies. Inspect CSS: every selector is prefixed by `wd-`, `.womens-day-page`, or `html[data-landing="womens-day"]`; every new keyframe starts `wd-`. Count the maximum loose decorations: mobile background 8 + stars 4 + bouquet burst 24 = 36, desktop 14 + 6 + 40 = 60; welcome is removed on any interaction. Both remain below the spec's ceilings. Do not yet claim browser verification because Task 3 connects the route.
- [x] **Step 6: Conditional commit — SKIPPED (not authorized).** If authorized, stage the six task files, including the supplied image asset, and commit `feat: add floral womens day card and animations`. Otherwise continue with uncommitted changes.

---

### Task 3: Route, CSS isolation và hai HTML đầu vào

**Depends on:** 1, 2.

**Files:** Create `src/pages/CelebrationPage.tsx`, `20-10/index.html`; modify `src/App.tsx:1`, `src/main.tsx:1`, `src/style.css:3`, `vite.config.ts:1`. `index.html` gốc và `src/useSoundEffects.ts` không thay đổi.

**Interfaces:**
- Consumes: default `WomensDayPage` from Task 2; original App source and CSS from the current working tree, not a hard-coded historical Git version.
- Produces: default `CelebrationPage`, default `App`; DOM attributes `html[data-landing="celebration" | "womens-day" | "missing"]` and class `html.celebration-page` only on the old route. Every old CSS rule remains route-scoped with the same relative specificity.
- Build outputs: `dist/index.html`, `dist/20-10/index.html`, shared fingerprinted assets. No router, no runtime fetching, no SPA navigation.

- [x] **Step 1: Move the old page mechanically.** The following is a one-time transformation run only in the implementation worktree. It refuses to overwrite the new file and reads the existing working-tree App. PowerShell literal here-string prevents shell interpolation of JavaScript template literals.

```powershell
@'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const target = 'src/pages/CelebrationPage.tsx';
if (existsSync(target)) throw new Error('CelebrationPage already exists; inspect before repeating migration');
let source = readFileSync('src/App.tsx', 'utf8');
if (!source.includes('export default function App()') || !source.includes("from './useSoundEffects'")) {
  throw new Error('App differs from the inspected structure; preserve its current behavior when moving it');
}
source = source.replace("from './useSoundEffects'", "from '../useSoundEffects'")
  .replace('export default function App()', 'export default function CelebrationPage()')
  .replace('className={`page ', 'className={`page celebration-page ');
mkdirSync('src/pages', { recursive: true });
writeFileSync(target, source);
'@ | node --input-type=module
```

No change to JSX copy, original effects, timers, CSS order or audio behavior besides the file move and class marker. Inspect diff with rename detection after the new file is staged, if staging is authorized; otherwise compare the old App and new file directly.

- [x] **Step 2: Scope original CSS through its existing PostCSS parser.** `postcss` already exists in the lockfile as Vite's build dependency; do not add it to runtime dependencies. Run once. The marker prevents accidentally applying the transform twice. Do not regex-prefix whole CSS text because commas, media blocks and keyframe steps need structural handling.

```powershell
@'
import { readFileSync, writeFileSync } from 'node:fs';
import postcss from 'postcss';
const path = 'src/style.css';
const input = readFileSync(path, 'utf8');
const marker = 'Legacy selectors scoped to celebration route';
if (input.includes(marker)) throw new Error('CSS already scoped; do not apply twice');
const root = postcss.parse(input);
root.walkRules(rule => {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
    parent = parent.parent;
  }
  rule.selectors = rule.selectors.map(selector => {
    const s = selector.trim();
    if (s === ':root') return ':root:where(.celebration-page)';
    if (s === 'html') return 'html:where(.celebration-page)';
    return `:where(html.celebration-page) ${s}`;
  });
});
root.prepend(postcss.comment({ text: marker }));
writeFileSync(path, root.toString());
'@ | node --input-type=module
```

`:where` adds zero specificity. Universal selectors, h1/main/footer, media queries, reduced-motion rules and body/root scroll locks become route-specific; keyframe contents are untouched. `@import "tailwindcss"` remains global because both pages share its reset. New-page font/colors are defined in its own wrapper; body margin remains reset by Tailwind. Do not prefix selectors with a normal class in addition to this transform, which would increase specificity.

- [x] **Step 3: Replace route entry files.**

`src/App.tsx`:

```tsx
import { useLayoutEffect } from 'react';
import CelebrationPage from './pages/CelebrationPage';
import WomensDayPage from './pages/WomensDayPage';

export function routeFor(path: string): 'celebration' | 'womens-day' | 'missing' {
  const normalized = path.replace(/\/+$/, '') || '/';
  return normalized === '/' ? 'celebration' : normalized === '/20-10' ? 'womens-day' : 'missing';
}
export default function App() {
  const route = routeFor(window.location.pathname);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.landing = route;
    root.classList.toggle('celebration-page', route === 'celebration');
    return () => {
      root.classList.remove('celebration-page');
      delete root.dataset.landing;
    };
  }, [route]);
  if (route === 'celebration') return <CelebrationPage/>;
  if (route === 'womens-day') return <WomensDayPage/>;
  return <main style={{ maxWidth: '40rem', margin: '3rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}><h1>Không tìm thấy trang</h1><a href="/">Về trang chúc mừng</a></main>;
}
```

`src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { routeFor } from './App';
import './style.css';
import './viewport.css';

const route = routeFor(window.location.pathname);
document.documentElement.dataset.landing = route;
document.documentElement.classList.toggle('celebration-page', route === 'celebration');
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
```

The document marker is set before render, and App's layout cleanup removes it on unmount. StrictMode cleanup/setup restores it before painting. Route changes use full document navigation; no popstate listener or history interception is needed. Query/hash do not enter `routeFor`. `/20-10/index.html` is an implementation file, not an additional supported public route; do not advertise it as the card URL.

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'womens-day-html-entry',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const incoming = request as { url?: string };
          if (/^\/20-10(?:\?|$)/.test(incoming.url ?? '')) {
            incoming.url = incoming.url!.replace('/20-10', '/20-10/index.html');
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const incoming = request as { url?: string };
          if (/^\/20-10(?:\?|$)/.test(incoming.url ?? '')) {
            incoming.url = incoming.url!.replace('/20-10', '/20-10/index.html');
          }
          next();
        });
      },
    },
  ],
  build: { rollupOptions: { input: { main: 'index.html', womensDay: '20-10/index.html' } } },
});
```

Create `20-10/index.html`:

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
    <meta name="theme-color" content="#FFF8F0"/>
    <title>Pành ơi, 20/10 vui nha! 🌷</title>
    <meta name="description" content="Một chiếc thiệp hoa dành riêng cho Pành: lời chúc vui vẻ, một bó hoa bất ngờ và rất nhiều yêu thương."/>
    <meta property="og:title" content="Pành ơi, 20/10 vui nha! 🌷"/>
    <meta property="og:description" content="Một chiếc thiệp hoa dành riêng cho Pành: lời chúc vui vẻ, một bó hoa bất ngờ và rất nhiều yêu thương."/>
    <meta property="og:type" content="website"/>
    <link rel="icon" type="image/svg+xml" href="/brand-mark.svg"/>
  </head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
```

- [x] **Step 4: Verify shared foundations.** Run `npm run build` and `git diff --check`. Expected: both HTML outputs exist, no TypeScript errors, same original KOC metadata, unchanged lockfile/dependencies, no edits to old sound code. Use commands below to inspect actual output; these are read-only output checks, not a test runner.

```powershell
Get-Item dist\index.html, dist\20-10\index.html
Select-String -Path dist\index.html,dist\20-10\index.html -Pattern '<title>|og:title|description'
git diff -- package.json package-lock.json index.html src/useSoundEffects.ts
```

Do not add a catch-all Vercel rewrite. If the actual target host does not serve the directory entry at `/20-10`, add only the specific `/20-10` → `/20-10/index.html` internal rewrite after verifying the host configuration, then verify refresh and metadata again. Do not push/deploy merely to perform this check; report hosted verification pending when deployment is not authorized.

- [x] **Step 5: Conditional commit — SKIPPED (not authorized).** If authorized, stage only the six created/modified paths listed for this task (App, main, CSS, Vite config and both new files) and commit `feat: serve womens day card on separate route`. Otherwise continue without committing.

---

### Task 4: Xác minh spec và bàn giao

**Depends on:** 3.

**Files:** No new production files beyond the route-specific hosting configuration documented below. Fix only files from Tasks 1–3 if a check finds a defect. Update this plan's checkboxes and amend spec/plan only if an actual design decision changes. Do not create verification documents.

**Interfaces:**
- Consumes: built application, Task 1 state/sound contracts, Task 2 component contracts, Task 3 routing/HTML outputs.
- Produces: working local implementation plus concise final message stating actual checks, limitations, branch/worktree and changed files. Hosted/device checks are claimed only when performed.

- [x] **Step 1: Build and serve.** Run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4173`. Keep preview in a managed terminal session; do not launch visible helper windows. If that port is occupied, select a free port and use the actual address for all following checks. Inspect the emitted HTML and direct route responses:

```powershell
foreach ($cardPath in @('/', '/20-10', '/20-10/', '/20-10?from=card')) {
  $cardResponse = Invoke-WebRequest -UseBasicParsing -Uri ('http://127.0.0.1:4173' + $cardPath)
  [PSCustomObject]@{ Path = $cardPath; Status = $cardResponse.StatusCode; Title = [regex]::Match($cardResponse.Content, '<title>(.*?)</title>').Groups[1].Value }
}
```

Expected: the root has its KOC title, all three supported new-route variants have the 20/10 title, and HTML contains fingerprinted build asset links. Browser refresh also succeeds at both new-route slash variants. Open an unknown URL: either the preview host supplies 404 or App displays its missing-page view; never show the 20/10 card by fallback accident.

- [ ] **Step 2: Review visual layout.** Use the available browser/computer-use tools, reading their skill/instructions before controlling the browser. Open both local routes. Inspect the 20/10 card at viewport widths 360, 390, 430 and 1280px, plus exact 360×568 and 844×390 dimensions. Visit every face and all text pages; verify no horizontal/vertical scrolling or clipped reading text, receiver image, gift actions and sender face. At desktop verify the cover composition, at mobile verify the compact cover and always-visible face navigation. Increase zoom/text size to 200% and ensure long messages split into pages instead of growing the viewport or clipping. Capture temporary previews only in an ignored local location if needed; do not add review artifacts to docs or Git.

- [ ] **Step 3: Review choreography and state.** Reload once to see the opening finish within 2.4s; main copy must remain visible throughout. Inspect three bouquet clicks for palette order, seven flowers per bouquet, bloom/ribbon and bounded petals. The seventh compliment click returns to the first sentence; no consecutive duplicates. Click photo after receiving flowers: bouquet stays; six hearts appear by the photo. Click bot twice: prompts only; third click: glasses, raised flower and secret; later clicks do not remove glasses. Interleave rapid bouquet/compliment/photo/bot taps at least 20 times; only the latest transient session survives, particles do not accumulate, content persists when the session finishes. Use browser inspection to verify new-frame React render loops are absent and particle containers do not grow with repeated actions.

  Review the supplied sender photo too: no image request before receiving flowers; after the first bouquet gesture, the sender face becomes unlocked without adding page height; use its button or face navigation to view the image. While loading it keeps its ratio and displays the waiting text; when loaded, the full face, rose and hand remain visible. Its entrance runs once without extra sound, including after navigating away and back. Change to compliments/photo/bot and receive another bouquet: the sender section stays and does not reload/re-enter. Block only `sender-rose.png` and verify its humorous fallback while the original Pành photo, bouquet and all actions continue working. The section heading/caption must not claim a name or relationship the user has not supplied.

- [ ] **Step 4: Review audio through actual gestures.** Fresh load, scroll and hover are silent. Bouquet, compliment and photo sound softly once per action; first two bot taps are silent, third and subsequent bot taps produce short beeps. No sound toggle exists and no background track plays. Rapid taps replace sounds; no delayed resume sound follows a newer action. Hide the tab during sound, return: no resumed playback. Repeat with browser audio blocked if available: text and interactions must work, with no uncaught promise rejection. Close or leave the page while audio plays: it stops. Do not claim that system silent mode can be bypassed.

- [ ] **Step 5: Review motion controls and lifecycle.** Pause motion while the bouquet animates: particles disappear, bot/flowers settle, picture and text persist; subsequent interactions change content and still play sound. Re-enable: only ambient motion returns. Enable system/emulated reduced motion before a fresh load and while a session is running: no moving opening or particles; all actions and sound remain usable; the motion button cannot override system preference. Hide/show tab during opening and during bot animation: no replay or stuck arm. Resize across 640px during a burst: no new interaction or accumulating particles. Verify StrictMode does not create duplicate opening sessions or audio contexts. In the browser block the customer image and refresh: fallback remains usable. Use keyboard Tab/Enter/Space; one H1, visible focus, sensible order, one live-region announcement per action.

- [ ] **Step 6: Regression and external boundaries.** Open `/` at the same small/large dimensions and compare with its current source behavior: original title, copy, image, one-screen layout, trophy praise, both celebration sounds, confetti, three-tap bot, visibility and reduced motion. Verify navigating between documents leaves no old scroll lock on `/20-10`. Check real iPhone Safari/Chrome and Android Chrome only if devices are available; report unverified devices explicitly. Hosted direct-link refresh and metadata remain pending until an authorized deployment is available. Do not substitute desktop simulation for device confirmation or deploy automatically.

- [x] **Step 7: Final static gate and handoff.** After fixes, run `npm run build`, `git diff --check`, `git status --short` and inspect the final diff. Expected: two built HTML files, no errors, no unrelated changes, no new runtime packages, no modified KOC assets/audio. If code changed after the last build, repeat the build for that change; otherwise do not repeat already-passed gates. Stop the preview session when no longer needed. Report checks, pending device/host verification, current worktree/branch and no commit/push/deploy unless separately authorized. If authorized, commit only actual fixes under `fix: refine womens day card behavior`; do not create an empty verification commit.

## Spec coverage and self-review

| Spec requirements | Owning tasks |
| --- | --- |
| Sections 1–4: scope, two routes, exact copy, six compliments | 1, 2, 3 |
| Section 5: palette, layout, image fallback, stage growth | 2, 4 |
| Section 6: all ambient/opening animations, timing, wrappers | 1, 2, 4 |
| Sections 7.1–7.6: bouquet, compliments, photo, bot, cancellation, pause, stage modes | 1, 2, 4 |
| Section 7.7: light sound always ready, no mute/background, overlap/resume/cleanup | 1, 2, 4 |
| Section 7.8: supplied sender photo, first-receive reveal, persistence, full landscape ratio and loading/error fallback | 1, 2, 4 |
| Sections 8–9: component isolation, CSS, direct route, two HTML/metadata, unknown path | 2, 3, 4 |
| Section 10: particle budgets, reduced motion, lifecycle, keyboard, live region, no API/storage | 1, 2, 3, 4 |
| Section 11: every acceptance checkbox | Task 4 steps 1–7 |
| Section 12: no test runner, actual build scripts, worktree and Git boundaries | Global constraints, Tasks 1–4 |

Review rules: signatures in Task 2 consume the exact exports of Task 1; App consumes the default export built in Task 2; no parallel tasks write the same file. The code blocks are implementation instructions inside this document, not files already applied. Asset fallback, muted/blocked browser audio, rapid input and visibility all have explicit outcomes. The plan creates no new production service, dependency, tracking document or unrelated refactor.

Authoring validation: TS/TSX snippets were assembled into a virtual TypeScript program using this project's tsconfig and the mechanically moved legacy page; the compiler reported zero diagnostics. The CSS block parsed with the existing PostCSS parser. These are document/code-snippet checks only: no production files were created, no application build or browser/device verification was performed during plan writing. Visual quality, runtime behavior, layout and host behavior still require Task 4.

Execution mode: checkout hiện tại với `.agents/skills/executing-plans/SKILL.md`; người dùng cấm worktree, cho phép subagent; không tự commit/merge/push/publish.


## Execution decisions and verification (2026-10-20)

- User override: no worktree; subagents allowed. Implementation is in the current checkout on feature/womens-day-landing, without staging/commits/push/deploy. Task 1 was delegated on its own files; the agent also performed a final read-only review.
- Tasks 1–3 are implemented. Conditional commit steps are recorded as skipped, not as performed.
- Local preview exposed a bare-path metadata defect: /20-10 initially served root HTML while /20-10/ served the new entry. Added specific Vite dev/preview middleware and vercel.json rewrite for /20-10 to /20-10/index.html. No catch-all rewrite. Local HTTP checks now return the correct title for /, /20-10, /20-10/ and query variants. Production hosting remains unverified.
- PowerShell npm argument forwarding did not preserve preview flags; run node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4175 --strictPort instead. Local socket access needed the approved elevated preview process.
- Sender loading/error uses grid flow so larger text can grow. Its entrance is marked completed on animation end or when hidden/reduced/paused to prevent replay. FlowerBot is keyed by interaction run inside the stable button so repeated gestures restart the arm animation.
- Browser checks completed: 360×568, 390×844, 430×932, 1280×800, 844×390; no horizontal overflow, correct responsive columns, readable complete content; receiver and sender images loaded. Compliment, bouquet, three-tap bot, keyboard Enter and motion pause worked; twenty alternating clicks retained one stage and sender with bounded particles. Browser warning/error log was empty. Root KOC title, image, scroll lock, trophy praise and primary celebration interaction were checked before the no-scroll follow-up; latest regression is recorded below.
- Task 4 checkboxes remain open for unperformed parts: full 200% zoom checks, OS reduced-motion switching, blocked-image/audio cases, detailed visibility/StrictMode instrumentation, subjective audio loudness, and real iPhone/Android/production verification. No test runner was executed. These limits must be reported, not marked as passed.
- Screenshot previews live only under ignored .preview/. No additional docs were created.

Final gate: npm run build succeeded (40 modules; two HTML entries), git diff --check passed. Original package/lockfile/root HTML/sound hook have no diff. The new route returned its correct bare-path HTML title and no sender image existed in DOM before receiving flowers; afterwards the image loaded at natural width 2730 and the bouquet contained seven flowers. Final console warning/error log was empty. Preview remains available on http://127.0.0.1:4175/20-10 for user inspection; screenshots are .preview/womens-day-desktop.png and .preview/womens-day-mobile.png. Browser viewport override was reset. No worktree, stage, commit, push or deployment was performed.


## No-scroll follow-up — user-authorized implementation (2026-10-20)

The user required every landing to be no-scroll and then authorized updating /20-10. This supersedes all earlier plan wording about page scrolling, growing stages, two-column wishes or appending the sender section. No worktree, tests, staging, commit or deployment.

- [x] Replace the long document with four persistent hidden/inactive faces: cover, full wishes, gift/bot, sender. Footer navigation stays inside card; buttons switch state without route changes or scrolling. Keep interactions/audio state across faces.
- [x] Add src/viewport.css and import it after legacy CSS in main.tsx; html/body/root are constrained to one dynamic viewport. Preserve the old route layout.
- [x] Add PagedText: text measured with an aria-hidden same-font probe, ResizeObserver/font/viewport cleanup, word-based pages, previous/next controls, no text loss or auto-scroll. Default announcements are disabled because interactions already have one live region; wishes opt in.
- [x] Refactor GiftStage and all receiver/sender/loading/error text regions to fit fixed available space; artwork shrinks, reading font does not. Compact gift controls keep bot accessible through a labeled icon button. Source images stay unchanged.
- [x] Update focus handling: maintain focus on stable navigation or move from a hidden/disabled control to the new face with preventScroll.
- [x] Final build and local browser verification completed; remaining device/zoom limits are recorded below.

Follow-up implementation contract: PagedText({text, className?, announce?}) takes a parent with definite height and room for at least one text line plus its 44px navigation row when paged. Page root supplies that geometry; no nested scroll containers.

### PagedText implementation

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

type Page = { text: string; start: number };
type Pagination = { source: string; pages: Page[]; index: number };

const navigationStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
  minHeight: '44px', flexShrink: 0,
} as const;
const buttonStyle = { minWidth: '44px', minHeight: '44px', padding: '4px 10px', font: 'inherit' } as const;
const copyStyle = { margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } as const;

/** The parent must provide enough height for one text line and the navigation row. */
export default function PagedText({ text, className = '', announce = false }: { text: string; className?: string; announce?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLParagraphElement>(null);
  const navigationProbe = useRef<HTMLDivElement>(null);
  const readingPosition = useRef(0);
  const [pagination, setPagination] = useState<Pagination>({ source: text, pages: [{ text, start: 0 }], index: 0 });

  useLayoutEffect(() => {
    const element = root.current;
    const measure = probe.current;
    const controls = navigationProbe.current;
    if (!element || !measure || !controls) return;
    let disposed = false;
    let frame = 0;
    readingPosition.current = 0;

    const paginate = () => {
      if (disposed) return;
      // Layout dimensions stay stable while the surrounding card animates.
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width <= 0 || height <= 0) return;
      const fits = (value: string, availableHeight: number) => {
        measure.textContent = value;
        return measure.offsetHeight <= availableHeight - 1 && measure.scrollWidth <= measure.clientWidth + 1;
      };
      const pages: Page[] = [];
      if (fits(text, height)) {
        pages.push({ text, start: 0 });
      } else {
        const availableHeight = Math.max(0, height - controls.offsetHeight - 8);
        // Store offsets into the original string so no whitespace or content is lost.
        const boundaries = [0];
        const words = /\S+\s*|\s+/gu;
        for (const match of text.matchAll(words)) boundaries.push(match.index! + match[0].length);
        let start = 0;
        while (start < text.length) {
          let low = boundaries.findIndex(boundary => boundary > start);
          let high = boundaries.length - 1;
          let end = start;
          while (low >= 0 && low <= high) {
            const middle = Math.floor((low + high) / 2);
            if (fits(text.slice(start, boundaries[middle]), availableHeight)) {
              end = boundaries[middle];
              low = middle + 1;
            } else high = middle - 1;
          }
          if (end === start) {
            // Long words can wrap across pages; never discard or ellipsize them.
            const nextBoundary = boundaries.find(boundary => boundary > start) ?? text.length;
            const characters = Array.from(text.slice(start, nextBoundary));
            let count = 0;
            for (const character of characters) {
              if (!fits(text.slice(start, start + count + character.length), availableHeight)) break;
              count += character.length;
            }
            // A parent smaller than one line cannot be solved by text pagination.
            end = start + (count || characters[0]?.length || 1);
          }
          pages.push({ text: text.slice(start, end), start });
          start = end;
        }
        if (!pages.length) pages.push({ text: '', start: 0 });
      }
      const anchor = readingPosition.current;
      let index = pages.findIndex((page, i) => page.start <= anchor && (i === pages.length - 1 || pages[i + 1].start > anchor));
      if (index < 0) index = 0;
      setPagination(previous => {
        if (previous.source === text && previous.index === index && previous.pages.length === pages.length && previous.pages.every((page, i) => page.text === pages[i].text)) return previous;
        return { source: text, pages, index };
      });
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paginate);
    };
    paginate();
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    observer.observe(controls);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    void document.fonts.ready.then(schedule);
    // A font-size preference can change without resizing the fixed-height parent.
    const fontObserver = new ResizeObserver(schedule);
    fontObserver.observe(measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      fontObserver.disconnect();
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [text]);

  const current = pagination.source === text ? pagination : { source: text, pages: [{ text, start: 0 }], index: 0 };
  const paged = current.pages.length > 1;
  const go = (index: number) => {
    readingPosition.current = current.pages[index].start;
    setPagination({ ...current, index });
  };
  return <div ref={root} className={`wd-text ${className}`} style={{ position: 'relative', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: paged ? '8px' : 0 }}>
    <div className="wd-text-body" style={{ flex: '1 1 0', minHeight: 0, minWidth: 0 }}>
      <p className="wd-text-copy" style={copyStyle} aria-live={announce ? 'polite' : undefined} aria-atomic={announce ? true : undefined}>{current.pages[current.index].text}</p>
    </div>
    {paged && <nav className="wd-text-nav" aria-label="Các đoạn nội dung" style={navigationStyle}>
      <button type="button" aria-label="Đoạn trước" disabled={current.index === 0} onClick={() => go(current.index - 1)} style={buttonStyle}>←</button>
      <span className="wd-text-status" aria-live="polite">{current.index + 1} / {current.pages.length}</span>
      <button type="button" aria-label="Đoạn sau" disabled={current.index === current.pages.length - 1} onClick={() => go(current.index + 1)} style={buttonStyle}>→</button>
    </nav>}
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', visibility: 'hidden', pointerEvents: 'none' }}>
      <p ref={probe} className="wd-text-copy" style={copyStyle} />
      <div ref={navigationProbe} className="wd-text-nav" style={navigationStyle}>
        <span style={{ ...buttonStyle, boxSizing: 'border-box' }}>←</span><span>1 / 1</span><span style={{ ...buttonStyle, boxSizing: 'border-box' }}>→</span>
      </div>
    </div>
  </div>;
}
```

### Shared viewport stylesheet

```css
/* All landing routes use one viewport. Each page must fit its own content. */
html, body { width:100%; height:100%; margin:0; overflow:hidden; overscroll-behavior:none; }
#root { width:100%; height:100dvh; overflow:hidden; }
```

No-scroll final verification: npm run build passed (42 modules, both HTML entries); git diff --check passed. Current application is running via Vite dev at http://127.0.0.1:5173/20-10, not the historical preview URL above. Browser checked every face at 360×568, 390×844, 430×932, 844×390, 1280×800, 640×400 and the browser actual minimum 240×284. Document dimensions matched viewport, visible face/read regions had no overflow. Smallest cover photo feedback remains visible without losing image access; return via brand resets the cover note. Letter pagination, gift, compliments, sender unlock, focus handoff and root-route regression were checked. Page state persists across faces. Console warning/error log was empty.

Final refinements: text pagination measures client/offset layout dimensions so entrance transforms do not affect fit. Sender entrance is marked consumed even when leaving its face mid-animation, preventing replay. Hidden measurement probes are aria-hidden. Screenshot: .preview/womens-day-no-scroll-mobile.png. No test runner, commit, push or deployment. Actual browser zoom 200%, OS text-size preferences and physical mobile devices remain unverified; small viewport checks are not presented as proof of those cases.

Final user instruction (2026-10-20): stop the application, commit and push the current implementation. Dev process was stopped; no listeners remain on 5173, 4173 or 4175. The final aggregate commit includes the requested skills, AGENTS.md, spec/plan, 20/10 implementation and supplied image. Build already passed for unchanged source; no additional test runner or deployment. Earlier skipped-commit notes describe the previous authorization state.
