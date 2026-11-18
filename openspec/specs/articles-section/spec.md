# articles-section Specification

## Purpose

Presents Elena's written journalism as Article Entries that link to the
Outlets that published them, and lets a Visitor narrow the list to one
Outlet without any script.

Scenarios marked **(invariant)** are promoted to `tests/invariants/` during
`/sdd-build`.

## Requirements

### Requirement: An Article is recorded with its published facts

Each Article SHALL record its Work title, Outlet, publication date, Original language (French, English or Italian), the `https` address of the Outlet's page, a Description in all three Languages, its Order and whether it is Published or Draft. An image is optional. The build SHALL fail if any required field is missing or the address is not `https`.

#### Scenario: Non-https address fails the build

- **GIVEN** an Article whose address starts with `http://` or `javascript:`
- **WHEN** the site is built
- **THEN** the build fails with an error naming the Article and the address field

#### Scenario: Two Articles share an Order

- **GIVEN** two Articles recorded with the same Order
- **WHEN** the site is built
- **THEN** the build fails with an error naming both Articles

### Requirement: An Article Card leads to the Outlet

An Article SHALL have no detail page. Its Card links to the Outlet's page for that Article and opens it in the same tab. The Card shows a ↗ mark, and its accessible name says, in the page's Language, that it leads to the Outlet's site.

#### Scenario: Following an Article Card

- **GIVEN** a Published Article from Le Devoir
- **WHEN** a Visitor on `/en/articles/` activates its Card
- **THEN** the same tab navigates to the Article's recorded Le Devoir address

#### Scenario: Accessible name names the destination

- **WHEN** a Visitor using assistive technology reaches a Le Devoir Article's Card on `/fr/articles/`
- **THEN** its accessible name contains the Work title and says in French that the link opens the Le Devoir site

#### Scenario: No Article detail pages (invariant)

- **WHEN** the built pages are listed
- **THEN** there is no page under `/{lang}/articles/` other than the Section page itself and the Outlet filter pages

### Requirement: Outlet filter pages

Each Outlet with at least one Published Article SHALL have a page at `/{lang}/articles/{outlet}/` that lists only that Outlet's Published Articles, in Elena's Order. The Outlet's path segment is its name in lower case with accents removed, each run of other characters than Latin letters and digits (spaces, apostrophes, punctuation) replaced by one hyphen, and no hyphen at either end (Le Devoir → `le-devoir`, L’Actualité → `l-actualite`). The build SHALL fail when two differently written Outlet names give the same path segment, or when a name gives an empty one.

#### Scenario: Le Devoir only

- **GIVEN** Published Articles from Le Devoir and Radio-Canada
- **WHEN** a Visitor opens `/fr/articles/le-devoir/`
- **THEN** only Le Devoir Articles are listed, in Order, and the page title names Le Devoir

#### Scenario: Two Outlets that would share a path

- **GIVEN** Articles from an Outlet recorded as "Écho" and another recorded as "Echo"
- **WHEN** the site is built
- **THEN** the build fails and names both Outlets

### Requirement: Outlet filter links

When Published Articles come from at least two Outlets, the Articles page and every Outlet filter page SHALL show filter links: one for all Articles (labelled in the page's Language), followed by one per Outlet in alphabetical order. The link for the current page is marked as current for assistive technology. The filter works without JavaScript.

#### Scenario: Filtering by link

- **GIVEN** a Visitor on `/en/articles/` with JavaScript disabled
- **WHEN** they follow the "Radio-Canada" filter link
- **THEN** they land on `/en/articles/radio-canada/`, where that link is marked current and the "All" link leads back to `/en/articles/`

#### Scenario: Single Outlet

- **GIVEN** every Published Article comes from one Outlet
- **WHEN** a Visitor opens `/fr/articles/`
- **THEN** no filter links are shown
