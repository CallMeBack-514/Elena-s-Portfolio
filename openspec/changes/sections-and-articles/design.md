# Design

## Context

2a left these in place (see `openspec/specs/`):

- one dynamic `src/pages/[lang]/index.astro` route;
- Text blocks as a `glob` content collection validated by
  `src/lib/text-blocks.ts`;
- `src/lib/launch-readiness.ts`, which walks the raw JSON for `reviewed`
  and `placeholder` flags;
- invariants that iterate over `dist/**/index.html` (`tests/support/pages.ts`),
  so new pages are covered by the accessibility, Language-completeness,
  external-resources and noindex invariants with no extra work.

The design tokens (`--accent`, `--paper`, `--muted` …) and the three fonts
already exist. The brief adds no colours or fonts. One `@media (max-width:
820px)` breakpoint already exists and is reused for the mobile menu.

Constraints:

- public pages stay static (`AGENTS.md`);
- no new dependencies;
- content stays local typed data shaped like the future Supabase tables
  (ADR-0003, build step 3 swaps the loader);
- anything resembling the Article link auto-fetch is Critical (step 5) and
  stays out.

## Goals / Non-Goals

**Goals:**

- One Card component and one Section-page layout that 2b-2 reuses
  unchanged for Clips, Shows, Series, Poems and Posts.
- An Entry data model that build step 3 can map to a table column for
  column.
- Outlet filtering and the nav working with JavaScript off.

**Non-Goals:**

- Detail pages: no Entry in 2b-1 has one. The template arrives in 2b-2
  with Clips, Shows, Series and Poems.
- Pagination. All Published Articles are on one page (see Risks).
- Issue #13 (external requests after page load). It matters only once
  embeds exist, in 2b-2.
- Any URL-fetching code in the repo.

## Decisions

### Entries: one content collection per Section, one JSON file

`src/data/entries/articles.json` holds an array of Articles, loaded with
Astro's `file()` loader into an `articles` collection. The schema lives in
`src/lib/entries.ts`, outside `content.config.ts`, for the same reason as
`text-blocks.ts`: unit tests import it without `astro:content`.

```text
Article {
  id: string             // stable slug, unique (the file() loader enforces it)
  status: "published" | "draft"
  order: positive int    // Elena's Order; unique within the Section
  workTitle: string      // Original language, never translated
  originalLanguage: "fr" | "en" | "it"
  outlet: string         // display name, e.g. "Le Devoir"
  url: https URL         // the Outlet's page
  date: ISO date         // publication date
  description: entryLocalized   // fr/en/it, each { value, reviewed }
  image?: image()        // local file, relative to the JSON file
  kicker?: entryLocalized       // unused in 2b-1; sub-categories later
}
```

- **Why an explicit `order` rather than array position:**
  - It matches the future table column one for one.
  - It survives a loader that does not keep file order.
  - Elena's drag-and-drop in step 3 writes exactly this field.
  - Uniqueness is checked by a `superRefine` across the collection
    (`assertUniqueOrder`, unit-tested), because zod cannot see sibling
    entries from inside one entry's schema.
- **Why `entryLocalized`, not the Text blocks' `localized`:** we drafted the
  French too, so French carries a `reviewed` flag here. Text blocks keep
  their French-unflagged shape. `findBlockers` already flags any `en`/`it`
  object without `reviewed: true`. It gains one rule: inside Entries, `fr`
  is checked too.
- **Why one file for all Articles, not one file per Article:** the seed is a
  single drafting pass, and reordering is then one edit. Step 3 replaces it
  anyway.
- **`kicker`:** an optional field, so sub-categories (Reportage, Analyse)
  can be added later with no data migration. The Card renders it when
  present, otherwise the Section name. No seed data uses it.
- **Alternative rejected:** one generic `entries` collection with a
  `section` discriminator. 2b-2's Shows (with Episodes) and Series (with
  photos) have different shapes. Per-Section collections keep each schema
  simple, and the shared parts live in reusable zod pieces.

`src/lib/content.ts` gains `publishedEntries(section)` (Published only,
sorted by `order`) and `preview(section)` (the first three). This is the
only place that filters Drafts, so the "Draft never shown" invariant
guards one code path.

### Images: committed files through Astro's `<Picture>`

- **Storage:** each share image is saved once under
  `src/assets/entries/articles/<id>.<ext>`, as the Outlet published it
  (ADR-0010).
- **Rendering:** the schema's `image()` helper makes a missing file a build
  error. The Card renders `<Picture>` with AVIF and WebP, `widths` 400/800,
  `sizes` matching the grid, `object-fit: cover` in an `aspect-ratio: 3/2`
  box, `alt=""` (decorative, since the title names the Entry), and
  `loading="lazy"` except for the first row. Sharp ships with Astro, so no
  new dependency.
- **Alternative rejected:** saving into `public/`. That serves the
  original, often 1200 px and 200 kB+, to a phone, with no resizing.
- **Fetching:** while drafting the seed, Claude reads each Article page's
  `og:image` and downloads it with `curl`. No script is committed. The
  Maintainer sees each image in the PR diff.

### Outlet filter: static pages from `getStaticPaths`

`src/pages/[lang]/articles/[outlet].astro` generates one page per
(Language × Outlet with at least one Published Article).

- **Slugs:** come from `outletSlug(name)`: NFD-normalise, strip combining
  marks, lower-case, and turn runs of non-alphanumerics into `-`. It is
  unit-tested on "Le Devoir", "Radio-Canada", "ICI RDI" and
  "Télé-Québec". Two Outlets that produce the same slug fail the build.
- **Filter links:** a `<nav aria-label="…">` of links, with
  `aria-current="page"` on the current one.
- **Alternative rejected:** client-side filtering. It needs JavaScript, has
  no shareable URL, and makes the Visitor download every Card to see a few
  (chosen at Gate-1 grilling).

### Card component

`src/components/EntryCard.astro` takes a normalised view model (`href`,
`external`, `kicker`, `title`, `titleLang`, `description`, `meta`, `image?`),
not an Article. 2b-2 feeds it Clips and Shows without touching it.

- **One link per Card:** the Work title is the `<a>`. A `::after` stretched
  over the Card makes the whole Card clickable, and there is one tab stop.
- **Accessible name:** for external links it is the title plus a
  visually-hidden "(site Le Devoir)" / "(Le Devoir website)" /
  "(sito Le Devoir)". The ↗ is `aria-hidden`.
- **Same tab:** no `target`, so no `rel` question arises.
- **Date:** formatted with `Intl.DateTimeFormat(lang, { dateStyle: "long" })`
  in `src/lib/format.ts`, with a `timeZone: "UTC"` pin so a build machine's
  zone cannot shift the day. Unit-tested.
- **Badge:** shown only when `originalLanguage !== lang`. Uppercase code,
  sans, `--muted`.
- **Motion:**
  - The underline is a `background-image` gradient on the title,
    animating `background-size` from `0 1px` to `100% 1px`.
  - The image scale is `transform: scale(1.04)` inside `overflow: hidden`.
  - Both run 220 ms `ease-out` on `:hover` and `:focus-within` (the link
    is the focused element).
  - `@media (prefers-reduced-motion: reduce)` sets `transition: none` and
    drops the scale.
- **Placeholder:** when there is no image, a `div` with the same 3:2 box
  on `--paper`, showing the Section name in the masthead font, with
  `aria-hidden`.

### Section pages and the Main page

- **Routes:**
  - Static routes `src/pages/[lang]/{articles,tele,balados,these,art}.astro`.
    The `articles/index.astro` and `articles/[outlet].astro` routes share
    a `SectionPage` layout.
  - Each Section page title is "Section · Elena Meyer". Its description
    comes from new `section.<id>.description` interface strings.
- **The level-1 heading moves:** `BaseLayout` gets an `isMain` flag. On
  the Main page the masthead name stays the only `<h1>`. Elsewhere it
  becomes `<a href="/{lang}/">` in a `<p>`, and the page supplies its own
  `<h1>`.
- **Main page:** it loops over `SECTIONS` and renders either a Preview
  grid of `EntryCard`s or the "coming soon" note, plus the "Tout voir →"
  link. Thèse is the one special case: a quotation and "Lire la suite →".
  Labels come from `ui.ts` (`seeAll`, `readMore`, `filter.all`, `menu.open`,
  `menu.close`, `card.externalSite`).
- **Grid:** `repeat(auto-fill, minmax(min(100%, 280px), 1fr))`, which
  gives 3 columns on desktop and 1 at 360 px with no extra media query.

### Mobile menu: one `<nav>`, made modal with `inert`

- **Markup:** the nav is rendered once. A `<button class="menu-toggle"
hidden aria-expanded="false" aria-controls="site-nav">` sits in the
  strip.
- **Script:** a small bundled script reveals the button (so it never shows
  without JavaScript). It toggles a `data-menu-open` attribute on `<html>`.
  Under 820 px, CSS turns the nav into a `position: fixed; inset: 0`
  overlay.
- **While open:**
  - `inert` is set on `header`, `main` and `footer`, so focus and the
    accessibility tree stay in the nav;
  - Tab wraps from the last element to the close control;
  - Escape closes and returns focus to the button;
  - clicking any nav link closes;
  - `overflow: hidden` on `<body>` stops background scrolling.
- **Resize:** a `matchMedia("(min-width: 821px)")` listener closes the
  menu if the viewport grows.
- **Alternative rejected:** a `<dialog>` with a cloned link list. Native
  Escape handling and focus trapping are attractive, but two copies of the
  nav means two landmarks to keep in sync and duplicate links for
  assistive technology. `inert` gives the same modality with one nav.

### Theme: clear a stale choice (issue #15)

In `ThemeToggle.astro`'s click handler, `setItem` sits in its own `try`.
On failure, a second `try { localStorage.removeItem("theme") }` runs. If
that fails too, storage is fully blocked, and the existing fallback already
applies. Tested by stubbing `Storage.prototype.setItem` to throw after
seeding `theme=light` via `addInitScript`.

### Seed content

- **Sources:** Claude lists every Article on Elena's public Le Devoir and
  Radio-Canada author pages. For each, it records the Work title, date,
  URL, Original language and `og:image` from the Article's own page.
- **Descriptions:** Claude drafts a one- or two-sentence FR/EN/IT
  Description from the Article's public standfirst, never from paywalled
  text. All three are marked `reviewed: false`.
- **Order:** newest first, as a starting point.
- **Draft:** none. Every found Article is Published, but blocked from
  launch by the review flags.
- **Images:** an Article with no `og:image`, or whose image fails to
  download, gets no image, and its Card shows the placeholder.
- **A hidden Draft for the invariant:** the test suite needs a Draft. Its
  fixture lives under `tests/fixtures/`, and the invariant asserts against
  the real build by temporarily pointing the loader at a fixture (see Test
  levels). No fake Draft goes into Elena's data.

## Test levels

| Level           | What                                                                                                                                                                                                                                                                                                                                                       | Why                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit**        | The Article schema (missing Language, non-https URL, bad `originalLanguage`), `assertUniqueOrder`, `outletSlug` and its collision check, `publishedEntries`/`preview` (Drafts out, sorted by Order, three max), the date format per Language, and `findBlockers` flagging French inside Entries but not inside Text blocks.                                | These are the business rules. Cheap to test in isolation, and the rest of the change depends on them.                                    |
| **Integration** | `check:launch` against `tests/fixtures/` with Entries (unreviewed FR → non-zero, all reviewed → zero). A build-level check that the Draft fixture never reaches `dist/`, run with the `ENTRIES_DIR` env override pointing the loader at `tests/fixtures/entries/`.                                                                                         | The launch gate and Draft filtering only matter end to end through the real script and the real build.                                   |
| **E2E**         | Section pages in every Language; the Articles Order; the filter journey with JS disabled; Card link target, accessible name, badge, placeholder and reduced motion; Main page blocks and "Tout voir"; the Thèse page; the mobile menu (open, trap, Escape, link closes, resize); the no-JS nav at 360 px; theme save failure (#15); and the 360 px layout. | Every spec scenario that a Visitor observes.                                                                                             |
| **Security**    | Not a separate suite: Normal track, no sensitive area touched. The one hostile-input concern, an Article `url` with a `javascript:` or `http:` scheme, is rejected by the schema and unit-tested above. All rendered text goes through Astro's escaping, with no `set:html`.                                                                               | Content is committed by the Maintainer, not supplied by Visitors. The schema guard stops a bad link before step 5 automates adding them. |

**Invariants to promote** (marked in the specs):

1. **Draft never shown:** `tests/invariants/drafts.test.ts`, against the
   fixture build.
2. **Entry Descriptions complete:** extend `tests/invariants/text-blocks.test.ts`
   into `content-languages.test.ts`, covering both schemas.
3. **No Article detail pages:** a check over `builtPages()`.
4. **Every nav link reaches its page:** in every Language.
5. **Mobile menu keyboard journey**, plus axe with the menu open in both
   themes.
6. **No-JS nav visible at 360 px.**

Already covering the new pages automatically: accessibility (axe on every
page × Language × theme), Language completeness, external resources and
noindex.

## Risks / Trade-offs

- **"Every Article found" could be 50 or more** → one long page, and a
  heavier Main page. _Mitigation:_ responsive AVIF/WebP at 400/800 widths,
  lazy loading after the first row, and the Main page shows only 3. If the
  count goes past ~60, the Maintainer is told at the PR so that pagination
  can be added in its own change, rather than here.
- **Repo growth** from committed originals (~100–300 kB each) → tens of
  MB. _Mitigation:_ re-encode any original over 400 kB to an 1600 px-wide
  JPEG at quality 82 before committing. The build makes the served sizes.
- **Copyright on Outlet images** → recorded and accepted in ADR-0010. Elena
  reviews the images with the Descriptions.
- **Seed accuracy** (wrong date, a co-authored piece, a piece that is not
  hers) → everything is behind the launch gate, and the PR description
  lists every Article for the Maintainer and Elena to check.
- **Outlet pages change their HTML or block scraping** → it only affects
  the one-time drafting. Anything that cannot be fetched is listed in the
  PR and left out.
- **`inert` support** → supported in every current evergreen browser.
  Without it, the overlay still covers the page, and only the focus trap
  weakens. The E2E runs on Chromium, so a Firefox/WebKit check is a manual
  `/sdd-ship` step.
- **The Thèse leaves the Main page** → a skimming editor sees less of it.
  _Accepted_ at Gate-1 grilling, since the question is the hook and the
  page is one click away.

## Migration Plan

- **Static site, nothing public yet:** deploying is merging. Rollback is
  reverting the merge commit.
- **The only data contract:** `articles.json`, which step 3 imports into
  Supabase field for field.

## Open Questions

- Which exact author-page URLs to start from. The Radio-Canada profile is
  already in `contact.json`. The Le Devoir author page is found during
  `/sdd-build`. This doesn't change the plan.
