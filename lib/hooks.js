'use client';

import { useState, useEffect, useRef } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

// Shared behaviour for modal dialogs and drawers. Attach the returned ref to the dialog panel (the element that also
// carries role="dialog"). While it is open: Escape closes it, Tab stays inside, the page behind cannot scroll, focus
// starts on `initialFocus` (a ref) or the first control, and on close focus returns to whatever had it before.
export function useDialog(onClose, initialFocus) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });
  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = () => (dialog ? [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0) : []);
    const first = (initialFocus && initialFocus.current) || controls()[0];
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== 'Tab' || !dialog) return;
      const nodes = controls();
      if (nodes.length === 0) { e.preventDefault(); return; }
      const active = document.activeElement;
      if (!dialog.contains(active)) { e.preventDefault(); nodes[0].focus(); }
      else if (e.shiftKey && active === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      else if (!e.shiftKey && active === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
    // Runs once per open; later changes to onClose are picked up through closeRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return dialogRef;
}

export function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}
