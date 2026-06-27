# Casa Rubio — Maeve's Hours

A single-file timesheet web app. Maeve (nanny) logs the days she works; at the end of
each week the household submits the week, which records a payout and pushes the week's
rows into a Google Sheet for payroll.

## Files
- `index.html` — the entire app. HTML, CSS, and JS in one file. This is the only file
  that ships. Keep it self-contained (no build step, no external JS deps except the
  Google Fonts `<link>`).
- `Code.gs` — the Google Apps Script that lives inside the Google Sheet (not deployed
  from this repo). It receives POSTs from the app and appends rows. Only touch when the
  sheet payload format changes.
- `maeves-hours-webflow-embed.html` — a generated copy wrapping index.html in an iframe
  srcdoc for pasting into Webflow. Regenerate from index.html if you ship one there.

## How it's hosted
Deployed to Netlify (static). The live URL serves `index.html`. Pushing to the connected
branch auto-deploys. There is no server; all logic is client-side.

## Data + storage
- App state persists to the browser. It uses `window.storage` when present (Claude
  artifact preview) and falls back to `localStorage` otherwise (real hosting). Storage
  key: `nanny-timesheet`. Shape: `{ rate, shifts:[], payouts:[], sheetUrl }`.
- A "week" runs Sunday–Saturday. Active (un-submitted) days live in `shifts`. Submitting
  a week snapshots its days into a `payouts` entry and removes them from `shifts`.
- Submitting also POSTs the week to the Google Apps Script URL (set in Settings) with
  `mode:"no-cors"`. We can't read the response, so a week is marked synced optimistically.

## Tabs
- Log: calendar (future days disabled, selected week highlighted), day entry (Start/End
  default to 9:00am/2:00pm, Expenses note), Add day, and the in-progress week receipt with
  Submit week.
- History: green payout records with day breakdowns; Undo/reopen pulls a week back to Log.
- Settings: hourly rate and the Google Sheet sync URL.

## Product rules (do not break)
- Maeve can never log a future date.
- Hours are computed from start/end only (overnight past midnight handled). No break field.
- Rate changes only affect un-submitted weeks; recorded payouts are locked.
- Submitting a week switches to the History tab so she sees confirmation.
- Visual style is MoMA-inspired: heavy black Archivo type, white background, square
  buttons, one blue accent (#1496d8), green (#0f8a3c) for paid/payouts, red (#e8400f)
  for warnings/expenses. Keep it.

## Testing
Before shipping, sanity-check in a headless DOM (jsdom): the calendar renders, Add day
logs a day with the default times, and Submit week (with a rate set) moves to History and
records a payout with no console errors.

## Deploy
Commit + push to the connected branch; Netlify rebuilds and serves the same URL.
Keep `index.html` as the entry file at the repo root.
