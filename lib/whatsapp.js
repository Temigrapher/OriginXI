const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

export function chatLink() {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}

export function cartWaLink(cartItems) {
  const lines = cartItems.map((item, i) =>
    `${i + 1}. ${item.club} (${item.category}${item.size ? `, ${item.size}` : ''}) x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`
  );
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const msg = `Hi Origin XI, I'd like to order:\n${lines.join('\n')}\n\nTotal: ₦${total.toLocaleString()}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
