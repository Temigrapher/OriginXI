import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { checkAuth } from '@/lib/adminAuth';
import { MAX_KIT_PHOTOS } from '@/lib/constants';

// A kit's photos live in image_urls (the first one is the cover). image_url keeps mirroring the cover so
// anything that still reads the older column works. A client that only sends imageUrl becomes a one-photo list.
function readPhotos(body) {
  const list = Array.isArray(body.imageUrls) ? body.imageUrls : (body.imageUrl ? [body.imageUrl] : []);
  const urls = list.filter((u) => typeof u === 'string' && u.trim()).map((u) => u.trim());
  if (urls.length > MAX_KIT_PHOTOS) return { error: `A kit can have at most ${MAX_KIT_PHOTOS} photos.` };
  return { columns: { image_url: urls[0] || '', image_urls: urls } };
}

export async function POST(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const photos = readPhotos(body);
  if (photos.error) return NextResponse.json({ error: photos.error }, { status: 400 });
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .insert({
      club: body.club,
      price: body.price,
      sale_price: body.salePrice ?? null,
      sizes: body.sizes,
      category: body.category,
      ...photos.columns,
      stock: body.stock ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PUT(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  const photos = readPhotos(body);
  if (photos.error) return NextResponse.json({ error: photos.error }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update({
      club: body.club,
      price: body.price,
      sale_price: body.salePrice ?? null,
      sizes: body.sizes,
      category: body.category,
      ...photos.columns,
      stock: body.stock ?? null,
    })
    .eq('id', body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

  const supabase = getAdminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}