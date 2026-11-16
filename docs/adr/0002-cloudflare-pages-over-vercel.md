# Host on Cloudflare Pages, not Vercel

The site must be free to host. Vercel's free (Hobby) plan is limited to personal, non-commercial use, and a portfolio meant to win paid commissions sits in a grey area; Cloudflare Pages' free plan permits commercial use, has unlimited bandwidth, per-PR previews and Astro support, and also gives us a free scheduler (Cron Triggers) with no inactivity cut-off. Chosen before anything was deployed, so the switch cost nothing. No custom domain: the site lives on a free `*.pages.dev` subdomain.

## Considered Options

- Vercel (original plan) — rejected for the licence grey area.
- Netlify — viable, but Cloudflare's scheduler also solves ADR-0003.
