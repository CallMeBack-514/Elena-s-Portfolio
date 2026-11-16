# Threat model

This site is 95% public static content with no visitor accounts and no
visitor data collection. The entire threat surface that matters is the
**Portal**: one sign-in, one set of write routes, one file upload path — plus
two places where the server reads content from other sites: the Article
link auto-fetch and the feed imports. Vocabulary follows `GLOSSARY.md`.

## Data classification

| Data                                                                                | Classification                                                                                                                                                                                       | Where it lives                                                           |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Public content entries (article links, video embeds, photo metadata, podcast links) | Public — this is the whole point of the site                                                                                                                                                         | Supabase Postgres, served to everyone                                    |
| Elena's login credentials                                                           | Secret                                                                                                                                                                                               | Supabase Auth (managed; never stored or logged by this app)              |
| Uploaded photo files                                                                | Public once published (they're portfolio content), but **write access is secret**                                                                                                                    | Supabase Storage                                                         |
| Session tokens/cookies                                                              | Secret, short-lived                                                                                                                                                                                  | Browser cookie + Supabase session, server-validated per request          |
| Deploy hook URL, Supabase service-role key                                          | Secret                                                                                                                                                                                               | Cloudflare environment variables only — never in the repo or the browser |
| Content fetched from other sites (Article pages, Substack and podcast feeds)        | Public, but **untrusted**: written by third parties                                                                                                                                                  | Parsed on the server or at build time; only selected fields stored       |
| Visitor data                                                                        | **None collected** — no forms, no accounts, no analytics in v1. The theme choice is kept only in the Visitor's own browser. Third-party players (YouTube, Spotify fallback) load only after a click. | n/a                                                                      |

There is no personal data belonging to third parties in this system. The
only "user" with an account is Elena herself. This keeps the blast radius
of a breach to: defacement/vandalism of her public portfolio content, not
exposure of anyone's private information.

## Tenancy model

Single-tenant, single-user. There is exactly one admin account. No
organization/workspace concept, no per-resource ownership checks needed
beyond "is this request authenticated as the one admin." If a second
account type is ever added (see mission.md "out of scope"), this threat
model must be rewritten before that feature starts — multi-user changes
every assumption below.

## Who sees what

- **Everyone (unauthenticated)**: all Published Entries and Text blocks, all
  public pages. Read-only. Drafts, hidden Episodes and hidden Posts are
  never readable without signing in — enforced by Row Level Security, not
  only by the pages' code.
- **Elena (authenticated)**: everything above, plus create/edit/order/delete
  on Entries and Text blocks, file upload, Article auto-fetch, hiding
  Episodes and Posts, and sign-out.
- **The build** (Cloudflare, at build time): reads Published content only,
  with a read-only key. It never needs the service-role key.
- **No one else**: has any write access. There is no "editor" or "viewer"
  role to misconfigure in v1 — the absence of a role system is itself the
  mitigation for privilege-escalation bugs. If roles are added later,
  threat-model.md gets revisited first.

## Sensitive areas (mirrors mission.md — Critical track, no downgrade)

1. **Authentication** — email + password sign-in and password reset only
   (ADR-0004: no second factor, a deliberate, accepted risk). Must use
   Supabase Auth's built-in flows; do not hand-roll password hashing, token
   generation, or session logic. Supabase's sign-in rate limiting must stay
   enabled and must not be loosened.
2. **Portal write routes** (create/edit/order/delete/publish an Entry or
   Text block, hide an Episode or Post, trigger a rebuild) — must
   verify the request is an authenticated session belonging to the admin
   before any write. Every write route, no exceptions, no "it's just an
   internal tool" shortcuts.
3. **File upload handling** — must validate file type and size before
   accepting an upload; uploaded files must not be executable or
   interpretable as site code; storage bucket permissions must not allow
   anonymous writes.
4. **Session handling** — cookies must be `httpOnly`, `secure`, and scoped
   correctly; sessions must expire; sign-out must actually invalidate the
   session server-side, not just clear a client cookie.
5. **Server-side URL fetching** (Article auto-fetch, ADR-0005) — the classic
   risk is a server tricked into requesting addresses it shouldn't
   (server-side request forgery). Only signed-in Elena can trigger it; only
   `http(s)` URLs; response size and time capped; redirects re-checked;
   running on Cloudflare's functions, which cannot reach internal network
   addresses. Everything returned is untrusted: text is escaped before
   display, and the cover image is re-encoded and resized before it is
   stored, never served as-is.
6. **Feed imports** (Substack, podcasts) — feed content is third-party
   input: titles and descriptions are treated as plain text (any HTML
   stripped or escaped, never rendered raw), audio URLs must be `https`,
   and a malformed or oversized feed fails the import for that feed only,
   never the whole build.
7. **Row Level Security** — the database's own rules are the real boundary:
   anonymous reads only of Published rows, writes only by Elena's account.
   Changes to them are Critical track.

## Breach blast radius, by scenario

| If this is compromised                        | Impact                                                                                                                                                                                                                                                                |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Elena's admin credentials                     | Attacker can post/delete/deface portfolio content under her name. Reputational, not a data-privacy incident (no third-party data exists to leak). Mitigated by: strong auth via Supabase, no password reuse (Elena's responsibility), session expiry.                 |
| The Supabase project itself (API keys leaked) | Same as above, worse — direct DB/storage access bypassing the app. Mitigated by: `.env`/secrets never committed (see AGENTS.md), service-role keys never shipped to the client, only the anon/public key (scoped by Row Level Security policies) reaches the browser. |
| The deploy hook URL                           | Anyone with it can start builds: no content change, but it could burn the 500 free builds/month and block publishing until the month resets. Mitigated by: kept as a Cloudflare secret, called only from the server, rotatable in one click.                          |
| Elena's password (no second factor)           | Accepted risk (ADR-0004). Same impact as the credentials row above. Mitigated by: rate limiting, a long unique password, Maintainer able to reset access.                                                                                                             |
| A dependency (supply-chain)                   | Could inject malicious JS into the public site or the portal. Mitigated by: Dependabot, CodeQL, pinned exact versions, lockfile committed.                                                                                                                            |
| GitHub repo (it's public)                     | Source code is already public by design — no secrets belong in it. The risk is someone finding a vulnerability in the (visible) code before it's patched; mitigated by CodeQL + CodeRabbit running on every PR.                                                       |

## What this threat model deliberately does not cover

- Visitor privacy / GDPR-style data subject rights — not applicable, no
  visitor data is collected. If that ever changes (a contact form, an
  email signup), this file must be updated **before** that feature starts,
  not after, because it changes the data classification table above.
- DDoS / availability — out of scope for a portfolio site on Cloudflare's
  standard infrastructure; not a priority given the mission. One
  availability risk is handled anyway: the free Supabase project pausing
  after ~7 idle days, prevented by the scheduled rebuild (ADR-0003).
- Visitors' privacy towards YouTube/Spotify after they click play — the
  click is the Visitor's choice; before it, nothing third-party loads.

## Revisit this file when

- A second account/role is added
- Any form of visitor data collection is added (contact form, newsletter,
  comments, analytics)
- A new source of fetched or imported third-party content is added
- A second sign-in factor is added, or sign-in changes in any way
- The hosting or auth provider changes
