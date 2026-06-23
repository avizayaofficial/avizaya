-- ============================================================
-- AVIZAYA - INITIAL DATABASE SCHEMA
-- ============================================================
-- Run this in Supabase SQL Editor on a fresh project.
-- This schema is INFINITELY EXTENSIBLE - schools and episodes
-- are database rows, not hard-coded constants.
-- ============================================================

-- ─── PROFILES (extends Supabase auth.users) ─────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── SCHOOLS (infinitely extensible) ────────────────────────
-- Add a new school: insert a row. No code changes needed.
create table public.schools (
  id serial primary key,
  slug text not null unique,                    -- e.g. 'abandoned-girl'
  display_number integer not null unique,       -- 1, 2, 3...
  title text not null,                          -- 'The Abandoned Girl'
  subtitle text,                                -- 'School 1'
  tagline text,                                 -- 'Your healing begins...'
  description text,
  cover_color text default 'plum',              -- 'plum' or 'green'
  price_cents integer not null default 5000,    -- $50 = 5000 cents
  stripe_price_id text,                         -- Stripe Price ID for this school
  is_published boolean default false,
  is_coming_soon boolean default false,         -- Show as "coming soon" tile
  total_episodes integer default 0,
  display_order integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─── EPISODES (infinitely extensible) ───────────────────────
-- Add a new episode: insert a row.
create table public.episodes (
  id serial primary key,
  school_id integer references public.schools(id) on delete cascade not null,
  episode_number integer not null,              -- 1, 2, 3... within school
  slug text not null,                           -- e.g. 'healing-begins'
  title text not null,
  subtitle text,
  html_content text not null,                   -- Full episode HTML
  word_count integer,
  is_published boolean default false,
  display_order integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (school_id, episode_number)
);

-- ─── SUBSCRIPTIONS ──────────────────────────────────────────
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null,                         -- active|canceled|past_due|incomplete
  current_period_end timestamptz,               -- Access cutoff date
  cancel_at_period_end boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─── SCHOOL PURCHASES (one-time, permanent) ─────────────────
create table public.school_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  school_id integer references public.schools(id) on delete cascade not null,
  stripe_payment_intent_id text unique,
  amount_cents integer not null,
  purchased_at timestamptz default now() not null,
  unique (user_id, school_id)
);

-- ─── COACHING SESSIONS ──────────────────────────────────────
create table public.coaching_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_payment_intent_id text unique,
  cal_booking_id text,
  status text default 'pending',                -- pending|scheduled|completed|canceled
  amount_cents integer not null default 29900,
  scheduled_for timestamptz,
  purchased_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─── READING POSITIONS (silent autosave) ────────────────────
create table public.reading_positions (
  user_id uuid references public.profiles(id) on delete cascade not null,
  episode_id integer references public.episodes(id) on delete cascade not null,
  scroll_percent numeric(5,2) default 0,        -- 0.00 to 100.00
  font_size_px integer default 16,              -- Reader zoom level
  last_read_at timestamptz default now() not null,
  primary key (user_id, episode_id)
);

-- ─── SCHOLARSHIP REQUESTS (Dina's accessibility commitment) ─
create table public.scholarship_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text not null,
  full_name text,
  situation text not null,                      -- Why they need a scholarship
  requested_tier text not null,                 -- 'subscription'|'school'|'coaching'
  requested_school_id integer references public.schools(id),
  status text default 'pending',                -- pending|approved|denied
  admin_notes text,
  coupon_code text,                             -- If approved, Stripe coupon code
  created_at timestamptz default now() not null,
  reviewed_at timestamptz
);

-- ─── INDEXES ────────────────────────────────────────────────
create index idx_episodes_school on public.episodes(school_id, episode_number);
create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_school_purchases_user on public.school_purchases(user_id);
create index idx_reading_positions_user on public.reading_positions(user_id);
create index idx_scholarship_status on public.scholarship_requests(status);

-- ─── ROW-LEVEL SECURITY ─────────────────────────────────────
-- All tables locked down by default. Users can only see their own data.

alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.episodes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.school_purchases enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.reading_positions enable row level security;
alter table public.scholarship_requests enable row level security;

-- Profiles: user sees their own profile
create policy "Users see own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Schools: anyone authenticated can see published schools
create policy "Anyone sees published schools" on public.schools
  for select using (is_published = true or is_coming_soon = true);

-- Episodes: users see episodes they have access to
-- (access logic enforced in app layer; this policy is permissive but
-- combined with app-layer canAccessSchool() check before content delivery)
create policy "Authenticated users can read episode metadata" on public.episodes
  for select using (auth.uid() is not null and is_published = true);

-- Subscriptions: user sees own
create policy "Users see own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- School purchases: user sees own
create policy "Users see own purchases" on public.school_purchases
  for select using (auth.uid() = user_id);

-- Coaching: user sees own
create policy "Users see own coaching" on public.coaching_sessions
  for select using (auth.uid() = user_id);

-- Reading positions: user manages own
create policy "Users manage own positions" on public.reading_positions
  for all using (auth.uid() = user_id);

-- Scholarship requests: user sees own
create policy "Users see own scholarship requests" on public.scholarship_requests
  for select using (auth.uid() = user_id);
create policy "Anyone can create scholarship request" on public.scholarship_requests
  for insert with check (true);

-- ─── SEED DATA: ALL 10 SCHOOLS ──────────────────────────────
-- School 1 is published. Schools 2-10 are coming soon.
-- Easily add School 11, 12, 13... later by inserting more rows.

insert into public.schools (slug, display_number, title, subtitle, tagline, cover_color, price_cents, is_published, is_coming_soon, total_episodes, display_order) values
  ('abandoned-girl',    1, 'The Abandoned Girl',   'School 1',  'Your healing begins when you stop abandoning yourself.',                                'plum',  5000, true,  false, 12, 1),
  ('body-temple',       2, 'The Body Temple',      'School 2',  'Your body is not your enemy. It is your vessel.',                                       'plum',  5000, false, true,  10, 2),
  ('inner-architect',   3, 'The Inner Architect',  'School 3',  'Your habits are your prayer.',                                                          'plum',  5000, false, true,  10, 3),
  ('sacred-woman',      4, 'The Sacred Woman',     'School 4',  'She knows who she is before the room confirms it.',                                     'plum',  5000, false, true,  10, 4),
  ('woman-who-builds',  5, 'The Woman Who Builds', 'School 5',  'God is not glorified by your broke.',                                                   'green', 5000, false, true,  10, 5),
  ('genesis-blueprint', 6, 'The Genesis Blueprint','School 6',  'The blueprint was always there.',                                                       'plum',  5000, false, true,  10, 6),
  ('jesus-mba',         7, 'The Jesus MBA',        'School 7',  'Every parable is a masterclass.',                                                       'plum',  5000, false, true,  10, 7),
  ('sacred-body',       8, 'The Sacred Body',      'School 8',  'So sacred that only a covenant is worthy of it.',                                       'plum',  5000, false, true,  10, 8),
  ('sacred-family',     9, 'The Sacred Family',    'School 9',  'The destruction stops here.',                                                           'green', 5000, false, true,  10, 9),
  ('sacred-mind',      10, 'The Sacred Mind',     'School 10', 'The mind is the only battlefield that matters.',                                        'plum',  5000, false, true,  10, 10);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
-- After running this, manually load episode content via:
--   npm run import:episodes
-- That script reads the locked HTML files and inserts into episodes table.
-- ============================================================
