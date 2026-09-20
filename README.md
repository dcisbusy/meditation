# Sit — a tiny practice timer

A single-page timer for meditation, bodywork, or freewriting, deployed via
GitHub Pages. No build step, no required backend — everything lives in
`index.html` and your browser's `localStorage`, with an optional Google
Sheets backend for syncing across devices.

## Features

- **Three practice categories** — Meditation, Bodywork, Freewriting — each
  with their own stats page. Pick a category before you start; it's
  remembered next time you open the app.
- **Count up** (default): an open-ended stopwatch for a session with no
  fixed length.
- **Count down**: 2 / 5 / 10 minute presets. Ends itself with a deep,
  synthesized gong (no audio file — generated from layered sine partials in
  the Web Audio API). A manually-ended session (Finish, or a count-up
  session) plays a lighter chime instead. While a countdown runs the screen
  is kept awake (Screen Wake Lock API, where supported) so the phone doesn't
  time out and suspend the page before the gong. A web page can't ring while
  the phone is locked with the power button or another app is in front; in
  that case the countdown finishes and logs — stamped with the time it
  really ended — as soon as you come back.
- **Session log**: every completed session is timestamped and stored
  locally, tagged with its category.
- **Gentle stats**, based on habit-formation research (Lally et al.):
  - Habits took 18–254 days to become automatic in that research, averaging
    around two months — so the "habit journey" progress bar frames things as
    a range, not a deadline.
  - Missing an occasional day didn't meaningfully derail habit formation in
    that research, so a single skipped day doesn't break a streak.
    Under each timer, a Monday-first grid of the last five weeks (for the
    practice you're on) shows each day as **green** (done), **orange** (a
    one-day gap between two done days — streak kept) or **red** (any longer
    gap), with the current streak of green + orange days beside it. Days
    before your first session stay blank rather than red, and today stays
    neutral until it's over. The Stats tab's "day streak" uses the same
    rule. The Meditation / Bodywork / Freewriting buttons (on both the
    Timer and Stats tabs) are coloured to match: green if done today,
    orange if not yet today but done yesterday, red if neither — assuming
    you'll do it tomorrow — and left plain for a practice you've never
    logged. On the Stats tab, "All" counts a session in any practice.
  - Badges reward showing up (first session, session counts, active days)
    rather than only long sessions — starting small is the point.
- **Sync across devices (optional)**: back the app with a Google Sheet so
  every phone/computer you use shares the same log, and you can browse the
  raw data yourself in Sheets. See [Setting up sync](#setting-up-sync)
  below.
- **Local backup**: export/import your session history as JSON regardless
  of whether sync is set up.
- **Meditation styles (optional)**: in the Meditation category, eight
  buttons — seven evidence-backed techniques (Focused Attention, Open
  Monitoring, Body Scan, Noting, Loving-Kindness, Self-Compassion, RAIN)
  plus Zen Koans — each open a popup with a short evidence summary and a
  few prompts/koans, then **Select this style** or **Back**. Picking one
  tags that session (and shows up in Stats → Practice styles); leaving it
  unpicked logs the session with no style, exactly as before this existed.
  Zen Koans is included with an explicit caveat in its popup: it's
  traditionally a teacher-guided practice with no real controlled-study
  evidence behind self-guided use, offered here for reflection only, not
  as a validated technique like the other seven.

## Deploying

Enable GitHub Pages on this repo: **Settings → Pages → Source: Deploy from a
branch → `main` / `root`**. The site serves directly from `index.html`.

## Setting up sync

GitHub Pages is static hosting — it can't itself store writes from the app.
Google Sheets (via a small Apps Script "Web app") stands in as the backend,
and doubles as a place you can browse your own data.

1. Create a new Google Sheet (any name).
2. In it, go to **Extensions → Apps Script**, delete the placeholder
   `myFunction` code, and paste in the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs) from this repo.
3. In that pasted script, change the `SECRET` constant at the top to a
   password only you know.
4. **Deploy → New deployment** → type **Web app** → Execute as **Me** → Who
   has access **Anyone** → **Deploy**. Authorize it with your Google account
   when prompted (it's your own script, acting only on this one sheet).
5. Copy the Web App URL it gives you (ends in `/exec`).
6. In the app, open **Stats → Sync across devices**, paste that URL and your
   `SECRET`, then **Save & test**.
7. Repeat step 6 on every other device/browser — they'll all read and write
   the same Sheet, and a "Sessions" tab is created there automatically the
   first time a session is logged.

Sync is pull-on-open and push-on-log, plus a manual **Sync now** button — no
live sockets, just a plain fetch to the Web App URL, so it works fine from
a static GitHub Pages site.

Sync only ever adds rows locally — it never deletes. If you remove a row
from the Sheet, any device that already pulled it will still show it
locally; delete it there too using the × on that entry in Recent sessions.

### Updating an already-deployed script

If you set up sync before 2026-09-18, re-paste the current
[`apps-script/Code.gs`](apps-script/Code.gs) — it's picked up a couple of
fixes since:
- a bug where a blank `id` cell could make the same row reappear as a
  duplicate on every sync, plus forcing the timestamp columns to plain
  text so Sheets can't silently reformat them;
- a `style` column (auto-added to existing sheets too) for the optional
  meditation styles feature below.

Pasting new code alone doesn't update a live deployment — go to **Deploy →
Manage deployments**, click the pencil/edit icon on your existing
deployment, set **Version: New version**, then **Deploy**. The Web App URL
stays the same, so nothing needs re-pasting in the app itself.

## Privacy

No analytics, no accounts. Without sync configured, session data never
leaves the browser it was recorded in. With sync configured, data goes only
to the Google Sheet you created and control.
