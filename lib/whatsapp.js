const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

export function chatLink() {
  const msg = "Hi Origin XI, I have a question about a kit.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function notifyLink(product) {
  const msg = `Hi Origin XI, please tell me when the ${product.club} ${product.category} kit is back in stock.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function cartWaLink(cartItems) {
  const lines = cartItems.map((item, i) =>
    `${i + 1}. ${item.club} (${item.category}${item.size ? `, ${item.size}` : ''}) x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`
  );
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const msg = `Hi Origin XI, I'd like to order:\n${lines.join('\n')}\n\nTotal: ₦${total.toLocaleString()}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
