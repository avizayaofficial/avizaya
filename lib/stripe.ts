// ============================================================
// AVIZAYA - STRIPE CLIENT
// ============================================================
// Server-side only. Never import this into a Client Component.
// We use INLINE pricing (price_data) everywhere, so there is
// nothing to configure inside the Stripe dashboard except your
// API keys and one webhook. No Products. No Price IDs.
// ============================================================

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  // apiVersion intentionally omitted: the account default is used,
  // which keeps this resilient across Stripe SDK minor versions.
  _stripe = new Stripe(key);
  return _stripe;
}

// Pricing lives in code, in cents, so it is impossible to mismatch
// a Stripe dashboard value. Subscription price is fixed here; school
// prices come from the schools table (price_cents).
export const SUBSCRIPTION_PRICE_CENTS = 2000; // $20 / month
export const COACHING_PRICE_CENTS = 25000; // $250 one-time
