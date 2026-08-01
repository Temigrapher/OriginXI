export const CATEGORIES = ['Home', 'Away', 'Third', 'Retro'];

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
    a: 'Sizes shown are standard replica kit sizing (S\u2013XL), which tends to run true to size. Unsure? Send your height and usual T-shirt size on WhatsApp and we\u2019ll recommend a fit.',
  },
  {
    q: 'What about delivery?',
    a: 'Delivery is free within Lagos and Ibadan. Nationwide delivery is also available \u2014 cost and timing depend on location and are confirmed on WhatsApp when you order.',
  },
];
