'use client';

import { useState } from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import ProductForm from './ProductForm';

export default function AdminDrawer({ products, onSave, onDelete, onClose, passcode }) {
  const [editingId, setEditingId] = useState('__new__');
  const editingProduct = editingId === '__new__' ? null : products.find((p) => p.id === editingId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(10,10,10,0.65)' }} onClick={onClose}>
      <div
        className="drawer w-full max-w-md h-full overflow-y-auto scrollbar-thin p-6"
        style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line-soft)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="f-display font-bold text-3xl">Manage Catalog</h2>
          <button onClick={onClose} className="p-1.5 rounded-md" style={{ border: '1px solid var(--line-soft)' }} aria-label="Close catalog manager">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setEditingId('__new__')}
            className="chip active rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1.5"
          >
            <Plus size={15} /> Add new kit
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
          <ProductForm
            key={editingId}
            initial={editingProduct}
            passcode={passcode}
            onSave={async (p) => { await onSave(p); setEditingId('__new__'); }}
            onCancel={() => setEditingId('__new__')}
            onDelete={async (id) => { await onDelete(id); setEditingId('__new__'); }}
          />
        </div>

        <h3 className="f-label text-xs mb-3" style={{ color: 'var(--cream-dim)' }}>
          {products.length} kit{products.length !== 1 ? 's' : ''} live
        </h3>
        <div className="flex flex-col gap-2">
          {products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ border: '1px solid var(--line-soft)' }}>
              <span className="f-display font-bold text-sm w-7" style={{ color: 'var(--gold-bright)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.club}</p>
                <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>₦{Number(p.price).toLocaleString()} · {p.category}</p>
              </div>
              <button onClick={() => setEditingId(p.id)} className="p-1.5 rounded-md" style={{ border: '1px solid var(--line-soft)' }} aria-label={`Edit ${p.club} (${p.category})`}>
                <Pencil size={14} />
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>No kits yet — add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
