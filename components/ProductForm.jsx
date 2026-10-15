'use client';

import { useState, useRef } from 'react';
import { Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { newId } from '@/lib/utils';
import { CATEGORIES, MAX_KIT_PHOTOS } from '@/lib/constants';
import { resizeImage } from '@/lib/imageResize';
import { uploadImage } from '@/lib/api';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export default function ProductForm({ initial, onSave, onCancel, onDelete, passcode }) {
  const [form, setForm] = useState(() => initial ? {
    ...initial,
    price: initial.price ?? '',
    salePrice: initial.salePrice === null || initial.salePrice === undefined ? '' : String(initial.salePrice),
    sizes: Array.isArray(initial.sizes) ? initial.sizes.join(', ') : (initial.sizes || ''),
    stock: initial.stock === null || initial.stock === undefined ? '' : String(initial.stock),
    imageUrls: Array.isArray(initial.imageUrls) ? initial.imageUrls : (initial.imageUrl ? [initial.imageUrl] : []),
  } : {
    name: '', club: '', price: '', salePrice: '', sizes: 'S, M, L, XL', category: 'Home', imageUrls: [], stock: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [linkText, setLinkText] = useState('');
  const fileInputRef = useRef(null);
  const isEditing = Boolean(initial && initial.id);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const movePhoto = (i, delta) => setForm((f) => {
    const j = i + delta;
    if (j < 0 || j >= f.imageUrls.length) return f;
    const next = [...f.imageUrls];
    [next[i], next[j]] = [next[j], next[i]];
    return { ...f, imageUrls: next };
  });

  const removePhoto = (i) => {
    setUploadError('');
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, k) => k !== i) }));
  };

  const addLink = () => {
    const url = linkText.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setUploadError('Paste a full web address that starts with https:// (or http://).');
      return;
    }
    if (form.imageUrls.length >= MAX_KIT_PHOTOS) {
      setUploadError(`A kit can have up to ${MAX_KIT_PHOTOS} photos. Remove one to add another.`);
      return;
    }
    if (form.imageUrls.includes(url)) {
      setUploadError('That photo is already added.');
      return;
    }
    setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, url] }));
    setLinkText('');
    setUploadError('');
  };

  // Several photos can be picked at once; each is resized, uploaded and appended in turn. Only what fits is uploaded.
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) {
      setUploadError('Please choose an image file.');
      return;
    }
    const room = MAX_KIT_PHOTOS - form.imageUrls.length;
    if (room <= 0) {
      setUploadError(`A kit can have up to ${MAX_KIT_PHOTOS} photos. Remove one to add another.`);
      return;
    }
    const fit = images.slice(0, room);
    const notes = [];
    if (images.length > fit.length) notes.push(`${plural(images.length - fit.length, 'photo')} skipped: a kit can have up to ${MAX_KIT_PHOTOS} photos.`);
    if (files.length > images.length) notes.push(`${plural(files.length - images.length, 'file')} skipped: not an image.`);
    setUploading(true);
    setUploadError(notes.join(' '));
    try {
      for (const file of fit) {
        const compressed = await resizeImage(file);
        const url = await uploadImage(compressed, passcode);
        setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, url].slice(0, MAX_KIT_PHOTOS) }));
      }
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
        imageUrl: form.imageUrls[0] || '',
        imageUrls: form.imageUrls,
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

      <div data-photo-manager>
        <div className="flex items-baseline justify-between gap-2">
          <label className="f-label text-xs" style={{ color: 'var(--cream-dim)' }}>Kit photos</label>
          <span className="text-xs" style={{ color: 'var(--cream-dim)' }}>{form.imageUrls.length} of {MAX_KIT_PHOTOS} photos</span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>The first photo is the cover shown on the shop grid. You can choose several photos at once.</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {form.imageUrls.map((url, i) => (
            <div key={url} data-photo-thumb className="flex flex-col gap-1">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="f-label absolute bottom-0 inset-x-0 text-center text-[9px] py-0.5" style={{ background: 'var(--gold)', color: 'var(--pitch)' }}>Cover</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}
                        className="p-1 rounded" style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)', opacity: i === 0 ? 0.35 : 1 }}>
                  <ChevronLeft size={14} />
                </button>
                <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`}
                        className="p-1 rounded" style={{ border: '1px solid rgba(217,119,111,0.35)', color: '#D9776F' }}>
                  <X size={14} />
                </button>
                <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === form.imageUrls.length - 1} aria-label={`Move photo ${i + 1} later`}
                        className="p-1 rounded" style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)', opacity: i === form.imageUrls.length - 1 ? 0.35 : 1 }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {form.imageUrls.length < MAX_KIT_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg flex flex-col items-center justify-center gap-1 text-[11px] font-medium min-h-[5.5rem]"
              style={{ border: '1px dashed var(--line)', color: 'var(--cream)', opacity: uploading ? 0.6 : 1 }}
            >
              <ImageIcon size={18} />
              {uploading ? 'Uploading…' : 'Add photo'}
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        {uploadError && <p className="text-xs mt-1.5" style={{ color: '#D9776F' }}>{uploadError}</p>}
        <details className="mt-2">
          <summary className="text-xs cursor-pointer" style={{ color: 'var(--cream-dim)' }}>or paste an image URL instead</summary>
          <div className="flex gap-2 mt-2">
            <input
              className="oxi-input flex-1 min-w-0 rounded-lg px-3 py-2"
              placeholder="https://..."
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
            />
            <button type="button" onClick={addLink} aria-label="Add photo from link"
                    className="rounded-lg px-3 py-2 text-sm font-medium" style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)' }}>
              Add
            </button>
          </div>
        </details>
      </div>

      {error && <p className="text-xs" style={{ color: '#D9776F' }}>{error}</p>}

      <div className="flex items-center gap-2 mt-1">
        <button type="submit" disabled={saving || uploading} className="wa-btn rounded-lg px-4 py-2.5 font-semibold text-sm flex-1" style={{ opacity: saving || uploading ? 0.6 : 1 }}>
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add kit'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2.5 text-sm font-medium"
                style={{ border: '1px solid var(--line-soft)', color: 'var(--cream)' }}>
          Cancel
        </button>
        {isEditing && (
          <button type="button" disabled={saving} onClick={handleDelete} aria-label="Delete this kit"
                  className="rounded-lg px-3 py-2.5 text-sm"
                  style={{ color: '#D9776F', border: '1px solid rgba(217,119,111,0.35)' }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </form>
  );
}