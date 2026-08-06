# Avizaya — FINAL repo contents (free model)

This folder is the complete, final state of github.com/avizayaofficial/avizaya.
Everything avizaya.com needs is here: the app, plus the new free homepage, plus all
12 School 1 episodes (voice-edited) served free with no login.

## Make GitHub match this folder (two steps)

**Step 1 — upload.** Repo page → Add file → Upload files → drag in EVERYTHING inside
this folder (all files and all folders: app, components, content, lib, public, scripts,
supabase and the loose config files). Commit. GitHub overwrites files that changed and
adds the new ones. Vercel deploys automatically; a minute later avizaya.com shows the
new free homepage.

**Step 2 — delete the 5 strays.** These are at the repo ROOT from an earlier upload and
are NOT in this folder. In the repo, open each and delete (trash icon → commit):
1. `index.html` (root)
2. `manifesto.html` (root)
3. `README-PUBLISH.md` (root)
4. `school-1` folder (root — NOT public/school-1, that one stays)
5. `assets` folder (root — NOT public/assets, that one stays)

Also delete `tsconfig.tsbuildinfo` if you want a tidy repo (harmless either way).

## After that
- Repo → Settings → Pages → Source: None (avizaya.com is the only address).
- Repo → Settings → visibility: Private (Vercel serves private repos fine).

## What you get live
- avizaya.com — new homepage: hero, four pillars, 10 schools, School 1 open free
- avizaya.com/school-1/index.html — School 1 hub, 12 episodes, no login, no payment
- avizaya.com/manifesto.html — the manifesto
- Every email form saves straight into your Supabase email_subscribers table
- Login, Stripe, scholarship, /join all still intact underneath for later phases

## Publishing School 2 later
Add a `public/school-2/` folder (same pattern as school-1) and give School 2 an
`href: '/school-2/index.html'` in the SCHOOLS list in `app/page.tsx`. Done.
