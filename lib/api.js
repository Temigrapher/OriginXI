export async function uploadImage(file, passcode) {
  const formData = new FormData();
  formData.append('file', file, file.name || 'upload.jpg');

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-admin-passcode': passcode },
    body: formData,
  });
  const data = await res.json();
  if (res.status === 401) {
    const err = new Error('Incorrect passcode');
    err.unauthorized = true;
    throw err;
  }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

function normalize(row) {
  return {
    id: row.id,
    club: row.club,
    price: row.price,
    salePrice: row.sale_price ?? null,  
    sizes: row.sizes || [],
    category: row.category,
    imageUrl: row.image_url || '',
    stock: row.stock,
  };
}

export async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load products');
  return (data.products || []).map(normalize);
}

async function adminRequest(method, passcode, body, query = '') {
  const res = await fetch(`/api/admin/products${query}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (res.status === 401) {
    const err = new Error('Incorrect passcode');
    err.unauthorized = true;
    throw err;
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function createProduct(product, passcode) {
  const data = await adminRequest('POST', passcode, product);
  return normalize(data.product);
}

export async function updateProduct(product, passcode) {
  const data = await adminRequest('PUT', passcode, product);
  return normalize(data.product);
}

export async function deleteProduct(id, passcode) {
  await adminRequest('DELETE', passcode, null, `?id=${encodeURIComponent(id)}`);
}
