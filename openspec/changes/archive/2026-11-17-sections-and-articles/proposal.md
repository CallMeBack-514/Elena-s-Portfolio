# Proposal

## Why

The site shell (2a) is reviewed and merged, but the Main page still says
"coming soon" for every Section, and nothing shows Elena's actual work. An
editor judging her range finds no Articles at all. This change, called
**2b-1**, is the first half of build step 2b. It gives the site the design
from the Maintainer's design brief (NYT / Figaro / Pivot hybrid): Cards, a
page for every Section, a mobile menu, and the Articles Section filled
with her real work and filterable by Outlet. 2b-2 then fills Télé, Balados
and Art, with their detail pages, on the same Card and page system. Step 2b
was split so that each PR stays reviewable at Gates 2 and 3.

## Prerequisite

**A docs-only constitution PR must be merged before `/sdd-build` starts**,
as was done before 2a. It contains:

- **`specs/mission.md`**:
  - Every Entry except Articles has its own detail page. An Article's
    Card links to its Outlet, which keeps the text.
  - Media images (Article share images, and later covers) are stored by
    us and never hotlinked.
  - The 2b build-order line is split into 2b-1 (this change) and 2b-2
    (Télé with video cover, Balados with Spotify, Art with Series, Poems
    and Substack, and their detail pages).
- **`GLOSSARY.md`**:
  - The **Preview** entry says it is shown as Cards.
  - A new **Card** term: an Entry's thumbnail, kicker, Work title,
    Description, and Outlet and date, linking to the Entry. _Avoid_:
    tile, teaser, thumbnail (for the whole unit).
  - A new **Detail page** term: the page of one Entry. Every Entry has
    one except Articles. _Avoid_: post page, single.
- **ADR-0010**: an Outlet's share image (`og:image`) is downloaded once and
  committed with the Entry, never hotlinked. It records the accepted
  copyright risk (the image is used as a link preview to the Outlet's own
  page, as a social network would) and that Elena can replace any image.
- **`specs/tech-stack.md`**: the Media section says "2b-2" where it now
  says "build step 2b" for the video cover and the Radio-Canada embed
  check.

## What Changes

- **Cards:** a single way to show any Entry. Each Card has:
  - a 3:2 thumbnail, or a typographic placeholder on `--paper` when the
    Entry has no image;
  - a kicker with the Section name, in Libre Franklin, bold, uppercase,
    with wide tracking and the `--accent` colour;
  - the Work title in Newsreader, marked with its Original language;
  - the Description, muted;
  - the Outlet and date;
  - an Original language badge when the Entry's language differs from the
    page's.

  On hover and keyboard focus, an accent underline is drawn from left to
  right and the image scales to 1.04, with no motion when the Visitor
  prefers reduced motion.

- **Section pages:** `/{lang}/articles/`, `/tele/`, `/balados/`, `/these/`
  and `/art/`.
  - Articles lists every Published Article as Cards, in Elena's Order.
  - Thèse shows the full Thèse Text block, which moves here from the Main
    page.
  - Télé, Balados and Art say "coming soon" until 2b-2.
- **Outlet filter:** one static page per Outlet,
  `/{lang}/articles/{outlet}/`, reached through filter links ("Tous" plus
  one per Outlet), with the current one marked. It needs no JavaScript.
- **Article Cards link out:** an Article has no detail page. Its Card opens
  the Outlet's page in the same tab, marked ↗, and its accessible name says
  it leads to the Outlet's site.
- **Main page in blocks:** one block per Section.
  - Articles shows its first 3 Published Entries in Order, plus
    "Tout voir →" linking to the Section page.
  - Thèse shows the research question, plus a link to `/these/`.
  - Télé, Balados and Art keep "coming soon".
  - The portrait, Collaborations and Contact stay as they are.
- **Navigation:**
  - The nav links to the Section pages, not anchors, and marks the
    current Section.
  - The masthead name links to the Main page from every other page.
  - Under 820 px, an accessible menu button opens a full-screen menu,
    which closes on Escape or on following a link, and traps focus while
    open. Without JavaScript the nav stays visible as today.
- **Articles content:** the Article Entries, as local typed data shaped
  like the future Supabase table.
  - Claude drafts every Article found on Elena's public Le Devoir and
    Radio-Canada author pages: the Work title, Outlet, date, link, Original
    language and image as published.
  - The FR/EN/IT Descriptions are drafted by Claude. All three Languages,
    French included, are marked unreviewed.
  - The share images are downloaded once and committed. No fetcher script
    is committed, because the Article link auto-fetch is step 5's Critical
    work.
- **Launch gate:** the build warning and `npm run check:launch` also list
  unreviewed Entry Descriptions, in every Language.
- **Theme (issue #15):** when saving the theme fails but reading works, the
  old saved choice is cleared, so later pages follow the device.
- **BREAKING (internal):**
  - The `#articles` … `#art` nav anchors stop being the nav's targets.
    The Main page blocks keep their ids.
  - The full Thèse leaves the Main page.

  Nothing has gone public yet, so no outside link breaks.

## Capabilities

### New Capabilities

- `entry-cards`: how one Entry is shown as a Card: its content, image or
  placeholder, Original language marking, hover and focus behaviour, and
  reduced motion.
- `section-pages`: one page per Section per Language. It lists Published
  Entries in Elena's Order, never Drafts, and shows "coming soon" when a
  Section is empty. The Thèse page shows its Text block.
- `articles-section`: Article Entries, what their Cards link to, and the
  Outlet filter pages.
- `site-navigation`: the Section nav, the current-page marking, the
  masthead link home, and the mobile menu with its no-script fallback.

### Modified Capabilities

- `main-page`:
  - The nav requirement moves to `site-navigation`.
  - "Sections without content say coming soon" becomes one block per
    Section with its Preview and a link to the Section page.
  - Thèse is shown short, linking to its page.
- `site-languages`:
  - The interface-text scenario now refers to Section pages, not anchors.
  - Elena's own text includes Entry Descriptions, which must exist in all
    three Languages.
- `prelaunch-visibility`: the build warning and the launch check also cover
  Entry Descriptions, including French ones drafted by us.
- `site-theme`: a failed save clears a stale saved choice (issue #15).

## Impact

- **Code:**
  - New: `src/lib/entries.ts`, `src/data/entries/articles.json`,
    `src/assets/entries/articles/`, the Card, filter and menu components,
    and the `src/pages/[lang]/{articles,tele,balados,these,art}` routes.
  - Changed: `src/content.config.ts`, `src/lib/launch-readiness.ts`,
    `src/layouts/BaseLayout.astro`, `src/pages/[lang]/index.astro`,
    `src/styles/global.css`, `src/i18n/ui.ts`, and
    `src/components/ThemeToggle.astro`.
- **Tests:**
  - New E2E specs for the Section pages, Articles and the filter, Cards
    and the mobile menu.
  - `main-page`, `languages` and `theme` E2E specs are updated.
  - New invariants for Draft Entries never shown, Entry Description
    completeness and the mobile menu's keyboard journey.
  - The accessibility and external-resources invariants cover the new
    pages automatically.
- **Dependencies:** none new. Images use Astro's built-in image tooling
  with the `sharp` that Astro already installs.
- **Repo size:** one committed image per Article, likely tens of
  megabytes in total. See design.md.
- **Content:** the launch check has more blockers until Elena reviews the
  Article Descriptions and images.
