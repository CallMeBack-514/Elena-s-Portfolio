# Spec Delta

## Purpose

The single Main page per Language that introduces Elena and her Text
blocks: portrait and bio, Collaborations, Thèse and Contact. It also shows
a place for every Section, so an editor can judge her quickly and find how
to contact her.

## ADDED Requirements

### Requirement: Masthead
The Main page SHALL open with a masthead showing Elena's name as the page's only level-1 heading, her tagline and her location line ("Toronto · Montréal"), with the tagline in the page's Language.

#### Scenario: Masthead in English
- **WHEN** a Visitor opens `/en/`
- **THEN** the only level-1 heading is "Elena Meyer", followed by the English tagline and "Toronto · Montréal"

### Requirement: Section nav links to parts of the Main page
The Main page SHALL have a nav labelled for assistive technology. It links to the anchors `#articles`, `#tele`, `#balados`, `#these` and `#art` on the same page, in that order, with Section names in the page's Language.

#### Scenario: Every nav link lands on its part
- **WHEN** a Visitor follows each nav link on `/it/`
- **THEN** each one scrolls to an element with the matching id, whose heading is that Section's Italian name

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

### Requirement: Thèse is shown in full
The Main page's Thèse part SHALL show the Thèse Text block in the page's Language: the programme, the research question as a quotation, and the labelled fields Terrain, Cadre, Livrable and Soutenance.

#### Scenario: Thèse in English
- **WHEN** a Visitor opens `/en/` and goes to `#these`
- **THEN** the research question is shown as a quotation followed by four labelled fields with English labels and values

### Requirement: Sections without content say "coming soon"
Each Section with no Published Entries (in 2a: Articles, Télé, Balados and Art) SHALL still appear on the Main page with its heading and anchor, plus a short "coming soon" note in the page's Language.

#### Scenario: Empty Section in Italian
- **WHEN** a Visitor opens `/it/` and goes to `#tele`
- **THEN** they see the heading "TV" and an Italian "coming soon" note, and no empty list

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
