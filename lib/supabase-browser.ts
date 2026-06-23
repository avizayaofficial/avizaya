// ============================================================
// AVIZAYA - SUPABASE BROWSER CLIENT
// ============================================================
// This file is safe to import into Client Components. It does
// NOT import next/headers, so it never pulls server-only code
// into the browser bundle. Server + admin clients live in
// lib/supabase.ts.
// ============================================================

'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
