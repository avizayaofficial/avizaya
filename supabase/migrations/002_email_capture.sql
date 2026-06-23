-- ============================================================
-- AVIZAYA - MIGRATION 002: EMAIL CAPTURE
-- ============================================================
-- Run this in the Supabase SQL Editor AFTER 001_initial_schema.sql.
-- This stores emails collected from your social media bio links,
-- the home page, and anywhere else you point traffic.
-- ============================================================

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,                 -- where they came from: 'tiktok', 'instagram', 'youtube', 'home', etc.
  tag text,                    -- optional campaign label, e.g. 'school-1-launch'
  created_at timestamptz default now() not null,
  unique (email)
);

create index if not exists idx_email_subscribers_source
  on public.email_subscribers(source);
create index if not exists idx_email_subscribers_created
  on public.email_subscribers(created_at desc);

-- Row-level security: anyone may subscribe (public form), but
-- nobody can READ the list through the public API. Only the
-- service-role key (used server-side) can read or export it.
alter table public.email_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.email_subscribers;
create policy "Anyone can subscribe" on public.email_subscribers
  for insert with check (true);

-- ============================================================
-- HOW TO SEE / EXPORT YOUR LIST
-- ============================================================
-- In Supabase: Table Editor -> email_subscribers, or run:
--   select email, source, created_at
--   from public.email_subscribers
--   order by created_at desc;
-- Export: Table Editor -> ... menu -> Export to CSV.
-- ============================================================
