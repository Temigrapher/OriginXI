export function newId() {
  return (typeof window !== 'undefined' && window.crypto?.randomUUID)
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function effectivePrice(product) {
  return (product.salePrice != null && product.salePrice < product.price) ? product.salePrice : product.price;
}

export function isOnSale(product) {
  return product.salePrice != null && product.salePrice < product.price;
}