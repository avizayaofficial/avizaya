// ============================================================
// CHECKOUT: ONE SCHOOL ($50, permanent ownership)
// ============================================================
// GET /checkout/school?id=1
// Creates a Stripe Checkout session and redirects the user to it.
// The webhook (api/webhook/stripe) grants access on success.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const id = new URL(request.url).searchParams.get('id');
  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.redirect(`${origin}/schools`, { status: 303 });
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login?intent=school&school=${encodeURIComponent(id)}`,
      { status: 303 }
    );
  }

  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();

  if (!school || !school.is_published) {
    return NextResponse.redirect(`${origin}/schools`, { status: 303 });
  }

  // If they already own it, skip payment and send them to read.
  const { data: existing } = await supabase
    .from('school_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('school_id', school.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.redirect(`${origin}/read/${school.slug}/1`, { status: 303 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: school.price_cents,
          product_data: {
            name: `${school.title}${school.subtitle ? ` — ${school.subtitle}` : ''}`,
            description: school.tagline ?? undefined,
          },
        },
      },
    ],
    metadata: {
      kind: 'school',
      user_id: user.id,
      school_id: String(school.id),
    },
    success_url: `${origin}/checkout/success?kind=school&slug=${school.slug}`,
    cancel_url: `${origin}/library`,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
