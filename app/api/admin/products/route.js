import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { checkAuth } from '@/lib/adminAuth';

export async function POST(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .insert({
      club: body.club,
      price: body.price,
      sale_price: body.salePrice ?? null,
      sizes: body.sizes,
      category: body.category,
      image_url: body.imageUrl,
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

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update({
      club: body.club,
      price: body.price,
      sale_price: body.salePrice ?? null,
      sizes: body.sizes,
      category: body.category,
      image_url: body.imageUrl,
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