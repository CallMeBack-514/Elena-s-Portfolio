# Public pages are pre-built; saving triggers a rebuild, plus one every 3 days

Visitor-facing pages are built ahead of time from Supabase and served as static files, so the public site never depends on Supabase at request time (fast, and unaffected if the free project pauses). Saving a Published Entry triggers a rebuild (~1–2 min to go live). A Cloudflare Cron Trigger also rebuilds every 3 days: this keeps the free Supabase project from pausing after ~7 idle days (which would lock Elena out until restored by hand) and surfaces build breakage early.

## Considered Options

- Rendering public pages per request — rejected: slower, and pages would fail whenever Supabase pauses.
- A GitHub Actions schedule — rejected: GitHub disables scheduled workflows in public repos after 60 days without commits.
- A bare "ping" request instead of a rebuild — rejected: keeps Supabase awake but tests nothing.
