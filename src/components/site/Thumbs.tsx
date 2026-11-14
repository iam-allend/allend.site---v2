'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FrameView, type Frame } from './ProjectMedia';

type Pop = { index: number; left: number; top: number };

const POP_WIDTH = 340;
const POP_HEIGHT = 300;

/**
 * Clickable project frames. Hover/focus shows a larger pop; click opens a lightbox.
 * `className` picks the layout: "thumbs" (row of three, with hover pop) or "mosaic" (detail gallery).
 */
export function Thumbs({ title, frames, label, className = 'thumbs' }: {
  title: string;
  frames: Frame[];
  label: string;
  className?: string;
}) {
  const [pop, setPop] = useState<Pop | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setFinePointer(matchMedia('(hover: hover) and (pointer: fine)').matches);
    const hide = () => setPop(null);
    addEventListener('scroll', hide, { passive: true });
    return () => removeEventListener('scroll', hide);
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) el.close();
  }, [open]);

  const showPop = (index: number, target: HTMLElement) => {
    if (!finePointer || className !== 'thumbs') return;
    const box = target.getBoundingClientRect();
    const left = Math.min(Math.max(12, box.left + box.width / 2 - POP_WIDTH / 2), innerWidth - POP_WIDTH - 12);
    const above = box.top - POP_HEIGHT - 12;
    setPop({ index, left, top: above > 72 ? above : box.bottom + 12 });
  };

  const step = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + frames.length) % frames.length));

  return (
    <>
      <div className={className}>
        {frames.map((frame, i) => (
          <button
            key={i}
            type="button"
            className={className === 'thumbs' ? undefined : 'rv'}
            aria-label={`${label} ${i + 1}`}
            onPointerEnter={(e) => showPop(i, e.currentTarget)}
            onPointerLeave={() => setPop(null)}
            onFocus={(e) => showPop(i, e.currentTarget)}
            onBlur={() => setPop(null)}
            onClick={() => { setPop(null); setOpen(i); }}
          >
            <FrameView frame={frame} />
          </button>
        ))}
      </div>

      {pop && createPortal(
        <div className="pop on" style={{ left: pop.left, top: pop.top }} aria-hidden="true">
          <FrameView frame={frames[pop.index]} eager />
          <p><span>{title}</span><span>{pop.index + 1}/{frames.length}</span></p>
        </div>,
        document.body,
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={title}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {open !== null && (
          <div className="lb-inner">
            <FrameView frame={frames[open]} eager />
            <div className="lb-bar">
              <p><strong>{title}</strong><span>{open + 1} / {frames.length}</span></p>
              <div className="lb-nav">
                <button type="button" className="icon-btn" aria-label="←" onClick={() => step(-1)}>←</button>
                <button type="button" className="icon-btn" aria-label="→" onClick={() => step(1)}>→</button>
                <button type="button" className="icon-btn" aria-label="✕" onClick={() => setOpen(null)}>✕</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
