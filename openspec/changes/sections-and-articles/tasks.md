# Tasks

## 0. Prerequisite

- [x] 0.1 Confirm the docs PR is merged to `main` before branching. It holds the mission.md edits, the GLOSSARY Preview/Card/Detail page entries, ADR-0010 and the tech-stack.md Media wording (see proposal.md, Prerequisite). Verify: `docs/adr/0010-*.md` exists on `main` and `grep -n "^\*\*Card\*\*" GLOSSARY.md` matches.

## 1. Entry data model

- [x] 1.1 Add `src/lib/entries.ts` with these zod pieces:
  - `entryLocalized`, with `reviewed` on fr, en and it;
  - the `article` schema: https-only `url`, `originalLanguage` from `LANGUAGES`, ISO `date`, optional `image` and `kicker`;
  - `assertUniqueOrder`;
  - `outletSlug` and its collision check.

  Unit-test it in `tests/unit/entries.test.ts`:
  - missing or empty `en` Description fails, with a path naming it;
  - `http:` and `javascript:` URLs fail;
  - a duplicate Order fails and names both ids;
  - the slugs for "Le Devoir", "Radio-Canada", "ICI RDI" and "Télé-Québec";
  - colliding slugs fail.

  Verify: `npm run test:unit` passes.

- [x] 1.2 Register the `articles` collection in `src/content.config.ts` (`file()` loader on `src/data/entries/articles.json`, with an `ENTRIES_DIR` env override used only by the Draft invariant). Add `publishedEntries(section)` and `preview(section)` to `src/lib/content.ts`. Unit-test the pure filter and sort helpers they use: Drafts out, Order ascending, at most 3. Verify: `npm run test:unit` and `npm run build` pass, the latter with a one-Article placeholder file until group 3.
- [x] 1.3 Extend `findBlockers` in `src/lib/launch-readiness.ts` and `scripts/check-launch.ts` to read the Entries files and flag unreviewed `fr` inside Entries, but never inside Text blocks. Add the cases to `tests/unit/launch-readiness.test.ts`. Add `tests/fixtures/entries/{blocked,ready}/articles.json` and cases to `tests/unit/check-launch.test.ts`. Verify: the blocked fixture exits non-zero and names the Article's French Description, and the ready fixture exits zero.
- [x] 1.4 Move the "missing Language is rejected" invariant into `tests/invariants/content-languages.test.ts`, covering Text blocks and Article Descriptions, and delete the old `text-blocks.test.ts` in the same commit, noting that it was merged and not removed. Verify: `npm run test:invariants` passes, and it fails if an `it` Description is blanked (check once by hand, then restore).

## 2. Interface strings and formatting

- [x] 2.1 Add these keys to `src/i18n/ui.ts`, in all three Languages: `seeAll`, `readMore`, `filter.label`, `filter.all`, `menu.open`, `menu.close`, `card.externalSite` (with an `{outlet}` slot) and `section.<id>.description`. Verify: `npm run typecheck` passes.
- [x] 2.2 Add `formatDate(date, lang)` to `src/lib/format.ts` (`dateStyle: "long"`, `timeZone: "UTC"`). Unit-test 2026-03-12 → "12 mars 2026" / "March 12, 2026" / "12 marzo 2026" in `tests/unit/format.test.ts`. Verify: `npm run test:unit` passes.

## 3. Seed content

- [x] 3.1 From Elena's public Le Devoir and Radio-Canada author pages, list every Article. For each one, record its Work title, Outlet, date, URL and Original language from the Article's own page. Write them to `src/data/entries/articles.json`, newest first as Order 1…n, all `status: "published"`. Verify: `npm run build` passes. The PR description will list every Article, so Elena can check it.
- [x] 3.2 Draft a one- or two-sentence FR/EN/IT Description for each Article from its public standfirst, all marked `reviewed: false`. Verify: `npm run check:launch` lists every new Description, in all three Languages.
- [x] 3.3 Download each Article's `og:image` once with `curl` into `src/assets/entries/articles/<id>.<ext>`. Re-encode any file over 400 kB to a 1600 px-wide JPEG at quality 82, and reference it in `image`. Articles whose image is missing or fails to download get none, and are listed for the PR. No script is committed. Verify: `npm run build` passes (`image()` rejects missing files), and `git ls-files scripts` shows no new file.

## 4. Card

- [x] 4.1 Add `src/components/EntryCard.astro`, taking a view model as in design.md. It renders:
  - `<Picture>` (AVIF and WebP, 400/800 widths, `alt=""`, lazy loading unless `eager`), or the 3:2 placeholder;
  - the kicker, then the title link with `lang`, ↗ and the hidden external-site text;
  - the Description, then the Outlet and date;
  - the badge when the Original language differs from the page's.

  Add the Card styles to `global.css`: kicker type, the accent underline animation, the 1.04 image scale on hover and focus-within, `prefers-reduced-motion`, and the auto-fill grid. Verify: `npm run typecheck` and `npm run build` pass.

- [x] 4.2 Add `tests/e2e/cards.spec.ts`:
  - the content order and French date;
  - the badge on `/en/` and none on `/fr/` for a French Article;
  - `lang` on the title;
  - the placeholder for an Article with no image (or a fixture-backed assertion if every seed Article has one);
  - one tab stop per Card, with its accessible name starting with the title and containing the Outlet text;
  - activating a Card navigates the same tab to its URL (intercepted with `page.route`, so the test makes no outside request);
  - with `reducedMotion: "reduce"`, the image transform stays `none` on hover.

  Verify: `npm run test:e2e` passes.

## 5. Navigation and layout

- [x] 5.1 Update `BaseLayout.astro`:
  - add an `isMain` prop, so the masthead `<h1>` appears only on the Main page and is a home link elsewhere;
  - point the nav links at `/{lang}/{section}/`, with `aria-current="page"` for the current Section (passed as a prop);
  - add the `menu-toggle` button (rendered `hidden`) and its bundled script, which sets `data-menu-open` and `inert` on `header`, `main` and `footer`, traps Tab, closes on Escape (returning focus) and on link click, and closes on resize past 820 px.

  Add the overlay styles under the existing 820 px breakpoint. Verify: `npm run typecheck` and `npm run build` pass.

- [x] 5.2 Add `tests/e2e/navigation.spec.ts`:
  - nav targets and `aria-current` on `/fr/articles/le-devoir/`;
  - the masthead home link on `/en/these/`;
  - at 360 px: open the menu, check `aria-expanded`, Tab wraps, Escape closes with focus back on the button, activating "Tesi" lands on `/it/these/` closed, and resizing to 1024 px closes it;
  - with JS disabled at 360 px: no button, links visible, no horizontal overflow.

  Update the nav assertions in `tests/e2e/languages.spec.ts` from anchors to paths. Verify: `npm run test:e2e` passes.

## 6. Pages

- [x] 6.1 Add the `SectionPage` layout and the `src/pages/[lang]/{tele,balados,art}.astro` "coming soon" pages, plus `src/pages/[lang]/these.astro`, showing the full Thèse moved from the Main page. Add `tests/e2e/section-pages.spec.ts`:
  - all five paths in `/it/` with their `<h1>`;
  - `/fr/tele/` coming soon, with no list;
  - the `/en/these/` quotation, summary and four fields;
  - 360 px with no overflow.

  Verify: `npm run test:e2e` passes.

- [x] 6.2 Add `src/pages/[lang]/articles/index.astro` and `[outlet].astro`, which list `publishedEntries("articles")` as Cards, with the filter `<nav>` shown only when there are at least 2 Outlets and `aria-current` on the active link. The `[outlet]` page title names the Outlet. Add `tests/e2e/articles.spec.ts`:
  - the Order matches `articles.json`;
  - with JS disabled: follow the "Radio-Canada" filter link, check that it is current, then "All" leads back;
  - `/fr/articles/le-devoir/` lists only Le Devoir.

  Verify: `npm run test:e2e` passes.

- [x] 6.3 Rewrite `src/pages/[lang]/index.astro` into one block per Section: the Articles Preview (3 Cards, the first row eager) plus "Tout voir →"; "coming soon" plus a link for Télé, Balados and Art; the Thèse question plus "Lire la suite →". The portrait, Collaborations and Contact stay unchanged. Update `tests/e2e/main-page.spec.ts`:
  - replace the nav-anchor and full-Thèse scenarios;
  - add the Preview showing Orders 1–3 and "Tout voir" → `/fr/articles/`;
  - `/it/#tele` coming soon, with its link;
  - `/it/#these` question plus link, and no fields.

  Verify: `npm run test:e2e` passes.

## 7. Theme fix (issue #15)

- [ ] 7.1 In `ThemeToggle.astro`, when `setItem` throws, try `removeItem("theme")`. Add the "Saving fails after an earlier choice" scenario to `tests/e2e/theme.spec.ts` (seed `theme=light`, stub `setItem` to throw, toggle, open another page, and expect the device's dark theme with no page error). Verify: `npm run test:e2e` passes. Close #15 from the PR description.

## 8. Invariants

- [ ] 8.1 Add `tests/fixtures/entries/drafts/articles.json`, with one Published and one Draft Article and their distinctive titles. Add `tests/invariants/drafts.spec.ts`: it builds once with `ENTRIES_DIR` pointing at the fixture, into a temporary out dir, and asserts that no page in any Language contains the Draft's title or URL, while the Published one appears. Verify: it passes, and it fails if `publishedEntries` stops filtering Drafts (check once by hand, then restore).
- [ ] 8.2 Add `tests/invariants/navigation.spec.ts` with these checks:
  - every nav link on every Language's Main page returns 200 at its Section path;
  - the 360 px mobile-menu keyboard journey;
  - axe with the menu open in light and dark;
  - the no-JS nav visible at 360 px.

  Verify: `npm run test:invariants` passes.

- [ ] 8.3 Add the "no Article detail pages" check to `tests/invariants/languages.spec.ts` or a new `articles.spec.ts`: every built path under `/{lang}/articles/` is the index or a known Outlet slug. Update the "What's here now" list in `tests/invariants/README.md`. Verify: `npm run test:invariants` passes. Also confirm the existing accessibility and external-resources invariants now iterate over the new pages (their logged page count grows).

## 9. Integration check

- [ ] 9.1 Run the full local gate: `format:check`, `lint`, `typecheck`, `test:unit`, `build`, `test:e2e` and `test:invariants`. Check by hand in `npm run preview`:
  - all three Languages, both themes;
  - a 360 px phone view with the menu;
  - keyboard-only navigation;
  - Firefox for `inert`.

  Record the Article count, the total size of committed images, and any Articles left out or without an image, for the PR description. Verify: everything is green and the numbers are written down.

## Workflow follow-up

- `/sdd-check`: open the PR (closing #15), run CI, then Gate 2 and Gate 3. If there are more than about 60 Articles, raise pagination as its own follow-up change.
- `/sdd-ship`: manual test, verify invariant promotion, merge, archive this change.
- Next: `/sdd-start` for 2b-2 (Télé with video cover, Balados with Spotify, Art, and the detail pages), which folds in issue #13.
- Launch stays blocked: Elena must review the Article Descriptions and images, plus the 2a texts (`npm run check:launch`).
