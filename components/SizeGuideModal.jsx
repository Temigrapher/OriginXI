'use client';

import { useId } from 'react';
import { X } from 'lucide-react';
import { SIZE_GUIDE } from '@/lib/constants';
import { useDialog } from '@/lib/hooks';

export default function SizeGuideModal({ onClose }) {
  const titleId = useId();
  const dialogRef = useDialog(onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,10,10,0.75)' }} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--line-soft)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="f-display font-bold text-2xl">Size Guide</h3>
          <button onClick={onClose} className="p-1.5 rounded-md" style={{ border: '1px solid var(--line-soft)' }} aria-label="Close size guide">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--cream-dim)' }}>
          Standard replica kit sizing — most kits run true to this.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line-soft)' }}>
              <th className="f-label text-left pb-2 text-[10px]" style={{ color: 'var(--cream-dim)' }}>Size</th>
              <th className="f-label text-left pb-2 text-[10px]" style={{ color: 'var(--cream-dim)' }}>Chest</th>
              <th className="f-label text-left pb-2 text-[10px]" style={{ color: 'var(--cream-dim)' }}>Height</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.map((row) => (
              <tr key={row.size} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <td className="py-2.5 font-semibold" style={{ color: 'var(--gold-bright)' }}>{row.size}</td>
                <td className="py-2.5 pr-2" style={{ color: 'var(--cream)' }}>{row.chest}</td>
                <td className="py-2.5" style={{ color: 'var(--cream)' }}>{row.height}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-4" style={{ color: 'var(--cream-dim)' }}>
          Between sizes, or unsure? Send your height and usual T-shirt size on WhatsApp and we'll recommend a fit.
        </p>
      </div>
    </div>
  );
}