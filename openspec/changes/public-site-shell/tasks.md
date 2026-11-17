# Tasks

## 0. Prerequisite

- [x] 0.1 Confirm the constitution-amendment PR (ADR-0009 superseding ADR-0007, the GLOSSARY Visitor entry, mission.md, tech-stack.md) is merged to `main` before branching. Verify: `docs/adr/0009-*.md` exists on `main`, and `grep -n "never tracked" GLOSSARY.md` returns nothing.

## 1. Clear the scaffold

- [x] 1.1 Delete `src/pages/{articles,videos,photos,podcast}.astro`, the old `src/pages/index.astro` content and `tests/e2e/home.spec.ts`. Remove the hard-coded page list from `tests/invariants/accessibility.spec.ts`, which gets rewritten in group 7 and is not deleted. Verify: `npm run build` succeeds and `dist/` no longer contains those routes.

## 2. Languages and interface strings

- [x] 2.1 Add `src/lib/languages.ts` with `LANGUAGES = ["fr","en","it"]`, the `Language` type, `pickLanguage(prefs)` and the `SECTIONS` list (ids `articles`, `tele`, `balados`, `these`, `art`). Unit-test `pickLanguage` in `tests/unit/languages.test.ts`: the primary subtag match, the order of preference, the French fallback, and an empty list. Verify: `npm run test:unit` passes.
- [x] 2.2 Configure `i18n` in `astro.config.mjs` (`prefixDefaultLocale: true`, `redirectToDefaultLocale: false`). Verify: `npm run build` succeeds.
- [x] 2.3 Add `src/i18n/ui.ts`, the typed `ui` dictionary with `satisfies Record<Language, Record<UiKey,string>>`, plus `t()`. It holds the Section names, nav label, "coming soon", switcher labels, theme toggle names, Thèse field labels, "Collaborations" and footer text. Verify: `npm run typecheck` fails if any key is deleted from one Language (check by hand once, then restore).

## 3. Text block data

- [x] 3.1 Add `src/lib/text-blocks.ts`, with the `localized()` and `plain()` helpers and the discriminated-union schema for `site`, `portrait`, `collaborations`, `these` and `contact`. Unit-test it in `tests/unit/text-blocks.test.ts`: a valid block parses, and a missing or empty `it` value fails with a path naming the field. Verify: `npm run test:unit` passes.
- [x] 3.2 Add `src/content.config.ts` with the `textBlocks` collection (`glob` over `src/data/text-blocks/*.json`). Verify: `npm run build` succeeds once 3.3 has landed, and removing one `it` value makes the build fail with the field path.
- [x] 3.3 Write `src/data/text-blocks/*.json`:
  - The French values come from Elena's mockup: tagline, bio, byline, Collaborations, Thèse.
  - We draft the EN and IT values, all `reviewed: false`.
  - The contact email is a `placeholder: true` value.
  - The profile links are the Radio-Canada profile and the author page from the mockup's footer.

  Verify: `npm run build` succeeds.

## 4. Launch readiness

- [x] 4.1 Add `src/config/site.ts` (`LAUNCHED = false`, canonical origin) and `src/lib/launch-readiness.ts` (`findBlockers`, pure, importing no Astro modules). Unit-test it in `tests/unit/launch-readiness.test.ts`: it lists unreviewed EN/IT values and placeholders, never flags French, and returns an empty list for clean data. Verify: `npm run test:unit` passes.
- [x] 4.2 Add `scripts/check-launch.ts` and the `check:launch` npm script. Integration-test it in `tests/unit/check-launch.test.ts` by running it against `tests/fixtures/text-blocks/{blocked,ready}/`. Verify: the blocked fixture exits non-zero and lists the items, the ready fixture exits zero, and `npm run check:launch` on the real data exits non-zero.
- [x] 4.3 Add `integrations/prelaunch.ts`, which warns on build start with the blockers and writes `dist/_headers` with `X-Robots-Tag: noindex, nofollow` while `!LAUNCHED`. Register it in `astro.config.mjs`. Verify: `npm run build` prints the warning, and `dist/_headers` contains the rule.

## 5. Design, layout and theme

- [x] 5.1 Configure the fonts in `astro.config.mjs` (`fontProviders.fontsource()`, with the weights, styles and `latin` subset from design.md). Rewrite `src/styles/global.css` with the mockup's light tokens on `:root` and dark tokens under the two dark selectors. Verify: `npm run build` emits font files under `dist/_astro/`.
- [x] 5.2 Rewrite `src/layouts/BaseLayout.astro`. It takes a `lang` prop and contains:
  - the head: the inline theme script first, `<Font>` preloads, title and description, robots meta while `!LAUNCHED`, hreflang alternates plus `x-default`, and Open Graph tags;
  - the page: the masthead, the Section nav (anchors from `SECTIONS`), the Language switcher (current Language marked with `aria-current`, not linked), the theme toggle (rendered `hidden`, unhidden by a bundled script, storage in `try/catch`) and the footer.

  Verify: `npm run typecheck` and `npm run build` pass.

- [x] 5.3 Add `scripts/make-og-card.ts` and generate the committed `public/og-card.png` (1200 × 630). Verify: the file exists with those dimensions (`file public/og-card.png`).

## 6. Pages

- [x] 6.1 Add `src/pages/[lang]/index.astro`, the Main page: the portrait part (photo optional), Collaborations, the full Thèse, Contact, and "coming soon" parts for Articles, Télé, Balados and Art. Each part is a landmark region with the id from `SECTIONS`. Add `tests/e2e/main-page.spec.ts` covering the main-page spec scenarios: masthead, nav anchors in `/it/`, no-photo portrait, Collaborations order, Thèse fields in `/en/`, "coming soon" in `/it/`, contact email as text with no form, footer, and the 360 px viewport. Verify: `npm run test:e2e` passes.
- [x] 6.2 Add `src/pages/index.astro`, the root page: three Language links and a bundled script calling `pickLanguage(navigator.languages)` then `location.replace`. Add `tests/e2e/languages.spec.ts`: `locale: "en-CA"` → `/en/`, `"de-DE"` → `/fr/`, JS disabled → three links, switcher from `/fr/` to `/it/`, `aria-current` on the current Language, and Section labels per Language. Verify: `npm run test:e2e` passes.
- [x] 6.3 Add `tests/e2e/theme.spec.ts`:
  - the device default under both `colorScheme` values;
  - toggle and persist across pages;
  - the accessible name in French;
  - storage throwing (via `addInitScript`) still switches with no page error;
  - no flash: an `addInitScript` observer records `data-theme` at the first stylesheet application.

  Verify: `npm run test:e2e` passes.

- [x] 6.4 Add `tests/e2e/metadata.spec.ts`:
  - per-Language `<title>` and description;
  - hreflang `fr`, `en`, `it` and `x-default` as absolute canonical URLs;
  - Open Graph tags, with `og:locale` per Language and `og:image` returning a 1200 × 630 PNG;
  - the robots noindex meta.

  Verify: `npm run test:e2e` passes.

## 7. Invariants

- [x] 7.1 Add `tests/support/pages.ts`, which lists the built Visitor-facing pages from `dist/**/index.html`, excluding the root chooser where a test says so.
- [x] 7.2 Rewrite `tests/invariants/accessibility.spec.ts` to run axe on every built page, in each Language, under `colorScheme` light and dark. Verify: `npm run test:invariants` passes. Also confirm it fails if a token's contrast is broken, by hand once, then restore.
- [x] 7.3 Add `tests/invariants/languages.spec.ts` (Playwright), asserting every page path exists under all three prefixes with the matching `<html lang>`. Move the "missing Language is rejected" case from 3.1 into `tests/invariants/text-blocks.test.ts` (Vitest). For that:
  - extend `vitest.config.ts` to include `tests/invariants/**/*.test.ts`;
  - make `test:invariants` run `vitest run tests/invariants` followed by the Playwright invariants.

  The schema is the only thing that makes the build fail, so testing it directly avoids running a full `astro build` inside a test. Verify: `npm run test:invariants` runs both and passes.

- [x] 7.4 Add `tests/invariants/external-resources.spec.ts`, with an empty `ALLOWED_ORIGINS` and a short comment that adding an origin is a deliberate decision. It records every request on every page in every Language and both themes, and fails on any other origin. Verify: it passes, and it fails if a Google Fonts `<link>` is added temporarily.
- [x] 7.5 Add `tests/invariants/prelaunch.spec.ts`. While `LAUNCHED` is false, every built page has the robots noindex meta and `dist/_headers` holds the `X-Robots-Tag` rule. Update `tests/invariants/README.md` "What's here now" with all four new invariants. Verify: `npm run test:invariants` passes.

## 8. Hosting and docs

- [x] 8.1 Add a "Deploying" section to `README.md` covering:
  - the Cloudflare Pages Git-integration walkthrough (build command, output `dist`, Node from `.nvmrc`);
  - what preview URLs are;
  - noindex until launch;
  - `npm run check:launch`.

  Verify: the Maintainer follows it, a PR gets a preview URL, and the preview serves `/fr/` with the `X-Robots-Tag` header (`curl -sI`). _The section is written. Following it (connecting Cloudflare) moved to `/sdd-release`; see Workflow follow-up._

_Task 8.2 (update the address if Cloudflare gives a different one) moved to `/sdd-release` with the Cloudflare setup; see Workflow follow-up._

## 9. Integration check

- [x] 9.1 Run the full local gate: `format:check`, `lint`, `typecheck`, `test:unit`, `build`, `test:e2e` and `test:invariants`. Then check the site by hand on a phone in both themes and all three Languages. Verify: everything is green and no layout breaks. _Done locally on 2026-11-17: the full gate is green, and the Maintainer tested `npm run preview` by hand, including a phone-width view. Checking the Cloudflare preview on a real phone moved to `/sdd-release`._

## Workflow follow-up

- `/sdd-check`: open the PR, run CI, then Gate 2 and Gate 3.
- `/sdd-ship`: manual test, verify invariant promotion, merge, archive this change.
- `/sdd-release`: connect Cloudflare Pages by following README → Deploying, with step-by-step guidance (the Maintainer is new to Cloudflare). Update the address in `astro.config.mjs` and `src/config/site.ts` if it is not `elena-meyer.pages.dev` (was task 8.2). Check `/fr/` carries `X-Robots-Tag`, and test the deployed site on a real phone.
- Do not launch. Going public is `/sdd-release` after 2b and Elena's review (`npm run check:launch` must pass).
