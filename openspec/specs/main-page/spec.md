# main-page Specification

## Purpose

The single Main page per Language that introduces Elena and her Text
blocks: portrait and bio, Collaborations, Thèse and Contact. It also shows
a place for every Section, so an editor can judge her quickly and find how
to contact her.

## Requirements

### Requirement: Masthead

The Main page SHALL open with a masthead showing Elena's name as the page's only level-1 heading, her tagline and her location line ("Toronto · Montréal"), with the tagline in the page's Language.

#### Scenario: Masthead in English

- **WHEN** a Visitor opens `/en/`
- **THEN** the only level-1 heading is "Elena Meyer", followed by the English tagline and "Toronto · Montréal"

### Requirement: Portrait and bio

The Main page SHALL show the portrait Text block: a heading, the bio paragraphs and the byline in the page's Language. When a portrait photo is recorded it is shown with alt text in that Language; when none is recorded the part shows text only.

#### Scenario: No photo yet

- **GIVEN** the portrait Text block has no photo
- **WHEN** a Visitor opens `/fr/`
- **THEN** the heading, bio and byline are shown and no broken or empty image is rendered

#### Scenario: Photo recorded

- **GIVEN** the portrait Text block has a photo with alt text in all three Languages
- **WHEN** a Visitor opens `/it/`
- **THEN** the photo is shown with its Italian alt text

### Requirement: Collaborations

The Main page SHALL show the Collaborations Text block as a list in Elena's recorded order. Each item shows its Outlet name, her role in the page's Language and the years.

#### Scenario: Collaborations list

- **WHEN** a Visitor opens `/fr/`
- **THEN** a "Collaborations" list shows Radio-Canada, Le Devoir, ICI RDI, Festival Émergence and CHOQ Radio in that order, each with its role and years

### Requirement: Sections without content say "coming soon"

Each Section with no Published Entries (in 2b-1: Télé, Balados and Art) SHALL still have its block on the Main page with its heading and anchor, plus a short "coming soon" note in the page's Language and a link to its Section page.

#### Scenario: Empty Section in Italian

- **WHEN** a Visitor opens `/it/` and goes to `#tele`
- **THEN** they see the heading "TV", an Italian "coming soon" note and a link to `/it/tele/`, and no empty list

### Requirement: Contact

The Main page SHALL show the Contact Text block: Elena's contact email as visible plain text and her profile links, each with a visible label. There is no contact form.

#### Scenario: Contact details visible

- **WHEN** a Visitor opens any Language's Main page
- **THEN** the contact email address appears as readable text, each profile link (including her Radio-Canada profile) opens the external page, and the page contains no form

### Requirement: Footer

Every Visitor-facing page SHALL end with a footer showing "© Elena Meyer" and the current year at build time.

#### Scenario: Footer

- **WHEN** a Visitor opens `/fr/`
- **THEN** the footer shows "© <build year> Elena Meyer"

### Requirement: Readable on a phone

The Main page SHALL be fully usable at a 360-pixel-wide viewport without horizontal scrolling.

#### Scenario: Narrow viewport

- **GIVEN** a 360 × 740 viewport
- **WHEN** a Visitor opens `/en/`
- **THEN** the document is no wider than the viewport, and the nav, switcher and theme toggle are all reachable

### Requirement: One block per Section with its Preview

The Main page SHALL show one block per Section, in nav order, between the portrait part and Contact. Each block has the Section's heading and anchor id. A Section with Published Entries shows its Preview, which is its first three Published Entries in Elena's Order, as Cards. A link labelled "Tout voir →" in the page's Language leads to the Section page.

#### Scenario: Articles Preview in French

- **GIVEN** five Published Articles with Orders 1 to 5
- **WHEN** a Visitor opens `/fr/` and goes to `#articles`
- **THEN** the Articles block shows the Cards for Orders 1, 2 and 3 only, followed by a "Tout voir →" link to `/fr/articles/`

#### Scenario: Fewer than three Entries

- **GIVEN** a Section with exactly one Published Entry
- **WHEN** a Visitor opens the Main page
- **THEN** that block shows one Card and its "Tout voir →" link, and no empty slots

### Requirement: Thèse block links to its page

The Main page's Thèse block SHALL show the research question from the Thèse Text block as a quotation in the page's Language. A link, labelled in that Language, leads to the Thèse page.

#### Scenario: Thèse block in Italian

- **WHEN** a Visitor opens `/it/` and goes to `#these`
- **THEN** the Italian research question is shown as a quotation, followed by a link to `/it/these/`, and the Terrain, Cadre, Livrable and Soutenance fields are not on the Main page
