'use client';

import { effectivePrice } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { MessageCircle, ChevronDown, ShieldCheck, Truck, Ruler, Lock, ShoppingBag } from 'lucide-react';

import { useReducedMotion } from '@/lib/hooks';
import { CATEGORIES, SAMPLE_PRODUCTS, FAQ_ITEMS } from '@/lib/constants';
import { chatLink } from '@/lib/whatsapp';
import { loadCart, saveCart } from '@/lib/cart';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';

import FrameCorners from '@/components/FrameCorners';
import ProductCard from '@/components/ProductCard';
import FaqItem from '@/components/FaqItem';
import AdminDrawer from '@/components/AdminDrawer';
import CartDrawer from '@/components/CartDrawer';
import PasscodeGate from '@/components/PasscodeGate';

export default function OriginXIShop() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});

  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState(''); // held in memory only, never persisted
  const [showAdmin, setShowAdmin] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const reducedMotion = useReducedMotion();

  // Load catalog from Supabase (via our API route) on mount.
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoadError('');
      } catch (e) {
        setLoadError(e.message || 'Could not load the catalog. Check your Supabase connection.');
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Load cart from localStorage once, on mount (client-only).
  useEffect(() => {
    setCart(loadCart());
    setCartLoaded(true);
  }, []);

  // Persist cart to localStorage on every change, after the initial load.
  useEffect(() => {
    if (cartLoaded) saveCart(cart);
  }, [cart, cartLoaded]);

  const handleSaveProduct = async (product) => {
    const exists = products.some((p) => p.id === product.id);
    const saved = exists ? await updateProduct(product, passcode) : await createProduct(product, passcode);
    setProducts((prev) => (exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]));
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id, passcode);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToCart = (product, size) => {
    const key = `${product.id}-${size || 'nosize'}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) => (item.key === key ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, {
        key, productId: product.id, club: product.club, category: product.category,
       size: size || null, price: effectivePrice(product), qty: 1,
      }];
    });
  };

  const handleUpdateCartQty = (key, delta) => {
    setCart((prev) => prev
      .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0));
  };

  const handleRemoveFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);
  const headlineWords = ['SAME', 'BADGE.', 'NEW', 'SEASON.'];

  return (
    <div className={`oxi-root ${reducedMotion ? 'no-motion' : ''}`}>
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-sm" style={{ background: 'rgba(10,10,10,0.88)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <span className="f-display font-black text-2xl tracking-wide">ORIGIN <span style={{ color: 'var(--gold)' }}>XI</span></span>
          <a href={chatLink()} target="_blank" rel="noopener noreferrer"
             className="wa-btn rounded-full px-4 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <MessageCircle size={14} strokeWidth={2.5} />
            Chat
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
        <div className="max-w-3xl mx-auto frame-outer rounded-sm">
          <FrameCorners />
          <div className="frame-inner text-center relative">
            <p className="f-label text-xs sm:text-sm mb-4" style={{ color: 'var(--gold)' }}>
              Origin XI — 2026/27 Season
            </p>
            <h1 className="f-display font-black text-4xl sm:text-6xl leading-[1.05] mb-5">
              {headlineWords.map((w, i) => (
                <span key={w} className="anim-word mr-3" style={{ animationDelay: `${i * 110}ms`, color: w.startsWith('SEASON') ? 'var(--gold)' : undefined }}>{w}</span>
              ))}
            </h1>
            <p className="f-display-italic text-base sm:text-lg max-w-md mx-auto mb-8" style={{ color: 'var(--cream-dim)' }}>
              Curated. Authenticated. Celebrated. — now for what's on the pitch today.
            </p>
            <a href="#squad" className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full wa-btn">
              See the kits <ChevronDown size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={18} style={{ color: 'var(--gold)' }} />
            <span className="f-label text-[10px] sm:text-xs" style={{ color: 'var(--cream-dim)' }}>Authentic Kits</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={18} style={{ color: 'var(--gold)' }} />
            <span className="f-label text-[10px] sm:text-xs" style={{ color: 'var(--cream-dim)' }}>Free Lagos & Ibadan Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Ruler size={18} style={{ color: 'var(--gold)' }} />
            <span className="f-label text-[10px] sm:text-xs" style={{ color: 'var(--cream-dim)' }}>Sizing Help on WhatsApp</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-[57px] z-30 backdrop-blur-sm" style={{ background: 'rgba(10,10,10,0.88)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${filter === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section id="squad" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p className="f-label text-xs mb-2" style={{ color: 'var(--gold)' }}>The Squad</p>
        <h2 className="f-display font-bold text-3xl sm:text-4xl mb-1">This Season's Drop</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--cream-dim)' }}>{filtered.length} kit{filtered.length !== 1 ? 's' : ''} available</p>

        {!loaded ? (
          <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>Loading catalog…</p>
        ) : loadError ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed rgba(217,119,111,0.4)' }}>
            <p className="f-display font-bold text-2xl mb-2" style={{ color: '#D9776F' }}>Couldn't load the catalog</p>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--cream-dim)' }}>{loadError}</p>
          </div>
        ) : products.length === 0 ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mb-4">
              {SAMPLE_PRODUCTS.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  reducedMotion={reducedMotion}
                  selectedSize={selectedSizes[p.id]}
                  onSelectSize={(id, size) => setSelectedSizes((s) => ({ ...s, [id]: size }))}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
              That's the live card grid — including sold-out and low-stock states. Add your first real kit from Manage Catalog in the footer below and these placeholders disappear.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed var(--line-soft)' }}>
            <p className="f-display font-bold text-2xl mb-2">No kits in this category</p>
            <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>Try a different filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                reducedMotion={reducedMotion}
                selectedSize={selectedSizes[p.id]}
                onSelectSize={(id, size) => setSelectedSizes((s) => ({ ...s, [id]: size }))}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ / TRUST SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <p className="f-label text-xs mb-2" style={{ color: 'var(--gold)' }}>Before You Order</p>
        <h2 className="f-display font-bold text-2xl sm:text-3xl mb-5">Good to Know</h2>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 px-4 sm:px-6 py-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="f-display font-black text-xl">ORIGIN <span style={{ color: 'var(--gold)' }}>XI</span></span>
            <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>
              <a href="https://instagram.com/origin.xi" target="_blank" rel="noopener noreferrer" className="hover:underline">@origin.xi</a>
              {' · '}Nigeria
            </p>
          </div>
          <button
            onClick={() => (passcode ? setShowAdmin(true) : setShowPasscode(true))}
            className="f-label text-xs flex items-center gap-1.5"
            style={{ color: 'var(--cream-dim)' }}
          >
            <Lock size={12} /> Manage catalog
          </button>
        </div>
        <p className="max-w-6xl mx-auto text-center text-[11px] mt-8" style={{ color: 'var(--cream-dim)' }}>
          Built by{' '}
          <a href="https://instagram.com/vanta.africa" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--gold)' }}>
            Vanta
          </a>
        </p>
      </footer>

      {showPasscode && (
        <PasscodeGate
          onSuccess={(val) => { setPasscode(val); setShowPasscode(false); setShowAdmin(true); }}
          onClose={() => setShowPasscode(false)}
        />
      )}
      {showAdmin && (
        <AdminDrawer
          products={products}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setShowAdmin(false)}
          passcode={passcode}
        />

      )}
      {showCart && (
        <CartDrawer
          items={cart}
          onUpdateQty={handleUpdateCartQty}
          onRemove={handleRemoveFromCart}
          onClose={() => setShowCart(false)}
        />
      )}

      {cartCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="wa-btn fixed bottom-5 right-5 z-40 rounded-full pl-4 pr-5 py-3 flex items-center gap-2 font-semibold text-sm shadow-lg"
        >
          <span className="relative">
            <ShoppingBag size={18} strokeWidth={2.5} />
            <span
              className="f-label absolute -top-2 -right-2 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: 'var(--pitch)', color: 'var(--gold-bright)', width: '18px', height: '18px', letterSpacing: 0 }}
            >
              {cartCount}
            </span>
          </span>
          Cart
        </button>
      )}
    </div>
  );
}
