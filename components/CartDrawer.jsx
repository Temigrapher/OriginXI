'use client';

import { X, Trash2, Minus, Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import { cartWaLink } from '@/lib/whatsapp';

export default function CartDrawer({ items, onUpdateQty, onRemove, onClose, notices = [], onDismissNotices, canIncrease = () => true }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(10,10,10,0.65)' }} onClick={onClose}>
      <div
        className="drawer w-full max-w-md h-full overflow-y-auto scrollbar-thin p-6 flex flex-col"
        style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line-soft)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="f-display font-bold text-3xl">Your Cart</h2>
          <button onClick={onClose} className="p-1.5 rounded-md" style={{ border: '1px solid var(--line-soft)' }}>
            <X size={18} />
          </button>
        </div>

        {notices.length > 0 && (
          <div className="mb-5 p-3 rounded-lg flex items-start gap-2" style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid var(--line)' }}>
            <AlertTriangle size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              {notices.map((n, i) => (
                <p key={i} className="text-xs" style={{ color: 'var(--cream)' }}>{n}</p>
              ))}
            </div>
            <button onClick={onDismissNotices} className="text-xs shrink-0" style={{ color: 'var(--cream-dim)' }} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>Your cart is empty — add a kit to get started.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3 flex-1">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 p-3 rounded-lg" style={{ border: '1px solid var(--line-soft)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="f-display font-bold text-base leading-tight">{item.club}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>
                      {item.category}{item.size ? ` · Size ${item.size}` : ''}
                    </p>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--gold-bright)' }}>
                      ₦{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => onRemove(item.key)} style={{ color: '#D9776F' }}>
                      <Trash2 size={15} />
                    </button>
                    <div className="flex items-center gap-2 rounded-full px-1" style={{ border: '1px solid var(--line-soft)' }}>
                      <button onClick={() => onUpdateQty(item.key, -1)} className="p-1"><Minus size={13} /></button>
                      <span className="f-label text-xs w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.key, 1)}
                        disabled={!canIncrease(item)}
                        className="p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Total</span>
                <span className="f-display font-bold text-2xl" style={{ color: 'var(--gold-bright)' }}>₦{total.toLocaleString()}</span>
              </div>
              <a
                href={cartWaLink(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <MessageCircle size={16} strokeWidth={2.5} />
                Checkout on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
