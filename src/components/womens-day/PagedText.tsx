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
