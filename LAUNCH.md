# LAUNCH — Avizaya, from code to taking cards on avizaya.com

This is the only document you need to go live. Work top to bottom. Total time
is roughly 90 minutes the first time. Do it in TEST mode first, confirm a fake
purchase unlocks a school, then flip to LIVE.

What is already done in this build:
- The reader (scroll only, no prev/next, zoom and ✕ to close) — done.
- All 12 School 1 episodes — included, ready to import.
- Stripe checkout for both offers ($50/school, $250 coaching) — done.
  (Monthly membership is built but hidden for now; flip it on later.)
- The webhook that auto-unlocks access on payment — done. You never touch the
  database after a sale.
- Email capture from your social bio link (avizaya.com/join) — done.
- Scholarship request page and form — done.
- A latent build bug in the original scaffold — fixed.
- Next.js patched to a secure version — done.

You do NOT need to create any Products or Prices inside Stripe. Pricing is in
the code. You only paste in two Stripe keys.

--------------------------------------------------------------------------
STEP 1 — Supabase (about 15 min)
--------------------------------------------------------------------------
1. Go to supabase.com, create a new project named "avizaya". Save the database
   password somewhere safe. Pick the US East region.
2. When it is ready: Settings -> API. Copy these three values, you will need
   them in Step 4:
   - Project URL          (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key       (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role secret   (SUPABASE_SERVICE_ROLE_KEY)  <- keep this private
3. SQL Editor -> New Query. Open the file
   supabase/migrations/001_initial_schema.sql, paste the entire contents, Run.
   You should see "Success. No rows returned."
4. SQL Editor -> New Query again. Open
   supabase/migrations/002_email_capture.sql, paste, Run. This creates the
   email list table.
5. Authentication -> URL Configuration:
   - Site URL: https://avizaya.com
   - Redirect URLs: add both
       http://localhost:3000/auth/callback
       https://avizaya.com/auth/callback

--------------------------------------------------------------------------
STEP 2 — Stripe keys (about 10 min)  [you do this part yourself]
--------------------------------------------------------------------------
1. Go to dashboard.stripe.com. Make sure the toggle says "Test mode" for now.
2. Developers -> API keys. Copy the "Secret key" (starts with sk_test_...).
   This is STRIPE_SECRET_KEY.
3. The webhook secret comes in Step 6 after the site is deployed. Leave it
   blank for now.

Note: entering your Stripe keys and connecting your bank/payout details is
something you do directly in your own Stripe and Vercel accounts. I never
handle those values.

--------------------------------------------------------------------------
STEP 3 — Run it on your own computer first (about 15 min)
--------------------------------------------------------------------------
1. Install Node.js 20+ from nodejs.org if you do not have it.
2. In this project folder, run:
       npm install
3. Copy the env template and fill it in:
       cp .env.example .env.local
   Fill in the three Supabase values, your sk_test_ Stripe key, set
   NEXT_PUBLIC_APP_URL=http://localhost:3000, and your email in ADMIN_EMAILS.
   Leave STRIPE_WEBHOOK_SECRET as the placeholder for now.
4. Import the 12 episodes into the database:
       npm run import:episodes
   You should see 12 green checkmarks.
5. Start it:
       npm run dev
   Open http://localhost:3000. The home page should load.

--------------------------------------------------------------------------
STEP 4 — Deploy to Vercel (about 20 min)
--------------------------------------------------------------------------
1. Put the code on GitHub (private repo):
       git init
       git add .
       git commit -m "Avizaya: payments + email capture"
       git branch -M main
       git remote add origin https://github.com/YOUR_USERNAME/avizaya.git
       git push -u origin main
2. Go to vercel.com -> New Project -> import that repo. Framework is detected
   as Next.js automatically.
3. Environment Variables: add every line from your .env.local. Change
   NEXT_PUBLIC_APP_URL to https://avizaya.com.
4. Deploy. Vercel gives you a temporary URL like avizaya-xxx.vercel.app.

--------------------------------------------------------------------------
STEP 5 — Connect avizaya.com (about 15 min)  [you do the DNS yourself]
--------------------------------------------------------------------------
1. Vercel project -> Settings -> Domains -> Add domain -> avizaya.com.
2. Vercel shows you DNS records. Add them at your domain registrar (wherever
   you bought avizaya.com). Wait 5 to 30 minutes.
3. Confirm https://avizaya.com loads.

--------------------------------------------------------------------------
STEP 6 — The Stripe webhook (about 10 min)  [the part that auto-unlocks]
--------------------------------------------------------------------------
1. Stripe dashboard (still Test mode) -> Developers -> Webhooks -> Add endpoint.
2. Endpoint URL:  https://avizaya.com/api/webhook/stripe
3. Select events to send. Add these four:
       checkout.session.completed
       customer.subscription.updated
       customer.subscription.deleted
       invoice.paid
4. Create it. Stripe shows a "Signing secret" (starts with whsec_...).
5. In Vercel -> Settings -> Environment Variables, set STRIPE_WEBHOOK_SECRET to
   that whsec_ value. Redeploy (Vercel -> Deployments -> ... -> Redeploy).

--------------------------------------------------------------------------
STEP 7 — Test the whole money path in TEST mode (about 10 min)
--------------------------------------------------------------------------
1. On https://avizaya.com click Begin, enter your email, get the magic link,
   click it. You land in the library. School 1 says "Unlock for $50".
2. Click Unlock. You are sent to Stripe Checkout. Use the test card:
       4242 4242 4242 4242 , any future date, any CVC, any ZIP.
3. After payment you land on the success page. Within a few seconds, open the
   library and School 1 should now say "Begin reading". Open it and confirm the
   reader works (scroll, zoom, ✕).
4. Test the email capture: open https://avizaya.com/join?src=test , submit an
   email, then check Supabase -> Table Editor -> email_subscribers for the row.

If access did not unlock: Stripe -> Developers -> Webhooks -> your endpoint ->
check the recent deliveries for errors. The usual cause is a wrong or missing
STRIPE_WEBHOOK_SECRET in Vercel.

--------------------------------------------------------------------------
STEP 8 — Go LIVE
--------------------------------------------------------------------------
1. Stripe: flip the dashboard from Test mode to Live mode.
2. Developers -> API keys: copy the LIVE secret key (sk_live_...).
3. Redo Step 6 in Live mode: create the webhook endpoint again (live webhooks
   are separate from test), get the live whsec_.
4. In Vercel, replace STRIPE_SECRET_KEY with sk_live_... and
   STRIPE_WEBHOOK_SECRET with the live whsec_. Redeploy.
5. Do one real purchase of School 1 on yourself with a real card to confirm the
   live path, then refund yourself from the Stripe dashboard.

You are live.

--------------------------------------------------------------------------
YOUR SOCIAL MEDIA BIO LINK
--------------------------------------------------------------------------
Put this in your Instagram / TikTok / YouTube bio to collect emails:
    https://avizaya.com/join?src=instagram
    https://avizaya.com/join?src=tiktok
    https://avizaya.com/join?src=youtube
The src tag tells you which platform each email came from, so you can see what
is actually working. View or export the list in Supabase -> Table Editor ->
email_subscribers.

--------------------------------------------------------------------------
ADDING SCHOOLS 2 THROUGH 10 LATER (no code, no redeploy)
--------------------------------------------------------------------------
Schools 2-10 already exist as "coming soon" tiles. When a school's content is
ready: in Supabase, insert the episode rows into the episodes table, then edit
that school's row to set is_published = true and is_coming_soon = false. The
tile flips to purchasable on its own. Pricing for each school is the price_cents
column on that row.

--------------------------------------------------------------------------
ONE THING TO DECIDE BEFORE A REAL LAUNCH: email deliverability
--------------------------------------------------------------------------
The magic-link login email uses Supabase's built-in email, which has low daily
limits and lands in spam more often. Before you push real traffic, connect a
real sender (Resend is already a dependency) under Supabase -> Authentication
-> Email -> SMTP settings. This is a 20-minute job and matters more than any
design tweak, because a login email that never arrives is a customer you lost
after they already decided to pay.
