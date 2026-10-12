import { NextResponse } from 'next/server';
import { getPublicClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json(
    { products: data },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}