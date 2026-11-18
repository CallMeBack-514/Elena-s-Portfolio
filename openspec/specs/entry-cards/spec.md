# entry-cards Specification

## Purpose

Shows any Entry the same way wherever it is listed, as a Card, so a
Visitor can scan Elena's work at a glance and see where each piece was
published, when, and in which language.

Scenarios marked **(invariant)** are promoted to `tests/invariants/` during
`/sdd-build`.

## Requirements

### Requirement: Card content

Each Card SHALL show, in this order: a 3:2 image area, a kicker, the Entry's Work title, its Description in the page's Language, and its Outlet and date. The kicker shows the Entry's own kicker in the page's Language when one is recorded, and the Section name otherwise.

#### Scenario: Article Card on the French Articles page

- **GIVEN** a Published Article from Le Devoir dated 2026-03-12 with no kicker recorded
- **WHEN** a Visitor opens `/fr/articles/`
- **THEN** its Card shows the image, the kicker "Articles", the Work title, the French Description, and "Le Devoir" with the date written in French

### Requirement: Date is written in the page's Language

A Card's date SHALL be written as day, month name and year in the page's Language.

#### Scenario: Same date in three Languages

- **GIVEN** an Article dated 2026-03-12
- **WHEN** its Card is shown on `/fr/`, `/en/` and `/it/`
- **THEN** the dates read "12 mars 2026", "March 12, 2026" and "12 marzo 2026" respectively

### Requirement: Image or placeholder

A Card SHALL show the Entry's image cropped to 3:2, served from the site's own origin. When the Entry has no image, the Card shows a typographic 3:2 placeholder on the paper colour instead of an empty or broken image. The image is decorative, because the Work title next to it names the Entry.

#### Scenario: Entry without an image

- **GIVEN** a Published Article with no image recorded
- **WHEN** its Card is shown
- **THEN** a 3:2 placeholder is shown in place of the image, and no `<img>` with a missing source is rendered

#### Scenario: Image keeps its ratio

- **WHEN** any Card with an image is shown at any viewport width
- **THEN** the image area is 3:2 and the image does not overflow it

### Requirement: Original language is marked

A Card's Work title SHALL carry the Entry's Original language as its language for assistive technology. When the Original language differs from the page's Language, the Card also shows a visible badge with that Language's code.

#### Scenario: French Article on the English page

- **GIVEN** an Article whose Original language is French
- **WHEN** its Card is shown on `/en/`
- **THEN** its Work title is marked `lang="fr"` and a visible "FR" badge is shown

#### Scenario: French Article on the French page

- **GIVEN** an Article whose Original language is French
- **WHEN** its Card is shown on `/fr/`
- **THEN** no badge is shown

### Requirement: One link per Card

Each Card SHALL be a single link, so activating anywhere on it follows that link. Its accessible name starts with the Work title. Keyboard focus reaches it once.

#### Scenario: Card is one tab stop

- **WHEN** a keyboard Visitor tabs through a Section page
- **THEN** each Card receives focus exactly once, and its accessible name begins with its Work title

### Requirement: Hover and focus feedback

When a Card is hovered or receives keyboard focus, an accent-coloured underline SHALL draw under its Work title from left to right and its image SHALL scale to 1.04. Both take 200–250 ms with an ease-out curve, and the image never overflows the 3:2 area.

#### Scenario: Keyboard focus shows the same feedback as hover

- **WHEN** a keyboard Visitor focuses a Card
- **THEN** its title underline and image scale appear as on hover, and a visible focus indicator is shown

### Requirement: Reduced motion is respected

When the Visitor's device asks for reduced motion, Cards SHALL show the hover and focus underline without animating it, and SHALL NOT scale the image.

#### Scenario: Reduced motion

- **GIVEN** a device that prefers reduced motion
- **WHEN** a Visitor hovers a Card
- **THEN** the underline appears without a transition and the image is not scaled
