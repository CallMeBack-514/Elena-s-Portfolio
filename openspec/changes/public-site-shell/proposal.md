# Proposal

## Why

The public site is build step 2 of `specs/mission.md`, and the first thing
Visitors will ever see. Today the repo only has the generic scaffold from
`/sdd-init` (English-only, wrong Sections, no design). This change, called
**2a**, builds the site shell: Elena's design, her three Languages, the
theme toggle, and a Main page carrying her own Text blocks. Step 2b can then
add the Sections onto a foundation that has already been reviewed. Step 2
was split in two so that each PR stays small enough to review properly at
Gates 2 and 3.

## Prerequisite

**The constitution amendment must be merged before `/sdd-build` starts.**
It is a separate docs-only PR, below the workflow's floor, and contains:

- ADR-0009 superseding ADR-0007: third-party embeds that track Visitors
  are accepted, and the EU/Quebec consent risk is recorded as accepted.
- `GLOSSARY.md`: the Visitor entry drops "never tracked".
- `mission.md`: analytics stays out of scope as something we don't build,
  not as a promise. Balados uses a Spotify embed, and roadmap step 6 becomes
  feed imports only.
- `tech-stack.md`: the ADR-0007 references are updated.

This change does not depend on its content (2a ships no embeds), but the
spec must sit on the constitution as amended.

## What Changes

- **Design:** Elena's design tokens from her mockup, light and dark, with
  her three fonts (Libre Caslon Display, Newsreader, Libre Franklin) served
  from our own domain.
- **Languages:**
  - Every page exists at `/fr/`, `/en/` and `/it/`.
  - Bare `/` sends the Visitor to their browser's Language, or French.
  - A Language switcher on every page.
  - Section names are translated in labels; URL paths are the same in every
    Language.
- **Theme:** the site follows the device's light/dark setting. A two-state
  toggle saves an override on that device, applied before first paint.
- **Main page:** masthead, portrait and bio (photo optional), Collaborations,
  the full Thèse, Contact and the footer. A heading for each of Articles,
  Télé, Balados and Art saying "coming soon" in the Visitor's Language. The
  nav links to anchors on this page.
- **Text blocks** live in local typed data files shaped like the future
  Supabase table, with structured fields per Language.
  - The build fails if any Language is missing.
  - Each EN/IT field carries a `reviewed` flag, and an unreviewed field
    shows a build warning.
- **Pre-launch:**
  - Every page carries noindex while a committed `launched` flag is false.
  - `npm run check:launch` fails while any text is unreviewed or a contact
    placeholder remains.
  - The site goes public only through `/sdd-release` after 2b.
- **Hosting:** the Cloudflare Pages Git integration gives every PR a
  preview, and `main` deploys to `*.pages.dev`, which stays noindex until
  launch.
- **Sharing and SEO:** `<html lang>`, a title and meta description per
  Language, hreflang links, and Open Graph tags whose share image is a
  typographic PNG card.
- **Removed:** the scaffold pages `/articles`, `/videos`, `/photos` and
  `/podcast`, and their tests. **BREAKING**, but only for routes that never
  went public.

## Capabilities

### New Capabilities

- `site-languages`: FR/EN/IT page addresses, the bare-root Language choice,
  the Language switcher, and the rule that Elena's own text exists in all
  three Languages.
- `site-theme`: light and dark themes, following the device, with an
  override saved on the device.
- `main-page`: the Main page's content and its Text blocks (portrait and
  bio, Collaborations, Thèse, Contact), plus "coming soon" placeholders for
  Sections without content.
- `page-metadata`: per-Language titles and descriptions, `lang`, hreflang
  and link-sharing previews.
- `prelaunch-visibility`: noindex until launch, and the launch check that
  blocks going public on unreviewed or placeholder content.
- `external-resources`: pages load nothing from third-party origins except
  embeds that are deliberately allowed (none in 2a).

### Modified Capabilities

None. `openspec/specs/` is empty.

## Impact

- **Code:**
  - `astro.config.mjs` (i18n, fonts).
  - New `src/content.config.ts`, `src/data/` and `src/i18n/`.
  - The layouts, pages and styles are rewritten.
  - `src/pages/{articles,videos,photos,podcast}.astro` are deleted.
- **Tests:**
  - `tests/e2e/home.spec.ts` is replaced.
  - `tests/invariants/accessibility.spec.ts` is extended to every page, in
    every Language and both themes.
  - New invariants for Language completeness and third-party resources.
- **Dependencies:** none new. Fonts use Astro 7's built-in font support with
  its Fontsource provider, which downloads at build time, so CI needs network
  access during `npm run build`.
- **Systems:** a Cloudflare Pages project connected to the GitHub repo. This
  is a manual dashboard step for the Maintainer, with a written walkthrough.
- **Content:** the EN and IT translations are drafts that Elena must review
  before launch. The contact email is a placeholder until she confirms it.
