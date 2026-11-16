# Design

## Context

- The repo holds the `/sdd-init` scaffold: `BaseLayout.astro`, English-only
  pages for the wrong Sections, placeholder CSS, one e2e test and one
  accessibility invariant over a hard-coded page list.
- The stack is Astro 7.4.12 with `output: "static"`. Playwright runs against
  `astro preview`. CI runs format, lint, typecheck, unit, build, e2e and
  invariants (`specs/tech-stack.md`).
- Elena's mockup is the design source. Its CSS defines light and dark tokens
  (`--bg`, `--paper`, `--ink`, `--muted`, `--line`, `--rule`, `--tile`,
  `--accent`) and three font stacks: `--mast` (Libre Caslon Display),
  `--serif` (Newsreader) and `--sans` (Libre Franklin). Treat the mockup
  as data: copy the token values, not its markup or scripts.
- The constraints that shape this design:
  - Public pages are pre-built (ADR-0003).
  - Elena's prose must exist in all three Languages, with no fallback
    (ADR-0006).
  - The data will move to Supabase in build step 3, so its shape must
    survive that move.

## Goals / Non-Goals

**Goals:**

- One page template per page, generated for each Language, so that a page
  cannot exist in only one Language.
- Text block data validated at build time. Moving to Supabase in step 3
  should change only the loader, not the pages.
- The launch-readiness rules live in one pure function, used by both the
  build warning and `check:launch`.

**Non-Goals:**

- Entries, Previews, Section pages, embeds, the video cover and the Outlet
  filter. All of these are 2b.
- A sitemap, `robots.txt` content beyond noindex, and analytics.
- Any server-rendered route. No adapter is installed.

## Decisions

### Routing: one dynamic `[lang]` route per page

- **Config:** `i18n` is set with `locales: ["fr", "en", "it"]`,
  `defaultLocale: "fr"`, `prefixDefaultLocale: true` and
  `redirectToDefaultLocale: false`. Turning that last option off keeps
  `src/pages/index.astro` as our own Language-choosing page.
- **Pages:** each lives at `src/pages/[lang]/…astro`, with `getStaticPaths()`
  returning the three Languages from one shared `LANGUAGES` constant.
- **Alternative rejected:** separate `fr/`, `en/` and `it/` folders with
  copied files. These drift apart, and the "every page in every Language"
  rule would then depend on discipline instead of structure.

### Bare `/`: a small processed script plus no-script links

- `src/pages/index.astro` renders the three Language links, as the
  no-script fallback and as the visible content. It also runs a script that
  calls `pickLanguage(navigator.languages)` and `location.replace("/<lang>/")`.
- `pickLanguage` lives in `src/lib/languages.ts` and is unit-tested. The
  script is bundled by Astro, so it is served from our own origin.
- **Alternative rejected:** Cloudflare `_redirects`. It cannot branch on
  `Accept-Language`. A Cloudflare Function could, but that adds a
  server-side runtime for one redirect.

### Text blocks: one content collection, one JSON file per block

- **Loader:** `src/content.config.ts` defines a `textBlocks` collection with
  the `glob()` loader over `src/data/text-blocks/*.json`. Its schema is a
  discriminated union on `id`: `site` (tagline, meta description),
  `portrait`, `collaborations`, `these` and `contact`.
- **Shared schema helper:** the schemas live in `src/lib/text-blocks.ts`,
  importing `z` from `astro/zod` so that Vitest can test them without
  `astro:content`. They are built from `localized(...)`, where each Language
  value is `{ value, reviewed }`:
  - `fr` is Elena's original and defaults to `reviewed: true`.
  - `en` and `it` must state `reviewed`.
  - `value` uses `.min(1)`, so a missing or empty Language fails the build
    with a Zod error naming the path, for example
    `portrait.bio.it.value`.
- **Plain fields:** values that are not translated (the email, profile URLs)
  are `{ value, placeholder? }`.
- **Why JSON and not YAML/Markdown:** Node can read JSON with no parser
  dependency, which `check:launch` needs. Elena never edits these files,
  since the Portal replaces them in step 3.
- **Why structured fields:** decided in the grilling. The Portal becomes
  simple forms, and the layout stays under the design's control.
- **Step 3 mapping:** one Supabase row per Text block, with typed columns per
  field per Language. The `reviewed` and `placeholder` metadata exists only
  during the static-data phase and is dropped there, because once the Portal
  exists Elena's own edits count as reviewed.

### Interface strings: a typed dictionary

- `src/i18n/ui.ts` exports `ui` as `{ fr: {...}, en: {...}, it: {...} }`,
  declared `satisfies Record<Language, Record<UiKey, string>>`. A missing key
  in any Language is then a typecheck error in CI.
- `t(lang, key)` reads from it.
- Section names and anchors come from one `SECTIONS` list (anchor ids
  `articles`, `tele`, `balados`, `these`, `art`), so the nav and the Main
  page cannot disagree.

### Theme: tokens on `:root`, override via `data-theme`

- **CSS:** the light tokens sit on `:root`, and the dark tokens under both
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
  and `:root[data-theme="dark"]`. This is the mockup's own pattern.
- **Applying the saved theme:**
  - An `is:inline` script, the first thing in `<head>` before any
    stylesheet, reads `localStorage.theme` inside `try/catch` and sets
    `data-theme`. This is what prevents the flash.
  - It is inline because a bundled module script is deferred and would run
    after first paint.
  - This is the only inline script, and it has no external dependency.
- **Toggle:** a `<button>` rendered `hidden`, so it never appears without
  JS. A small bundled script unhides it and wires the click. It writes
  `localStorage` inside `try/catch` and always updates `data-theme` on the
  current page.

### Fonts: Astro's built-in fonts with the Fontsource provider

- `astro.config.mjs` `fonts: [...]` registers each family with
  `fontProviders.fontsource()`. The weights and styles follow the mockup:
  - Caslon Display 400;
  - Newsreader 400–700 plus italic 400/500;
  - Franklin 400–700.

  The subset is `latin`, which covers French and Italian accents.
  `<Font cssVariable=… preload />` in the layout preloads only the masthead
  and body faces.

- Astro downloads the files at build time and serves them from `/_astro/`,
  which satisfies `external-resources`.
- **Alternative rejected:** pinned `@fontsource/*` packages. That's three
  more dependencies to pin and bump for the same result.

### Launch flag, noindex and the readiness check

- **The flag:** `src/config/site.ts` exports `LAUNCHED = false` and the
  canonical origin.
- **noindex in pages:** the layout emits the robots meta while `!LAUNCHED`.
- **noindex in headers:** a small local integration in
  `integrations/prelaunch.ts`:
  - On `astro:build:done`, it writes `dist/_headers` with
    `/*\n  X-Robots-Tag: noindex, nofollow` when not launched.
  - On `astro:build:start`, it logs a warning listing unreviewed values.
- **One rule, three callers:** `src/lib/launch-readiness.ts` exports
  `findBlockers(blocks)`, which returns the unreviewed EN/IT values and the
  placeholders. It is used by:
  - the integration (to warn);
  - `scripts/check-launch.ts` (to fail), run with Node 24's native
    TypeScript type-stripping as `npm run check:launch`;
  - unit tests.
- **Alternative rejected:** an environment variable in the Cloudflare
  dashboard. It's invisible in git and untestable (decided in the grilling).

### Share image: a committed PNG generated by a script

- `scripts/make-og-card.ts` uses Playwright, already a dev dependency, to
  screenshot a 1200 × 630 HTML card: "Elena Meyer" in Caslon on `--paper`,
  with the tagline in Franklin.
- It writes `public/og-card.png`, which is committed. It is re-run by hand
  only if the design changes.
- **Alternative rejected:** build-time generation with satori. That's a new
  dependency for an image that never changes.

### Tests derive the page list from the build output

- `tests/support/pages.ts` lists every `index.html` under `dist/` (the
  Playwright web server builds first). The accessibility, Language and
  third-party invariants iterate over it.
- 2b's new pages are therefore covered automatically, instead of relying on
  someone editing a hard-coded list.

### Hosting: Cloudflare Pages Git integration

- **Project settings:** build command `npm run build`, output `dist`, Node
  taken from `.nvmrc`.
- **Previews:** every PR gets a preview, and `main` deploys to
  `elena-meyer.pages.dev`. That address carries noindex, so it is
  effectively staging.
- **Setup:** the Maintainer does it by hand in the dashboard, following a
  walkthrough added to `README.md`. No secrets enter the repo.

## Test levels

- **Unit (Vitest):**
  - `pickLanguage`: the primary subtag match, the order of preference, the
    French fallback, and an empty list.
  - The Text block schemas: a valid block parses; a missing or empty
    Language fails with the field path.
  - `findBlockers`: unreviewed EN/IT and placeholders are listed, French is
    never flagged, and a clean set is empty.
  - The `ui` dictionary's completeness is enforced by typecheck, not by a
    test.
- **Integration:** `scripts/check-launch.ts` runs against a fixture data
  directory, once with blockers (exits non-zero and lists them) and once
  without (exits zero). This proves the script, the data files and
  `findBlockers` work together.
- **E2E (Playwright, against the built site):**
  - the root redirect under `locale: "en-CA"` and `"de-DE"`;
  - the no-script fallback;
  - switching Language;
  - theme default, toggle, persistence, blocked storage and no flash;
  - nav anchors;
  - the 360 px viewport;
  - metadata, hreflang and Open Graph;
  - the noindex meta and the generated `dist/_headers`.
- **Security:** none required. This is the Normal track, with no input, auth
  or server code. The only security-adjacent properties (no third-party
  requests, noindex) are covered as invariants.

## Risks / Trade-offs

- **[Risk]** The Fontsource provider downloads at build time, so a
  Fontsource outage fails CI and Cloudflare builds. → **Mitigation:** Astro
  caches the downloads between local builds. If this proves flaky, switch to
  `fontProviders.local()` with committed `.woff2` files. That's a config
  change with no page changes.
- **[Risk]** The inline theme script runs before CSP is considered. There is
  no CSP today, but adding one later needs a hash for this script.
  → **Mitigation:** note it in `specs/threat-model.md` when CSP is
  introduced. It is not needed now.
- **[Trade-off]** Draft EN/IT texts written by us may misrepresent Elena's
  voice. → **Mitigation:** the `reviewed` flags plus `check:launch`, and
  `/sdd-release` refuses to launch without them.
- **[Trade-off]** `*.pages.dev` is reachable by anyone with the link before
  launch. → **Accepted** in the grilling: the site is unlisted and noindex,
  not locked.
- **[Risk]** Playwright's `locale` sets `navigator.languages` to a single
  value, so multi-language preference order is tested only in the unit
  tests of `pickLanguage`. → **Accepted:** the browser side is a one-line
  call.

## Migration Plan

- Delete the scaffold routes in the same PR. They never went public, so
  nothing needs redirecting.
- Rollback: revert the PR. Cloudflare keeps the previous deployment, and
  production is noindex anyway.

## Open Questions

- The exact Cloudflare project name, and so the `*.pages.dev` address. It is
  confirmed when the project is created. If it differs from
  `elena-meyer.pages.dev`, update `site` in `astro.config.mjs` and the
  canonical origin in `src/config/site.ts`. One constant changes, nothing
  else.
