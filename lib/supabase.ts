// ============================================================
// AVIZAYA - SUPABASE CLIENT HELPERS
// ============================================================
// Three contexts:
//   1. Browser (Client Components) - createBrowserSupabaseClient
//   2. Server (Server Components, Route Handlers) - createServerSupabaseClient
//   3. Admin (Webhooks, scripts) - createAdminSupabaseClient
//
// Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
// ============================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// NOTE: the browser client lives in lib/supabase-browser.ts so that
// Client Components never import next/headers (which is server-only).

// ─── SERVER CLIENT (Server Components, Route Handlers) ──────
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components cannot set cookies. Middleware handles this.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Server Components cannot set cookies.
          }
        },
      },
    }
  );
}

// ─── ADMIN CLIENT (Webhooks, scripts) ───────────────────────
// Bypasses Row-Level Security. USE WITH EXTREME CAUTION.
// Only call from server-side code that has been authenticated.
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ─── ACCESS CHECK ───────────────────────────────────────────
// The single function that gates all content access.
// Returns true if user has either:
//   1. Active subscription with current_period_end > now
//   2. One-time purchase of the school
export async function canAccessSchool(
  userId: string,
  schoolId: number
): Promise<{ hasAccess: boolean; reason: 'subscription' | 'purchased' | 'none' }> {
  const supabase = createAdminSupabaseClient();

  // Path 1: Active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle();

  if (sub && (sub.status === 'active' || sub.status === 'canceled')) {
    // Even canceled subs retain access until current_period_end
    if (sub.current_period_end && new Date(sub.current_period_end) > new Date()) {
      return { hasAccess: true, reason: 'subscription' };
    }
  }

  // Path 2: One-time purchase
  const { data: purchase } = await supabase
    .from('school_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('school_id', schoolId)
    .maybeSingle();

  if (purchase) {
    return { hasAccess: true, reason: 'purchased' };
  }

  return { hasAccess: false, reason: 'none' };
}

// ─── GET CURRENT USER ───────────────────────────────────────
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
