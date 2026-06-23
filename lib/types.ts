// ============================================================
// AVIZAYA - TYPESCRIPT TYPES
// ============================================================
// These types mirror the Supabase schema.
// Update both when adding new fields.
// ============================================================

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type School = {
  id: number;
  slug: string;
  display_number: number;
  title: string;
  subtitle: string | null;
  tagline: string | null;
  description: string | null;
  cover_color: 'plum' | 'green';
  price_cents: number;
  stripe_price_id: string | null;
  is_published: boolean;
  is_coming_soon: boolean;
  total_episodes: number;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Episode = {
  id: number;
  school_id: number;
  episode_number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  html_content: string;
  word_count: number | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type SchoolPurchase = {
  id: string;
  user_id: string;
  school_id: number;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  purchased_at: string;
};

export type CoachingSession = {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  cal_booking_id: string | null;
  status: 'pending' | 'scheduled' | 'completed' | 'canceled';
  amount_cents: number;
  scheduled_for: string | null;
  purchased_at: string;
  updated_at: string;
};

export type ReadingPosition = {
  user_id: string;
  episode_id: number;
  scroll_percent: number;
  font_size_px: number;
  last_read_at: string;
};

export type ScholarshipRequest = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  situation: string;
  requested_tier: 'subscription' | 'school' | 'coaching';
  requested_school_id: number | null;
  status: 'pending' | 'approved' | 'denied';
  admin_notes: string | null;
  coupon_code: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type EmailSubscriber = {
  id: string;
  email: string;
  source: string | null;
  tag: string | null;
  created_at: string;
};

// Helper type: school combined with user's access status
export type SchoolWithAccess = School & {
  has_access: boolean;
  access_reason: 'subscription' | 'purchased' | 'none';
};

// Helper type: episode combined with reading position
export type EpisodeWithProgress = Episode & {
  scroll_percent: number;
  last_read_at: string | null;
};
