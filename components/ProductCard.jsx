'use client';

import { useState, useEffect } from 'react';
import { ImageOff, Check, ShoppingBag, Ruler } from 'lucide-react';
import { useInView } from '@/lib/hooks';
import { effectivePrice, isOnSale } from '@/lib/utils';
import { notifyLink } from '@/lib/whatsapp';

export default function ProductCard({ product, index, selectedSize, onSelectSize, onAddToCart, onOpenSizeGuide, onOpenPhotos, reducedMotion, cartQty = 0 }) {
  const [ref, inView] = useInView();
  const [failed, setFailed] = useState({});       // photo index -> true once that photo has failed to load
  const [touched, setTouched] = useState(false);  // extra photos are only downloaded once someone touches the card
  const [activePhoto, setActivePhoto] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const photos = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
  const many = photos.length > 1;
  const kitName = `${product.club} ${product.category}`;
  const canOpen = Boolean(onOpenPhotos) && !product.isDemo;
  const onSale = isOnSale(product);
  const displayPrice = effectivePrice(product);
  const num = String(index + 1).padStart(2, '0');
  const soldOut = product.stock === 0;
  const lowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 3;
  const needsSize = product.sizes?.length > 0;
  const atStockLimit = typeof product.stock === 'number' && cartQty >= product.stock;
  const canAdd = (!needsSize || Boolean(selectedSize)) && !atStockLimit;

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);

  // If the owner changes this kit's photos while the shop is open, start the strip afresh.
  const photosKey = photos.join('|');
  const [seenPhotosKey, setSeenPhotosKey] = useState(photosKey);
  if (seenPhotosKey !== photosKey) {
    setSeenPhotosKey(photosKey);
    setFailed({});
    setActivePhoto(0);
  }

  const onStripScroll = (e) => {
    const el = e.currentTarget;
    setTouched(true);
    const i = Math.round(el.scrollLeft / (el.clientWidth || 1));
    setActivePhoto((cur) => (cur === i ? cur : i));
  };

  const noPhoto = (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: 'var(--cream-dim)' }}>
      <ImageOff size={28} strokeWidth={1.5} />
      <span className="f-label text-[10px]">image unavailable</span>
    </div>
  );

  const photoNode = (src, i) => {
    if (failed[i]) return noPhoto;
    const img = (
      <img
        src={src}
        alt={many ? `${kitName} kit, photo ${i + 1} of ${photos.length}` : `${kitName} kit`}
        className="oxi-img w-full h-full object-cover"
        onError={() => setFailed((f) => ({ ...f, [i]: true }))}
        loading="lazy"
      />
    );
    if (!canOpen) return img;
    return (
      <button
        type="button"
        onClick={() => onOpenPhotos(photos, i, kitName)}
        aria-label={many ? `Open ${kitName} photo ${i + 1} of ${photos.length}` : `Open ${kitName} photo`}
        className="block w-full h-full"
      >
        {img}
      </button>
    );
  };

  const handleAdd = () => {
    if (!canAdd || product.isDemo) return;
    onAddToCart(product, selectedSize);
    setJustAdded(true);
  };

  return (
    <div
      ref={ref}
      className={`oxi-card rounded-xl overflow-hidden flex flex-col card-reveal ${inView || reducedMotion ? 'in' : ''}`}
      style={{ animationDelay: reducedMotion ? '0ms' : `${(index % 6) * 70}ms`, opacity: soldOut ? 0.7 : undefined }}
    >
      <div className="oxi-img-wrap relative aspect-[4/5]">
        {product.isDemo && (
          <div className="f-label absolute inset-x-0 top-0 z-20 text-center text-[10px] py-1"
               style={{ background: 'var(--gold)', color: 'var(--pitch)', letterSpacing: '0.14em' }}>
            Demo layout — add your kits below
          </div>
        )}
        <div className="seal-badge absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[11px] sm:text-sm px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full pointer-events-none" style={{ marginTop: product.isDemo ? '18px' : 0 }}>
          N&deg; {num}
        </div>
        <div className="f-label absolute top-2 right-2 sm:top-3 sm:right-3 z-10 text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded pointer-events-none"
             style={{ background: 'rgba(10,10,10,0.72)', color: 'var(--cream-dim)', letterSpacing: '0.12em', marginTop: product.isDemo ? '18px' : 0 }}>
          {product.category}
        </div>
        {(soldOut || lowStock) && (
          <div className="f-label absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full pointer-events-none"
               style={{
                 background: soldOut ? 'rgba(10,10,10,0.85)' : 'rgba(201,162,39,0.92)',
                 color: soldOut ? '#D9776F' : 'var(--pitch)',
                 border: soldOut ? '1px solid rgba(217,119,111,0.5)' : 'none',
               }}>
            {soldOut ? 'Sold Out' : `Only ${product.stock} left`}
          </div>
        )}
        {photos.length === 0 ? noPhoto : !many ? photoNode(photos[0], 0) : (
          <>
            <div
              key={photosKey}
              role="group"
              aria-roledescription="carousel"
              aria-label={`${kitName} photos`}
              tabIndex={0}
              onScroll={onStripScroll}
              onPointerDown={() => setTouched(true)}
              onTouchStart={() => setTouched(true)}
              onMouseEnter={() => setTouched(true)}
              onFocus={() => setTouched(true)}
              className="oxi-strip absolute inset-0 flex overflow-x-auto snap-x snap-mandatory"
            >
              {photos.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${photos.length}`}
                  className="w-full h-full shrink-0 snap-start overflow-hidden"
                >
                  {i === 0 || touched ? photoNode(src, i) : null}
                </div>
              ))}
            </div>
            <div
              data-dots
              aria-hidden="true"
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 flex items-center gap-1 rounded-full px-1.5 py-1 pointer-events-none"
              style={{ background: 'rgba(10,10,10,0.55)' }}
            >
              {photos.map((src, i) => (
                <span
                  key={`${src}-${i}`}
                  data-dot
                  data-active={i === activePhoto ? 'true' : undefined}
                  className="block rounded-full"
                  style={{ width: 6, height: 6, background: i === activePhoto ? 'var(--gold-bright)' : 'rgba(245,241,230,0.5)' }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
        <div>
          <h3 className="f-display font-bold text-base sm:text-2xl leading-tight">{product.club}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 flex-wrap">
            {onSale && (
              <span className="text-[10px] sm:text-xs line-through" style={{ color: 'var(--cream-dim)' }}>
                ₦{Number(product.price).toLocaleString()}
              </span>
            )}
            <span className="text-xs sm:text-sm font-semibold" style={{ color: onSale ? '#D9776F' : 'var(--gold-bright)' }}>
              ₦{Number(displayPrice).toLocaleString()}
            </span>
            {onSale && (
              <span className="f-label text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#D9776F', color: 'var(--pitch)' }}>
                SALE
              </span>
            )}
          </div>
        </div>

        {product.sizes?.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSize(product.id, s)}
                  className={`size-chip rounded-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium ${selectedSize === s ? 'selected' : ''}`}
                  style={{ color: selectedSize === s ? undefined : 'var(--cream)' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="flex items-center gap-1 text-[10px] w-fit"
              style={{ color: 'var(--cream-dim)' }}
            >
              <Ruler size={10} /> Size guide
            </button>
          </div>
        )}

        {soldOut ? (
          product.isDemo ? (
            <div className="mt-auto rounded-lg px-2 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center gap-1.5 font-semibold text-[11px] sm:text-sm text-center"
                 style={{ border: '1px solid var(--line-soft)', color: 'var(--cream-dim)' }}>
              Notify me on WhatsApp
            </div>
          ) : (
            <a
              href={notifyLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Notify me on WhatsApp when ${product.club} ${product.category} is back in stock`}
              className="mt-auto rounded-lg px-1.5 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center gap-1.5 font-semibold text-[11px] sm:text-sm text-center leading-tight"
              style={{ border: '1px solid var(--gold)', color: 'var(--gold-bright)' }}
            >
              Notify me on WhatsApp
            </a>
          )
        ) : product.isDemo ? (
          <div className="mt-auto rounded-lg px-2 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center gap-1.5 font-semibold text-[11px] sm:text-sm text-center"
               style={{ border: '1px dashed var(--line-soft)', color: 'var(--cream-dim)' }}>
            Demo item
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            title={atStockLimit ? 'You already have all the available stock in your cart' : (!canAdd ? 'Pick a size first' : undefined)}
            className="wa-btn mt-auto rounded-lg px-2 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center gap-1.5 font-semibold text-[11px] sm:text-sm"
            style={{ opacity: canAdd ? 1 : 0.45, cursor: canAdd ? 'pointer' : 'not-allowed' }}
          >
            {justAdded ? (
              <>
                <Check size={14} strokeWidth={3} className="shrink-0" />
                Added
              </>
            ) : atStockLimit ? (
              <span>Max in cart</span>
            ) : (
              <>
                <ShoppingBag size={14} strokeWidth={2.5} className="shrink-0" />
                <span className="hidden sm:inline">{needsSize && !selectedSize ? 'Select size' : 'Add to Cart'}</span>
                <span className="sm:hidden">{needsSize && !selectedSize ? 'Size?' : 'Add'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
