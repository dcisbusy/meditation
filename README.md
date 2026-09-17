# Sit — a tiny meditation timer

A single-page meditation timer, deployed via GitHub Pages. No build step,
no backend — everything lives in `index.html` and your browser's
`localStorage`.

## Features

- **Count up** (default): an open-ended stopwatch for a sit with no fixed length.
- **Count down**: 2 / 5 / 10 minute presets, finishes itself with a soft chime.
- **Session log**: every completed sit is timestamped and stored locally.
- **Gentle stats**, based on habit-formation research (Lally et al.):
  - Habits took 18–254 days to become automatic in that research, averaging
    around two months — so the "habit journey" progress bar frames things as
    a range, not a deadline.
  - Missing an occasional day didn't meaningfully derail habit formation in
    that research, so the streak counter tolerates a single skipped day
    instead of resetting to zero on the first miss.
  - Badges reward showing up (first sit, session counts, active days) rather
    than only long sessions — starting small (a few minutes) is the point.
- **Backup/restore**: export/import your session history as JSON, since
  `localStorage` is per-browser and can be cleared.

## Deploying

Enable GitHub Pages on this repo: **Settings → Pages → Source: Deploy from a
branch → `main` / `root`**. The site serves directly from `index.html`.

## Privacy

No analytics, no accounts, no network calls. Session data never leaves the
browser it was recorded in unless you export it yourself.
