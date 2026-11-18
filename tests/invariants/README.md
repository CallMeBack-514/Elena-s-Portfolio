# Invariants

This suite is owned by no feature. Every test here runs **in full on every
PR**, never scoped to the diff.

See `~/.claude/WORKFLOW.md` §5 for the full rules. Summary:

## When to promote a test here (at build time, step 7 of the loop)

A test belongs here when it guards something durable:

- a security or isolation property (e.g. "an unauthenticated request to a
  portal write route is rejected")
- a contract other code depends on
- a user-visible behavior that must not silently regress
- a critical end-to-end journey (e.g. "Elena can log in and publish an
  entry")

## When NOT to promote

- "the new button is blue" — cosmetic, not durable
- an internal implementation detail
- "the migration ran once" — not a behavior, an event

## Removing an invariant

Allowed when the behavior it guards genuinely no longer exists, on three
conditions:

1. The removal is justified in the commit message.
2. No other property is silently lost with it.
3. It happens in its own change, not buried inside a feature.

Never remove an invariant just to make a build pass — that is the exact
failure this suite exists to prevent.

## What's here now

`npm run test:invariants` runs two suites: Vitest (`*.test.ts`) and then
Playwright (`*.spec.ts`), both against the built site in `dist/`. Page lists
come from `tests/support/pages.ts`, which reads `dist/`, so new pages are
covered with no list to update.

- `accessibility.spec.ts`: zero automatically detectable a11y violations
  (via `@axe-core/playwright`) on **every built page**, in every Language,
  in light and dark. Promoted at `/sdd-init` and extended by
  `public-site-shell`.
- `languages.spec.ts`: every Visitor-facing page exists under `/fr/`,
  `/en/` and `/it/` with a matching `<html lang>` (spec: site-languages).
- `content-languages.test.ts`: a Text block or an Entry Description
  missing a Language, or with an empty one, is rejected and names the
  field. This is what fails the build (ADR-0006). Was `text-blocks.test.ts`;
  `sections-and-articles` merged Entries into it.
- `external-resources.spec.ts`: pages load nothing from other origins
  except those on its `ALLOWED_ORIGINS` list, which is empty in 2a. Adding
  an origin is a deliberate, spec-level decision.
- `prelaunch.spec.ts`: while `LAUNCHED` is false, every page carries a
  robots noindex meta and `dist/_headers` sends `X-Robots-Tag: noindex`. It
  flips to asserting their absence once launched.
- `drafts.test.ts`: a Draft Entry appears on no page, in any Language,
  by title or by link, and creates no Outlet filter page. It builds the
  real site once against `tests/fixtures/entries/drafts/` (via
  `ENTRIES_DIR`) into `test-results/`, and checks the Published Article
  is shown so the test can't pass vacuously (spec: section-pages). Added
  by `sections-and-articles`.
- `navigation.spec.ts`: every nav link on every Language's Main page
  reaches its Section page. On a phone, the menu keeps keyboard focus,
  makes the page inert, closes on Escape with focus back on its button,
  and passes axe when open, in both themes. Without JavaScript the nav is
  fully visible (spec: site-navigation). Added by `sections-and-articles`.
- `articles.spec.ts`: an Article has no detail page. The only pages under
  `/{lang}/articles/` are the Section page and one page per Outlet
  (spec: articles-section). Added by `sections-and-articles`.
