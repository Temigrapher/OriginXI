'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/lib/hooks';

// Full-screen photo viewer, one instance for the whole page (like SizeGuideModal) so it is never trapped
// inside a card. Swipe, the arrow buttons or the arrow keys move between photos; tapping a photo zooms it.
export default function PhotoLightbox({ photos, startIndex = 0, title, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const stripRef = useRef(null);
  const closeRef = useRef(null);
  const many = photos.length > 1;

  // On open: land on the tapped photo, lock the page behind, move focus in. On close: undo all three.
  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (stripRef.current) stripRef.current.scrollLeft = startIndex * stripRef.current.clientWidth;
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
    // Runs once per open; startIndex is only the starting point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i) => {
    const el = stripRef.current;
    if (!el || i < 0 || i >= photos.length) return;
    setZoomed(false);
    el.scrollTo({ left: i * el.clientWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  // Keep Tab inside the dialog while it is open.
  const trapFocus = (e) => {
    const root = dialogRef.current;
    const nodes = root ? [...root.querySelectorAll('button:not([disabled])')] : [];
    if (nodes.length === 0) { e.preventDefault(); return; }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (!root.contains(active)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  // Re-bound every render so it always sees the current photo (cheap, and avoids stale closures).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') goTo(index + 1);
      else if (e.key === 'ArrowLeft') goTo(index - 1);
      else if (e.key === 'Tab') trapFocus(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onScroll = (e) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / (el.clientWidth || 1));
    if (i !== index) {
      setIndex(i);
      setZoomed(false);
    }
  };

  // Zoom in around the tapped point; tap again to zoom out. While zoomed, side-swiping is off so the photo can be panned.
  const toggleZoom = (e) => {
    if (zoomed) { setZoomed(false); return; }
    const img = e.currentTarget;
    const slide = img.parentElement;
    const rect = img.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    setZoomed(true);
    requestAnimationFrame(() => {
      slide.scrollLeft = fx * slide.scrollWidth - slide.clientWidth / 2;
      slide.scrollTop = fy * slide.scrollHeight - slide.clientHeight / 2;
    });
  };

  const chrome = { background: 'rgba(10,10,10,0.6)', border: '1px solid var(--line-soft)', color: 'var(--cream)' };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'var(--pitch)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="absolute top-0 inset-x-0 z-10 flex items-center px-3 pb-2 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        {many && (
          <span data-counter aria-live="polite" className="f-label text-xs px-2.5 py-1 rounded-full" style={chrome}>
            {index + 1} / {photos.length}
          </span>
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="pointer-events-auto ml-auto p-2 rounded-full"
          style={chrome}
        >
          <X size={20} />
        </button>
      </div>

      <div
        ref={stripRef}
        data-viewer-strip
        onScroll={onScroll}
        className="oxi-strip flex-1 min-h-0 flex snap-x snap-mandatory"
        style={{ overflowX: zoomed ? 'hidden' : 'auto' }}
      >
        {photos.map((src, i) => (
          <div
            key={`${src}-${i}`}
            data-viewer-slide
            className="w-full shrink-0 snap-center overflow-auto flex"
            onClick={(e) => { if (e.target === e.currentTarget && !zoomed) onClose(); }}
          >
            <img
              src={src}
              alt={many ? `${title} kit, photo ${i + 1} of ${photos.length}` : `${title} kit`}
              draggable={false}
              decoding="async"
              onClick={i === index ? toggleZoom : undefined}
              className="m-auto select-none"
              style={zoomed && i === index
                ? { width: '220%', maxWidth: 'none', height: 'auto', flexShrink: 0, cursor: 'zoom-out' }
                : { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full"
            style={{ ...chrome, opacity: index === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === photos.length - 1}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full"
            style={{ ...chrome, opacity: index === photos.length - 1 ? 0.35 : 1 }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}
