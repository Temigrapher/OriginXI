# Origin XI — Live Shop

The full shop is now ported off `window.storage` and onto your real Supabase backend:
cart, admin catalog manager, animations, everything — wired to `app/api/products`
(public reads) and `app/api/admin/products` (passcode-gated writes).

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Environment variables**
   ```
   cp .env.local.example .env.local
   ```
   Fill in your Supabase URL, anon key, service role key, your WhatsApp number
   (`NEXT_PUBLIC_WHATSAPP_NUMBER`), and your admin passcode.

3. **Run it**
   ```
   npm run dev
   ```
   Open http://localhost:3000 — restart the server after any `.env.local` change.

## What changed from the Phase 1 scaffold

- `app/page.jsx` is now the real shop (was a bare test harness)
- `components/` holds the full UI: `ProductCard`, `AdminDrawer`, `ProductForm`,
  `CartDrawer`, `PasscodeGate`, `FaqItem`, `FrameCorners`
- `lib/api.js` — talks to the API routes instead of `window.storage`
- `lib/cart.js` — cart now persists in real `localStorage` (safe here, unlike
  inside a Claude artifact) so a buyer's cart survives a refresh
- `lib/whatsapp.js` — builds the WhatsApp chat + checkout links
- **Passcode is no longer in the client bundle.** `PasscodeGate` calls
  `/api/admin/verify`, which checks it server-side against `ADMIN_PASSCODE`
  in `.env.local`. Anyone opening dev tools now sees nothing useful.

## Testing checklist

- [ ] Page loads with the demo product grid (Arsenal/Chelsea/Man Utd/Real Madrid placeholders)
- [ ] "Manage catalog" in the footer → enter passcode → drawer opens
- [ ] Add a real kit → it appears in the grid, demo cards disappear
- [ ] Edit and delete a kit
- [ ] Add a kit to cart (pick a size first) → floating cart button appears
- [ ] Open cart, adjust quantity, checkout → WhatsApp opens with an itemized message
- [ ] Refresh the page — cart should survive (localStorage), catalog should reload from Supabase
- [ ] Try the wrong passcode — should show an inline error, not silently fail

## Project structure

```
app/
  page.jsx                     — the shop (client component)
  layout.jsx                   — root layout + page metadata
  globals.css                  — full design system (fonts, colors, animations)
  api/products/route.js        — public GET (product list)
  api/admin/products/route.js  — passcode-gated POST/PUT/DELETE
  api/admin/verify/route.js    — passcode check used by the admin gate
lib/
  api.js                       — client-side data layer (fetch wrappers)
  supabase.js                  — public + admin Supabase client helpers
  cart.js                      — localStorage cart persistence
  whatsapp.js                  — wa.me link builders
  hooks.js                     — useReducedMotion, useInView
  constants.js                 — categories, demo products, FAQ copy
components/
  ProductCard.jsx, ProductForm.jsx, AdminDrawer.jsx, CartDrawer.jsx,
  PasscodeGate.jsx, FaqItem.jsx, FrameCorners.jsx
```

## Still open (production polish, not blockers)

- SEO/social preview tags (title/description are in, OG image still needed)
- Second "detail" photo per kit
- Strip demo products once real kits are loaded (automatic — they only show when the catalog is empty)

