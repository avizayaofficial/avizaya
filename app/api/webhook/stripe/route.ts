// ============================================================
// STRIPE WEBHOOK
// ============================================================
// POST /api/webhook/stripe
// This is the engine of the whole business: when Stripe confirms
// a payment, this grants access automatically. You never touch
// the database after a sale.
//
// Events handled:
//   checkout.session.completed   -> grant school / coaching / sub
//   customer.subscription.updated/deleted -> keep sub status fresh
//
// This route is EXEMPT from auth middleware (see middleware.ts
// matcher) and reads the raw request body for signature checks.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const userId = meta.user_id || session.client_reference_id || null;

      if (!userId) {
        return NextResponse.json({ received: true, note: 'no user id' });
      }

      if (meta.kind === 'school' && meta.school_id) {
        await admin.from('school_purchases').upsert(
          {
            user_id: userId,
            school_id: Number(meta.school_id),
            stripe_payment_intent_id:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            amount_cents: session.amount_total ?? 0,
          },
          { onConflict: 'user_id,school_id' }
        );
      } else if (meta.kind === 'coaching') {
        await admin.from('coaching_sessions').insert({
          user_id: userId,
          stripe_payment_intent_id:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
          amount_cents: session.amount_total ?? 25000,
          status: 'pending',
        });
      } else if (meta.kind === 'subscription' && session.subscription) {
        const subId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        await admin.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id:
              typeof session.customer === 'string' ? session.customer : null,
            stripe_subscription_id: sub.id,
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      }
    } else if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const sub = event.data.object as Stripe.Subscription;
      await admin
        .from('subscriptions')
        .update({
          status: event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', sub.id);
    }
  } catch {
    // Returning 500 makes Stripe retry, which is what we want on a
    // transient database error.
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
