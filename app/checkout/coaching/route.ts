// ============================================================
// CHECKOUT: 1:1 COACHING ($299 one-time)
// ============================================================
// GET /checkout/coaching
// Records a pending coaching session on payment. Scheduling
// (Cal.com) is a later delivery; for now you reach out by email.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getStripe, COACHING_PRICE_CENTS } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?intent=coaching`, { status: 303 });
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
          unit_amount: COACHING_PRICE_CENTS,
          product_data: {
            name: 'Avizaya — Private Session with Dina',
            description: 'One private 1:1 session.',
          },
        },
      },
    ],
    metadata: {
      kind: 'coaching',
      user_id: user.id,
    },
    success_url: `${origin}/checkout/success?kind=coaching`,
    cancel_url: `${origin}/`,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
