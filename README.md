# Avizaya — Phase 1 (Delivery 1: Foundation)

A Next.js 14 + TypeScript + Tailwind + Supabase application for the Avizaya women's transformation program.

This is **Delivery 1 of 3**. It contains the full foundation:

- Sales page at the root
- Magic-link authentication (email login, no passwords)
- Supabase database with infinitely extensible schools/episodes schema
- Library dashboard with school tiles
- Zero-chrome reader with silent autosave of scroll position and font size
- All 12 School 1 episodes ready to import

Delivery 2 adds Stripe payments. Delivery 3 adds Cal.com coaching integration and admin tools.

---

## What you'll have at the end of Delivery 1

A working avizaya.com where:

- Anyone can visit the home page and see the manifesto and pricing
- Anyone can enter their email to receive a magic login link
- Once logged in, they see the library with 1 active tile (School 1) and 9 "coming soon" tiles
- They can click into School 1 and read all 12 episodes
- Their scroll position and zoom level are silently remembered across sessions

What's NOT in Delivery 1: payments. For now, you'll manually grant access to test users by inserting rows into `school_purchases` table via Supabase dashboard. Delivery 2 wires up Stripe.

---

## Setup (≈90 minutes total)

### 1. Local prerequisites

You'll need:

- **Node.js 20+** ([download](https://nodejs.org))
- **Git** ([download](https://git-scm.com))
- A **code editor** (VS Code recommended)

Open your terminal in this project folder and run:

```bash
npm install
```

This downloads all dependencies. Takes 1-3 minutes.

### 2. Supabase project (10 min)

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name: `avizaya`, choose a strong database password (save it)
3. Region: closest to your customers (US East is fine for Texas)
4. Wait for it to spin up (~2 minutes)
5. Once ready, go to **Settings → API** and copy:
   - `Project URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (under "service_role secret") → this is `SUPABASE_SERVICE_ROLE_KEY`
6. Go to **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (for now; change to `https://avizaya.com` after deploy)
   - Redirect URLs: add `http://localhost:3000/auth/callback` and (later) `https://avizaya.com/auth/callback`

### 3. Run the database schema (5 min)

1. In Supabase dashboard, go to **SQL Editor → New Query**
2. Open `supabase/migrations/001_initial_schema.sql` from this project
3. Copy the entire contents into the SQL Editor
4. Click "Run"
5. You should see "Success. No rows returned." This creates all tables and seeds the 10 schools (1 published, 9 coming soon)

### 4. Environment variables (5 min)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS` (your email)
3. Leave Stripe/Resend/Cal.com variables blank for now — Delivery 2

### 5. Import the 12 episodes (2 min)

```bash
npm run import:episodes
```

You should see:
```
Found school: The Abandoned Girl (id=1)
Found 12 episode files. Importing...
  ✓  Ep 1: Your healing begins when you stop abandoning yourself (...)
  ✓  Ep 2: Who you are when no one is watching (...)
  ...
Done. Imported 12 episodes into School 1.
```

### 6. Run locally (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the Avizaya home page.

To test the full flow:
1. Click "Begin" on the home page
2. Enter your email
3. Check your email inbox for the Supabase magic-link email
4. Click the link → it redirects you into the library
5. School 1 tile shows "Unlock for $50" (since payments aren't wired yet, this won't work — see Delivery 2)
6. To grant yourself test access: in Supabase, go to **Table Editor → school_purchases** and insert a row:
   - `user_id`: your user's UUID (from the auth.users table)
   - `school_id`: 1
   - `amount_cents`: 0
7. Refresh the library — now School 1 tile says "Begin reading →"
8. Click into it → read the 12 episodes
9. Try zoom in / zoom out / close — confirm everything works

---

## Deploy to production (≈30 min)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Avizaya foundation"
git branch -M main
# Create a new private repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/avizaya.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → "New Project"
2. Import your GitHub repo
3. Framework Preset: Next.js (auto-detected)
4. **Environment Variables**: copy every line from your `.env.local` into Vercel's env var settings
5. Click "Deploy"
6. After deploy, Vercel gives you a URL like `avizaya-abc123.vercel.app`

### 3. Connect avizaya.com domain

1. In Vercel project → **Settings → Domains** → "Add domain" → `avizaya.com`
2. Vercel shows you DNS records to add at your domain registrar (likely an A record or CNAME)
3. Add those records at your registrar
4. Wait 5-30 minutes for DNS propagation
5. Verify `https://avizaya.com` shows the home page

### 4. Update Supabase auth URLs

Go back to Supabase **Authentication → URL Configuration**:
- Update Site URL to `https://avizaya.com`
- Add `https://avizaya.com/auth/callback` to redirect URLs

### 5. Test production

Repeat the local test flow on `https://avizaya.com`. Confirm magic-link email works in production.

---

## What's next (Delivery 2)

After you've confirmed Delivery 1 is working, we add:

- Stripe Checkout for all three products ($20/mo subscription, $50/school, $299/coaching)
- Stripe webhook handler that grants access automatically when payment succeeds
- Access control logic that hides locked content
- Account page with subscription management (pause, cancel, view invoices)

---

## File structure reference

```
avizaya/
├── app/
│   ├── account/page.tsx           # User account page
│   ├── api/
│   │   └── reading-position/      # Silent autosave endpoint
│   ├── auth/callback/             # Magic-link verification
│   ├── library/page.tsx           # School tiles dashboard
│   ├── login/page.tsx             # Magic-link entry
│   ├── read/[school]/[episode]/   # Reader pages
│   ├── globals.css                # Brand colors + Tailwind base
│   ├── layout.tsx                 # Root layout (loads fonts)
│   ├── not-found.tsx              # 404 page
│   └── page.tsx                   # Sales page (home)
├── components/
│   └── Reader.tsx                 # Zero-chrome reader with autosave
├── content/school-1/              # 12 LOCKED HTML episode files
├── lib/
│   ├── supabase.ts                # Auth/DB helpers + canAccessSchool
│   └── types.ts                   # TypeScript types
├── scripts/
│   └── import-episodes.ts         # One-time episode import
├── supabase/migrations/
│   └── 001_initial_schema.sql     # Full database schema + 10 schools seeded
├── middleware.ts                  # Route protection
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Adding new schools later (the infinite extensibility)

Schools are database rows, not code. To add School 11 in the future:

1. Go to Supabase → Table Editor → schools → Insert row
2. Fill in: `slug`, `display_number=11`, `title`, `tagline`, `price_cents`, `display_order=11`
3. Set `is_published=true` once content is ready
4. Add episodes to the `episodes` table (or run a modified import script)

No code changes. No redeploy. The library automatically shows the new tile.

---

## Troubleshooting

- **Magic-link email never arrives**: Check Supabase **Authentication → Logs** for SMTP errors. Supabase's built-in email has low limits; for production you should configure custom SMTP via Resend (Delivery 3).

- **"User not found" after clicking magic link**: Check that the email confirmation URL matches your Supabase auth configuration's redirect URLs.

- **Reader shows blank page**: Open browser console. Most likely the episode HTML didn't import correctly — re-run `npm run import:episodes`.

- **Build fails on Vercel**: Check that all environment variables are set in Vercel project settings, not just locally.

---

## Brand standards built into the system

- Plum `#2C1A4A` for headers and CTAs
- Gold `#C4955A` for accents
- Ivory `#F7F2EC` for backgrounds
- Cormorant Garamond serif + Jost sans-serif
- US English spellings throughout
- No em dashes anywhere (PERMANENT RULE)
- Typographic quotes for all dialogue
- Faceless brand presentation

Built by Dina Novik. School 1 content locked May 2026.
