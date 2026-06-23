// ============================================================
// API: SUBSCRIBE (email capture)
// ============================================================
// POST /api/subscribe   body: { email, source?, tag? }
// Public endpoint (no auth). Stores an email in email_subscribers.
// Duplicate emails are silently accepted (no error leak about who
// is already on the list).
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: unknown; source?: unknown; tag?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 40) : null;
  const tag = typeof body.tag === 'string' ? body.tag.slice(0, 60) : null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from('email_subscribers')
    .upsert({ email, source, tag }, { onConflict: 'email', ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
