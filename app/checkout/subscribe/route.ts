// ============================================================
// CHECKOUT: MONTHLY SUBSCRIPTION ($20/mo, all published schools)
// ============================================================
// GET /checkout/subscribe
// Uses inline recurring price_data, so there is no Price to
// create in the Stripe dashboard.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getStripe, SUBSCRIPTION_PRICE_CENTS } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?intent=subscribe`, { status: 303 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: SUBSCRIPTION_PRICE_CENTS,
          recurring: { interval: 'month' },
          product_data: {
            name: 'Avizaya — Monthly Access',
            description: 'Full access to every published school, every month.',
          },
        },
      },
    ],
    metadata: {
      kind: 'subscription',
      user_id: user.id,
    },
    success_url: `${origin}/checkout/success?kind=subscription`,
    cancel_url: `${origin}/library`,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
