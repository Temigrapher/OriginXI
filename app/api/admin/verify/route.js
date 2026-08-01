import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/adminAuth';

export async function POST(req) {
  if (checkAuth(req)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}