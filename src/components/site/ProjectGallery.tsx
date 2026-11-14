'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FrameView, type Frame } from './ProjectMedia';

type Labels = { prev: string; next: string; open: string; close: string; photo: string };

const pad = (n: number) => String(n).padStart(2, '0');
const SWIPE_PX = 40;
/** Autoplay interval. Passed to CSS as --autoplay, so the timer bar and the switch share one clock. */
export const AUTOPLAY_MS = 10000;

/**
 * Project media viewer.
 * Stage: the selected image on a dark stage lit by a blurred copy of itself,
 * with a glass HUD (progress, counter, prev/next, full screen).
 * Rail: every image as a thumbnail (right on desktop, a strip on phones).
 * Theater: full-screen overlay showing the image uncropped with a filmstrip.
 * Arrow keys, swipe and the HUD all move through the same index.
 * Autoplay: a timer bar under the image fills over AUTOPLAY_MS and its animationend
 * moves to the next image. Pointing at, focusing or zooming the viewer, or scrolling it
 * off screen, pauses the bar where it is. Reduced motion turns autoplay off.
 */
export function ProjectGallery({ frames, title, labels }: { frames: Frame[]; title: string; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [theater, setTheater] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const section = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true); // off for reduced motion
  const [held, setHeld] = useState(false); // pointer over or focus inside
  const [onScreen, setOnScreen] = useState(false);

  const count = frames.length;
  const many = count > 1;
  const frame = frames[index];
  const first = frames[0];
  const ratio = first?.width && first?.height ? Math.min(Math.max(first.width / first.height, 4 / 3), 21 / 9) : 16 / 10;

  const step = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const autoplay = many && playing;
  const running = autoplay && !held && !theater && onScreen;

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Open / close the theater dialog.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (theater && !el.open) el.showModal();
    if (!theater && el.open) el.close();
  }, [theater]);

  // Keep the active thumbnail in view and warm the cache for its neighbours.
  useEffect(() => {
    // Scroll only the rail (scrollIntoView could also move the page while autoplay runs).
    const box = rail.current;
    const active = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && active) {
      const vertical = box.scrollHeight > box.clientHeight;
      box.scrollTo({
        top: vertical ? active.offsetTop - box.clientHeight / 2 + active.offsetHeight / 2 : 0,
        left: vertical ? 0 : active.offsetLeft - box.clientWidth / 2 + active.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
    for (const d of [1, -1]) {
      const src = frames[(index + d + count) % count]?.src;
      if (src) new Image().src = src;
    }
  }, [index, frames, count]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!many) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => { swipe.current = { x: e.clientX, moved: false }; },
    onPointerMove: (e: React.PointerEvent) => {
      if (swipe.current && Math.abs(e.clientX - swipe.current.x) > 8) swipe.current.moved = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = swipe.current;
      if (s && many && Math.abs(e.clientX - s.x) > SWIPE_PX) step(e.clientX < s.x ? 1 : -1);
    },
  };
  const wasSwipe = () => swipe.current?.moved === true;

  const scrollRail = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const vertical = el.scrollHeight > el.clientHeight;
    el.scrollBy({ [vertical ? 'top' : 'left']: dir * (vertical ? el.clientHeight : el.clientWidth) * 0.8, behavior: 'smooth' });
  };

  const thumbs = (variant: 'rail' | 'film') =>
    frames.map((f, i) => (
      <button
        key={i}
        type="button"
        className="thumb"
        aria-current={i === index ? 'true' : undefined}
        aria-label={`${labels.photo} ${i + 1}`}
        onClick={() => setIndex(i)}
      >
        <FrameView frame={f} />
        {variant === 'rail' && <span className="thumb-no data">{pad(i + 1)}</span>}
      </button>
    ));

  const hudButtons = (inTheater: boolean) => (
    <div className="hud-btns">
      {many && <button type="button" className="hud-btn" onClick={() => step(-1)} aria-label={labels.prev}><Chevron dir="left" /></button>}
      {many && <button type="button" className="hud-btn" onClick={() => step(1)} aria-label={labels.next}><Chevron dir="right" /></button>}
      {inTheater
        ? <button type="button" className="hud-btn" onClick={() => setTheater(false)} aria-label={labels.close}><CloseIcon /></button>
        : <button type="button" className="hud-btn" onClick={() => setTheater(true)} aria-label={labels.open}><ExpandIcon /></button>}
    </div>
  );

  return (
    <section
      ref={section}
      className={`viewer rv${many ? '' : ' single'}${running ? '' : ' paused'}`}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
      style={{ '--ratio': ratio.toFixed(3), '--autoplay': `${AUTOPLAY_MS}ms` } as React.CSSProperties}
      onKeyDown={onKey}
      aria-roledescription="gallery"
      aria-label={title}
    >
      <div className="stage" {...swipeHandlers}>
        {frame.src && <span className="ambient" style={{ backgroundImage: `url("${frame.src}")` }} aria-hidden="true" />}
        <button
          key={index}
          type="button"
          className="stage-media"
          onClick={() => !wasSwipe() && setTheater(true)}
          aria-label={`${labels.open}: ${labels.photo} ${index + 1}`}
        >
          <FrameView frame={frame} eager />
        </button>

        {autoplay && (
          // Remounts per image so the fill restarts; finishing the fill advances the gallery.
          <span key={`timer-${index}`} className="stage-timer" aria-hidden="true" onAnimationEnd={() => step(1)} />
        )}

        <div className="hud">
          {many && (
            <div className="hud-progress" aria-hidden="true">
              {frames.map((_, i) => (
                // The active segment remounts on every change so its fill animation restarts.
                <i key={i === index ? `on-${index}` : i} className={i === index ? 'on' : i < index ? 'past' : undefined} />
              ))}
            </div>
          )}
          <div className="hud-row">
            <span className="hud-count data" aria-live="polite">
              {pad(index + 1)} <span>/ {pad(count)}</span>
            </span>
            {hudButtons(false)}
          </div>
        </div>
      </div>

      {many && (
        <div className="rail-wrap">
          <button type="button" className="rail-step up" onClick={() => scrollRail(-1)} aria-label={labels.prev} tabIndex={-1}><Chevron dir="up" /></button>
          <div className="rail" ref={rail} role="group" aria-label={labels.photo}>{thumbs('rail')}</div>
          <button type="button" className="rail-step down" onClick={() => scrollRail(1)} aria-label={labels.next} tabIndex={-1}><Chevron dir="down" /></button>
        </div>
      )}

      <dialog
        ref={dialog}
        className="theater"
        aria-label={title}
        onClose={() => setTheater(false)}
        onKeyDown={onKey}
        onClick={(e) => e.target === e.currentTarget && setTheater(false)}
      >
        {theater && (
          <>
            <header className="theater-bar">
              <strong>{title}</strong>
              <span className="hud-count data">{pad(index + 1)} <span>/ {pad(count)}</span></span>
              {hudButtons(true)}
            </header>
            <div className="theater-stage" {...swipeHandlers} onClick={(e) => e.target === e.currentTarget && setTheater(false)}>
              {frame.src && <span className="ambient" style={{ backgroundImage: `url("${frame.src}")` }} aria-hidden="true" />}
              <div key={index} className="theater-media"><FrameView frame={frame} eager /></div>
            </div>
            {many && <div className="filmstrip">{thumbs('film')}</div>}
          </>
        )}
      </dialog>
    </section>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' | 'up' | 'down' }) {
  const d = { left: 'M15 6l-6 6 6 6', right: 'M9 6l6 6-6 6', up: 'M6 15l6-6 6 6', down: 'M6 9l6 6 6-6' }[dir];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}

function ExpandIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
