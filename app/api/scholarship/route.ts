// ============================================================
// API: SCHOLARSHIP REQUEST
// ============================================================
// POST /api/scholarship  body: { email, full_name?, situation, requested_tier }
// Public endpoint. Stores a request in scholarship_requests for
// Dina to review in Supabase.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TIERS = ['subscription', 'school', 'coaching'];

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const fullName = typeof body.full_name === 'string' ? body.full_name.trim().slice(0, 120) : null;
  const situation = typeof body.situation === 'string' ? body.situation.trim().slice(0, 4000) : '';
  const requestedTier =
    typeof body.requested_tier === 'string' && VALID_TIERS.includes(body.requested_tier)
      ? body.requested_tier
      : 'school';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }
  if (situation.length < 10) {
    return NextResponse.json(
      { error: 'Tell me a little about your situation.' },
      { status: 400 }
    );
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from('scholarship_requests').insert({
    email,
    full_name: fullName,
    situation,
    requested_tier: requestedTier,
  });

  if (error) {
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
