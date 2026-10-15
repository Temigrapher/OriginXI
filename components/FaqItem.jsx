'use client';

import { useState, useId } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">{item.q}</span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--gold)' }} /> : <ChevronDown size={16} style={{ color: 'var(--gold)' }} />}
      </button>
      <p id={panelId} hidden={!open} className="px-4 pb-3.5 text-sm" style={{ color: 'var(--cream-dim)' }}>{item.a}</p>
    </div>
  );
}
