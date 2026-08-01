'use client';

import { useState, useRef } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { newId } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { resizeImage } from '@/lib/imageResize';
import { uploadImage } from '@/lib/api';

export default function ProductForm({ initial, onSave, onCancel, onDelete, passcode }) {
  const [form, setForm] = useState(() => initial ? {
    ...initial,
    price: initial.price ?? '',
    salePrice: initial.salePrice === null || initial.salePrice === undefined ? '' : String(initial.salePrice),
    sizes: Array.isArray(initial.sizes) ? initial.sizes.join(', ') : (initial.sizes || ''),
    stock: initial.stock === null || initial.stock === undefined ? '' : String(initial.stock),
    imageUrl: initial.imageUrl || '',
  } : {
    name: '', club: '', price: '', salePrice: '', sizes: 'S, M, L, XL', category: 'Home', imageUrl: '', stock: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const isEditing = Boolean(initial && initial.id);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const compressed = await resizeImage(file);
      const url = await uploadImage(compressed, passcode);
      update('imageUrl', url);
    } catch (err) {
      setUploadError(err.unauthorized ? 'Incorrect passcode — close this and reopen Manage Catalog.' : (err.message || 'Upload failed, try again.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.club.trim() || !form.price) return;
    const sizesArr = String(form.sizes).split(',').map((s) => s.trim()).filter(Boolean);
    const salePriceNum = form.salePrice === '' ? null : Number(form.salePrice);
    setSaving(true);
    setError('');
    try {
      await onSave({
        id: initial?.id || newId(),
        club: form.club.trim(),
        price: Number(form.price),
        salePrice: salePriceNum,
        sizes: sizesArr,
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        stock: form.stock === '' ? null : Number(form.stock),
      });
    } catch (err) {
      setError(err.unauthorized ? 'Incorrect passcode — re-enter it and try again.' : (err.message || 'Something went wrong saving this kit.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError('');
    try {
      await onDelete(initial.id);
    } catch (err) {
      setError(err.unauthorized ? 'Incorrect passcode — re-enter it and try again.' : (err.message || 'Something went wrong deleting this kit.'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Club name</label>
        <input
          className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
          placeholder="e.g. Real Madrid"
          value={form.club}
          onChange={(e) => update('club', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Price (₦)</label>
          <input
            className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
            placeholder="25000"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Sale price (optional)</label>
          <input
            className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
            placeholder="Leave blank if no discount"
            type="number"
            min="0"
            value={form.salePrice}
            onChange={(e) => update('salePrice', e.target.value)}
          />
        </div>
      </div>
      {form.salePrice !== '' && form.price !== '' && Number(form.salePrice) >= Number(form.price) && (
        <p className="text-xs -mt-2" style={{ color: '#D9776F' }}>Sale price should be lower than the regular price, or it won't show as a discount.</p>
      )}

      <div>
        <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Category</label>
        <select
          className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Sizes (comma separated)</label>
        <input
          className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
          placeholder="S, M, L, XL"
          value={form.sizes}
          onChange={(e) => update('sizes', e.target.value)}
        />
      </div>

      <div>
        <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Stock on hand (optional)</label>
        <input
          className="oxi-input w-full rounded-lg px-3 py-2 mt-1"
          placeholder="Leave blank to hide stock count"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => update('stock', e.target.value)}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>Shows "Only X left" at 3 or fewer, or "Sold Out" at 0 — builds urgency and stops orders you can't fulfil.</p>
      </div>

      <div>
        <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Kit photo</label>
        <div className="mt-1 flex items-center gap-3">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: '1px solid var(--line-soft)' }} />
          ) : (
            <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0" style={{ border: '1px dashed var(--line-soft)', color: 'var(--cream-dim)' }}>
              <ImageIcon size={20} />
            </div>
          )}
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg px-3 py-2 text-sm font-medium w-full"
              style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? 'Uploading…' : form.imageUrl ? 'Replace photo' : 'Choose photo'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>
        </div>
        {uploadError && <p className="text-xs mt-1.5" style={{ color: '#D9776F' }}>{uploadError}</p>}
        <details className="mt-2">
          <summary className="text-xs cursor-pointer" style={{ color: 'var(--cream-dim)' }}>or paste an image URL instead</summary>
          <input
            className="oxi-input w-full rounded-lg px-3 py-2 mt-2"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
          />
        </details>
      </div>

      {error && <p className="text-xs" style={{ color: '#D9776F' }}>{error}</p>}

      <div className="flex items-center gap-2 mt-1">
        <button type="submit" disabled={saving} className="wa-btn rounded-lg px-4 py-2.5 font-semibold text-sm flex-1" style={{ opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add kit'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2.5 text-sm font-medium"
                style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)' }}>
          Cancel
        </button>
        {isEditing && (
          <button type="button" disabled={saving} onClick={handleDelete}
                  className="rounded-lg px-3 py-2.5 text-sm"
                  style={{ color: '#D9776F', border: '1px solid rgba(217,119,111,0.35)' }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </form>
  );
}