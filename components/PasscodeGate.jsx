'use client';

import { useState, useId } from 'react';
import { Lock } from 'lucide-react';
import { useDialog } from '@/lib/hooks';

export default function PasscodeGate({ onSuccess, onClose }) {
  const [val, setVal] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const titleId = useId();
  const dialogRef = useDialog(onClose);

  const submit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'x-admin-passcode': val },
      });
      if (res.ok) {
        onSuccess(val);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,10,10,0.75)' }} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--line-soft)' }}
      >
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Lock size={18} style={{ color: 'var(--gold)' }} />
            <h3 id={titleId} className="f-display font-bold text-2xl">Owner access</h3>
          </div>
          {/* No autoFocus: the dialog hook focuses the first control itself, after noting what had focus before. */}
          <input
            type="password"
            aria-label="Passcode"
            aria-invalid={error}
            className="oxi-input rounded-lg px-3 py-2"
            placeholder="Passcode"
            value={val}
            onChange={(e) => { setVal(e.target.value); setError(false); }}
          />
          {error && <p role="alert" className="text-xs" style={{ color: '#D9776F' }}>That's not it — try again.</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={checking} className="wa-btn rounded-lg px-4 py-2 text-sm font-semibold flex-1" style={{ opacity: checking ? 0.6 : 1 }}>
              {checking ? 'Checking…' : 'Enter'}
            </button>
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm" style={{ border: '1px solid var(--line-soft)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
