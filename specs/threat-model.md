# Threat model

This site is 95% public static content with no visitor accounts and no
visitor data collection. The entire threat surface that matters is the
**admin portal**: one login, one set of write routes, one file upload path.

## Data classification

| Data                                                                                | Classification                                                                    | Where it lives                                                  |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Public content entries (article links, video embeds, photo metadata, podcast links) | Public — this is the whole point of the site                                      | Supabase Postgres, served to everyone                           |
| Elena's login credentials                                                           | Secret                                                                            | Supabase Auth (managed; never stored or logged by this app)     |
| Uploaded photo files                                                                | Public once published (they're portfolio content), but **write access is secret** | Supabase Storage                                                |
| Session tokens/cookies                                                              | Secret, short-lived                                                               | Browser cookie + Supabase session, server-validated per request |
| Visitor data                                                                        | **None collected** — no forms, no accounts, no analytics in v1                    | n/a                                                             |

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

- **Everyone (unauthenticated)**: all published content entries, all
  public pages. Read-only.
- **Elena (authenticated)**: everything above, plus create/edit/delete on
  content entries, plus file upload, plus logout.
- **No one else**: has any write access. There is no "editor" or "viewer"
  role to misconfigure in v1 — the absence of a role system is itself the
  mitigation for privilege-escalation bugs. If roles are added later,
  threat-model.md gets revisited first.

## Sensitive areas (mirrors mission.md — Critical track, no downgrade)

1. **Authentication** — login flow, password/magic-link/OAuth handling,
   "forgot password" if implemented. Must use Supabase Auth's built-in
   flows; do not hand-roll password hashing, token generation, or session
   logic.
2. **Admin write routes** (create/edit/delete a content entry) — must
   verify the request is an authenticated session belonging to the admin
   before any write. Every write route, no exceptions, no "it's just an
   internal tool" shortcuts.
3. **File upload handling** — must validate file type and size before
   accepting an upload; uploaded files must not be executable or
   interpretable as site code; storage bucket permissions must not allow
   anonymous writes.
4. **Session handling** — cookies must be `httpOnly`, `secure`, and scoped
   correctly; sessions must expire; logout must actually invalidate the
   session server-side, not just clear a client cookie.

## Breach blast radius, by scenario

| If this is compromised                        | Impact                                                                                                                                                                                                                                                                |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Elena's admin credentials                     | Attacker can post/delete/deface portfolio content under her name. Reputational, not a data-privacy incident (no third-party data exists to leak). Mitigated by: strong auth via Supabase, no password reuse (Elena's responsibility), session expiry.                 |
| The Supabase project itself (API keys leaked) | Same as above, worse — direct DB/storage access bypassing the app. Mitigated by: `.env`/secrets never committed (see AGENTS.md), service-role keys never shipped to the client, only the anon/public key (scoped by Row Level Security policies) reaches the browser. |
| A dependency (supply-chain)                   | Could inject malicious JS into the public site or the portal. Mitigated by: Dependabot, CodeQL, pinned exact versions, lockfile committed.                                                                                                                            |
| GitHub repo (it's public)                     | Source code is already public by design — no secrets belong in it. The risk is someone finding a vulnerability in the (visible) code before it's patched; mitigated by CodeQL + CodeRabbit running on every PR.                                                       |

## What this threat model deliberately does not cover

- Visitor privacy / GDPR-style data subject rights — not applicable, no
  visitor data is collected. If that ever changes (a contact form, an
  email signup), this file must be updated **before** that feature starts,
  not after, because it changes the data classification table above.
- DDoS / availability — out of scope for a portfolio site on Vercel's
  standard infrastructure; not a priority given the mission.

## Revisit this file when

- A second account/role is added
- Any form of visitor data collection is added (contact form, newsletter,
  comments, analytics)
- The hosting or auth provider changes
