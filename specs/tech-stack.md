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

| Thing          | Version | Why                                                                                                                                                                                                                                                                                                |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Astro          | 7.4.12  | Static-first output for the public pages (fast, minimal JS, good for an image/content-heavy portfolio), with per-route server rendering available for the admin portal via "hybrid" output. One framework covers both halves of the mission instead of splitting into a separate frontend/backend. |
| TypeScript     | 6.0.3   | Type safety across `.astro`/`.ts` files; required by `astro check`. Pinned to the 6.x line, not the newer 7.x, because `@astrojs/check@0.9.12` peer-requires `^5.0.0 \|\| ^6.0.0` — 7.x breaks the install (`npm ci` fails ERESOLVE). Bump together with `@astrojs/check` once it supports 7.x.    |
| @astrojs/check | 0.9.12  | Powers `astro check` (the typecheck script).                                                                                                                                                                                                                                                       |

**Rendering mode**: starts as Astro's default static output (`output:
'static'` in `astro.config.mjs`) — this is all the current skeleton needs,
and Vercel serves a static Astro build with zero adapter. When the admin
portal feature is built, add the `@astrojs/vercel` adapter (pinned version
below), switch `output` to `"hybrid"`, and mark the portal's routes
`export const prerender = false;` — the public pages stay static, only the
portal and its API routes render per-request. This is a decision for that
feature's `/sdd-spec`, not retrofitted here; noted so the implementing
session doesn't have to rediscover it.

## Auth, database, storage, deployment adapter (planned — installed when the portal feature is built)

| Thing                              | Version | Why                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @astrojs/vercel                    | 11.0.22 | Deployment adapter needed once the site has server-rendered routes (the portal). Peer-requires `astro@^7.0.0` — satisfied by the pin above. Not needed, and not installed, for the current static skeleton.                                                                         |
| Supabase (`@supabase/supabase-js`) | 2.119.0 | One managed service for authentication, the entries database (Postgres), and file storage (uploaded photos). Avoids hand-rolling auth — rolling custom auth is a named security risk the user explicitly chose to avoid. Free tier is sufficient for a single-admin portfolio site. |

Not installed as a dependency yet — `/sdd-init` scaffolds the harness, not
the portal feature. The version above is pinned here now so the number
doesn't go stale by the time that feature starts. Verify with `npm view
@supabase/supabase-js version` before installing, in case time has passed.

**Why Supabase over the Vercel+Clerk+Blob alternative**: one account, one
dashboard, one set of docs to keep current (via Context7) instead of three.
Revisit only if a specific Supabase limitation is hit.

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

## Hosting / deployment

- **Vercel** — first-class Astro support, free tier, preview deployment per
  PR (step 14 of the loop becomes "open the preview URL" rather than
  "run it locally" once this is wired up).

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
  framework (Astro hybrid mode) since the public site is the larger
  surface area and Astro's static-first output suits it better.
- **Self-hosted media storage/CDN** — v1 handles images via Supabase
  storage and video/audio via embeds/links to existing platforms
  (YouTube, Substack, Spotify/Apple Podcasts). No video transcoding
  pipeline. Revisit only if Elena specifically wants self-hosted video.
- **A headless CMS** (Contentful/Notion-as-CMS/etc.) — declined in favor
  of a purpose-built admin portal, since Elena wants a simple login +
  upload flow rather than a general CMS, and a custom portal is a better
  fit for "add a link or a photo" as the only two operations.
