import { NextResponse } from 'next/server';
import { getPublicClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}