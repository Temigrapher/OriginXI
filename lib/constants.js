export const CATEGORIES = ['Home', 'Away', 'Third', 'Retro'];

// Photos per kit. The first one is the cover. The database also enforces this limit (see the SQL migration).
export const MAX_KIT_PHOTOS = 4;

export const SIZE_GUIDE = [
  { size: 'S', chest: '34–36 in (86–91 cm)', height: "5'4\"–5'7\" (162–170 cm)" },
  { size: 'M', chest: '38–40 in (96–101 cm)', height: "5'7\"–5'9\" (170–175 cm)" },
  { size: 'L', chest: '42–44 in (106–111 cm)', height: "5'9\"–5'11\" (175–180 cm)" },
  { size: 'XL', chest: '46–48 in (116–121 cm)', height: "5'11\"–6'1\" (180–185 cm)" },
  { size: 'XXL', chest: '50–52 in (127–132 cm)', height: "6'1\"–6'3\" (185–190 cm)" },
];

const placeholder = (label) => `https://placehold.co/800x1000/151310/C9A227?text=${label}`;

// Shown only when the live catalog is empty, purely so the card grid layout is visible.
// Never sent to the API — add real kits via Manage Catalog to replace these.
export const SAMPLE_PRODUCTS = [
  { id: '__sample_1__', club: 'Arsenal', price: 28000, sizes: ['S', 'M', 'L', 'XL'], category: 'Away', imageUrl: placeholder('Add+Kit+Photo'), stock: 6, isDemo: true },
  { id: '__sample_2__', club: 'Chelsea', price: 25000, sizes: ['S', 'M', 'L', 'XL'], category: 'Home', imageUrl: placeholder('Add+Kit+Photo'), stock: 2, isDemo: true },
  { id: '__sample_3__', club: 'Manchester United', price: 27000, sizes: ['M', 'L', 'XL'], category: 'Third', imageUrl: placeholder('Add+Kit+Photo'), stock: 0, isDemo: true },
  { id: '__sample_4__', club: 'Real Madrid', price: 30000, sizes: ['S', 'M', 'L'], category: 'Away', imageUrl: placeholder('Add+Kit+Photo'), isDemo: true },
];

export const FAQ_ITEMS = [
  {
    q: 'How do I know these are authentic?',
    a: 'Every kit is checked for fabric quality, stitching, and badge detail before it\u2019s listed. Ask on WhatsApp for extra photos of any specific kit before you pay.',
  },
  {
    q: 'How does sizing work?',
    a: 'Sizes shown are standard replica kit sizing (S\u2013XXL), which tends to run true to size. Tap "Size guide" under the sizes on any kit for chest and height measurements. Still unsure? Send your height and usual T-shirt size on WhatsApp and we\u2019ll recommend a fit.',
  },
  {
    q: 'What about delivery?',
    a: 'Delivery is free within Lagos and Ibadan. Nationwide delivery is also available \u2014 cost and timing depend on location and are confirmed on WhatsApp when you order.',
  },
];
