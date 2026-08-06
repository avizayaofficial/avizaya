# Avizaya Website — Publish Guide

This folder is the complete, ready-to-deploy Avizaya website.
School 1 (The Abandoned Girl, 12 episodes) is live content. Schools 2–10 show as "Coming soon."

## What's inside

```
index.html            Homepage — hero, four pillars, 10-school grid, email signup
manifesto.html        The founding manifesto
school-1/index.html   School 1 hub — all 12 episodes
school-1/ep-01…12.html  The 12 episode pages (your master-doc text, word for word)
assets/avizaya.css    One shared stylesheet for the whole site
assets/*.svg          Logos and seals
```

## Publish on GitHub Pages (5 minutes)

1. Open your repo **avizayaofficial/avizayaofficial.github.io** on github.com.
2. Delete or archive any old files there, then upload the CONTENTS of this folder
   (index.html, manifesto.html, the school-1 folder, the assets folder) to the repo root.
   Easiest way: repo page → "Add file" → "Upload files" → drag everything in → Commit.
3. The repo must be **public** for GitHub Pages to serve it free. Since everything on
   this site is free content anyway, public is fine — your unpublished schools 2–10
   are NOT in this folder, so nothing unreleased is exposed.
4. Site goes live at https://avizayaofficial.github.io within a minute or two.
5. Custom domain (avizaya.com): repo → Settings → Pages → Custom domain → enter
   avizaya.com, then at your domain registrar point an A/CNAME record per GitHub's
   instructions shown on that page.

## Connect the email signup (10 minutes, do this before promoting)

The signup forms currently show a friendly "being connected" note when submitted.
To make them live with Mailchimp:

1. In Mailchimp: Audience → Signup forms → Embedded forms → copy the form's
   **action URL** (looks like `https://xxxx.usXX.list-manage.com/subscribe/post?u=…&id=…`).
2. In each of the 15 HTML files, find `<form` and:
   - replace `action="#"` with `action="THAT-URL"`
   - change `method="post"` stays as is
   - remove `data-provider="unconnected"`
   (Or ask Claude to do this swap across all files in one pass — one sentence.)

## Adding the next school later

Ask Claude: "publish school 2" — the pattern is already set:
- new folder `school-2/` with an index + episode pages (same template)
- flip School 2's card in index.html from `locked` to `open` with a link

Everything uses the shared stylesheet, so new schools inherit the design automatically.
