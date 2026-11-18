# Tech stack

Versions below were checked against the npm registry directly
(`npm view <pkg> version`) on 2026-11-14. Pin exact versions in
`package.json` — do not use `^`/`~` ranges for anything in this list without
a reason written down here, per `~/.claude/WORKFLOW.md` §2 ("pin exact
versions; models default to stale versions carrying known vulnerabilities").

## Runtime

| Thing           | Version                                           | Why                                                                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js         | 24.22.0 (local dev machine)                       | Node 24 is Maintenance LTS until 2028-04-30 — fine for this project's lifetime. Node 26 (Lithium) became the new Active LTS on 2026-10-28; revisit at `/sdd-retro` and upgrade if there's a reason to, but don't churn for its own sake. Pinned via `.nvmrc`. |
| Package manager | npm 11.19.1 (bundled with the Node install above) | Already present on the dev machine; no reason to add pnpm/yarn for a single-maintainer project.                                                                                                                                                               |

## Framework

| Thing          | Version | Why                                                                                                                                                                                                                                                                                              |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Astro          | 7.4.12  | Static-first output for the public pages (fast, minimal JS, good for an image-heavy portfolio), with per-route server rendering for the Portal. One framework covers both halves of the mission instead of a separate frontend and backend. Built-in i18n routing covers `/fr/`, `/en/`, `/it/`. |
| TypeScript     | 6.0.3   | Type safety across `.astro`/`.ts` files; required by `astro check`. Pinned to the 6.x line, not the newer 7.x, because `@astrojs/check@0.9.12` peer-requires `^5.0.0 \|\| ^6.0.0` — 7.x breaks the install (`npm ci` fails ERESOLVE). Bump together with `@astrojs/check` once it supports 7.x.  |
| @astrojs/check | 0.9.12  | Powers `astro check` (the typecheck script).                                                                                                                                                                                                                                                     |

**Rendering mode**: `output: "static"` (Astro's default) — and it stays
`"static"`. Astro removed the old `"hybrid"` mode in v5: a static site with
an adapter installed can opt individual routes into per-request rendering
with `export const prerender = false;`. When the Portal is built (build
step 3), add the `@astrojs/cloudflare` adapter and mark only the Portal's
pages and API routes `prerender = false`. Public pages stay pre-built.

**Languages**: Astro's built-in `i18n` config, locales `fr`, `en`, `it`,
every locale prefixed in the URL. The bare `/` picks the Visitor's
browser Language; since `/` is pre-built, this is done by a tiny script on
that page (or a host redirect rule), with French as the fallback — decided
in build step 2's spec.

**How new content goes live** (ADR-0003): public pages are built from
Supabase at build time, never at request time. Saving a Published Entry
calls a Cloudflare Pages _deploy hook_ (a secret URL that starts a build).
A Cloudflare **Cron Trigger** starts a build every 3 days, which keeps the
free Supabase project from pausing (it pauses after ~7 days without
activity) and catches build breakage early. Not GitHub Actions: GitHub
disables scheduled workflows in public repos after 60 days without commits.

## Hosting / deployment

| Thing               | Version / plan | Why                                                                                                                                                                                                                                                                             |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Pages    | Free plan      | Free plan permits commercial use (Vercel's Hobby plan does not — ADR-0002), unlimited bandwidth, 500 builds/month, a preview deployment per PR, Astro support. Portal routes run as Cloudflare functions, which cannot reach internal network addresses (relevant to ADR-0005). |
| @astrojs/cloudflare | 14.4.3         | Adapter for the Portal's per-request routes. Peer-requires `astro@^7.4.0` (satisfied) and `wrangler@^4.125.0`. Installed in build step 3, not before. 14.4.3 was chosen as the newest release more than two weeks old on 2026-11-16.                                            |

Address: a free `*.pages.dev` subdomain (intended: `elena-meyer.pages.dev`,
confirmed when the Cloudflare project is created). No custom domain.

## Auth, database, storage (planned — installed in build step 3)

| Thing                   | Version | Why                                                                                                                                                                                                                                 |
| ----------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase (free plan)    | —       | One managed service for authentication, the Entries database (Postgres) and photo storage (ADR-0001). Avoids hand-rolling auth. Free plan: 1 GB storage, no image transforms (ADR-0008), pauses after ~7 idle days (handled above). |
| `@supabase/supabase-js` | 2.118.0 | Client library. 2.118.0 rather than the newer 2.119.0, which was under two weeks old on 2026-11-16.                                                                                                                                 |
| `@supabase/ssr`         | 0.12.7  | Cookie-based sessions for server-rendered routes (the Portal), so session tokens live in `httpOnly` cookies rather than browser storage.                                                                                            |

Sign-in is email + password only (ADR-0004); Supabase's built-in sign-in
rate limiting must stay enabled. Supabase's free built-in mailer only
sends a few emails per hour and only to project-team addresses, so Elena's
address must be on the project team for password-reset emails to arrive.

Verify every version with `npm view <pkg> version` (and its publish date)
before installing, in case time has passed.

**Why Supabase over the Vercel+Clerk+Blob alternative**: one account, one
dashboard, one set of docs to keep current (via Context7) instead of three.
Revisit only if a specific Supabase limitation is hit.

**Accounts**: GitHub, Supabase and Cloudflare are owned by the Maintainer,
with Elena added as a member where the service allows. The Maintainer can
reset Elena's password from the Supabase dashboard.

## Media

- **Video** (Télé Clips): our own cover image and play button; the
  platform's player (YouTube, or Radio-Canada's if it allows embedding)
  loads only on click. Since ADR-0009 the cover exists for page weight, not
  privacy; build step 2b-2 decides whether to keep it. Whether Radio-Canada's
  player embeds is checked in build step 2b-2; if it doesn't, the Clip's
  Card still links to its Detail page, which links to the Clip on
  Radio-Canada instead of playing it.
- **Images** (Entry images, including Outlets' share images): stored by us
  and never hotlinked (ADR-0010); the build generates the served sizes
  with Astro's image tooling.
- **Audio** (Episodes): Spotify's embedded player; we build no player of
  our own (ADR-0009). Episode lists come from each Show's public feed where
  one exists (build step 6). An Episode with no Spotify embed is shown as
  a link to where it is published; how feed Episodes are matched to their
  Spotify embeds is decided in build step 6.
- **Fonts**: self-hosted through Astro's built-in fonts support; no Google
  Fonts requests.
- **Photos**: resized in the browser to max 2560 px before upload; the
  build generates the smaller sizes with Astro's image tooling (ADR-0008).

## Testing

| Thing                | Version | Role                                                                                                                                                          |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest               | 5.1.0   | Unit tests — functions and logic in isolation.                                                                                                                |
| @playwright/test     | 1.65.1  | Reproducible E2E suite, runs in CI on every PR. Distinct from Playwright MCP (the agent driving a live browser during `/sdd-build` — exploratory, not in CI). |
| @axe-core/playwright | 4.14.0  | Accessibility assertions against key pages; zero violations is the bar.                                                                                       |

## Lint / format

| Thing                  | Version                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint                 | 10.15.0                                                                                                                                                                                 |
| @eslint/js             | 10.0.1                                                                                                                                                                                  |
| typescript-eslint      | 8.72.2                                                                                                                                                                                  |
| eslint-plugin-astro    | 3.2.1 (config: `flat/recommended`, which wires up `.astro` parsing itself — don't add `astro-eslint-parser` as a direct dependency, it has no default export and isn't needed directly) |
| eslint-config-prettier | 10.1.8                                                                                                                                                                                  |
| globals                | 17.14.0                                                                                                                                                                                 |
| @types/node            | 24.19.2 — matches the installed Node major; needed for `process.env` typings in config files (`playwright.config.ts`)                                                                   |
| Prettier               | 3.10.1                                                                                                                                                                                  |
| prettier-plugin-astro  | 1.1.2                                                                                                                                                                                   |

## Security tooling

Repo is **public** (confirmed at `/sdd-init`), so the free path from
`~/.claude/WORKFLOW.md` §9 applies in full:

| Need                       | Tool                                                |
| -------------------------- | --------------------------------------------------- |
| Independent review         | CodeRabbit (free on public repos)                   |
| Code scanning              | CodeQL (free on public repos)                       |
| Dependency vulnerabilities | Dependabot                                          |
| Secrets                    | gitleaks (pre-commit + CI) + GitHub push protection |
| CI                         | GitHub Actions (unlimited on public repos)          |

If this repo ever goes private, switch code scanning to **OSV-Scanner**
(free, works on private repos) and budget for CodeRabbit's paid tier —
see `~/.claude/WORKFLOW.md` §9 for the full private-repo cost table.

## Explicitly not chosen (and why, so it isn't re-litigated)

- **Next.js** — considered as the conventional choice for an app with
  auth + a dashboard-like portal. Declined in favor of staying on one
  framework (Astro, static with per-route server rendering) since the
  public site is the larger surface area and Astro's static-first output
  suits it better.
- **Vercel** — the original hosting plan; replaced by Cloudflare Pages
  (ADR-0002).
- **A git-based CMS (Keystatic, Decap)** — would remove most of the Portal
  work, but requires a GitHub sign-in, which Elena won't use (ADR-0001).
- **Self-hosted video** — impossible on the free plans; video stays on
  YouTube/Radio-Canada (ADR-0009).
- **Custom player controls over YouTube (Plyr, Vidstack)** — rejected:
  YouTube's terms restrict hiding its branding, and the libraries break
  when YouTube changes (ADR-0007, superseded on tracking by ADR-0009).
- **A headless CMS** (Contentful/Notion-as-CMS/etc.) — declined in favor
  of a purpose-built admin portal, since Elena wants a simple login +
  upload flow rather than a general CMS, and a custom portal is a better
  fit for "add a link or a photo" as the only two operations.
