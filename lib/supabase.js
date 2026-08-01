import { createClient } from '@supabase/supabase-js';

// Fallback placeholder so `next build` doesn't crash if .env.local isn't filled in yet.
// Real values from .env.local always take priority at runtime.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Read-only client — safe for public product listing (RLS only allows SELECT for anon).
export function getPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Full-access client — bypasses RLS. NEVER import this in client components,
// only inside app/api/** route handlers which run on the server.
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
