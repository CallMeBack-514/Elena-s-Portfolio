# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Sections without content say "coming soon"

Each Section with no Published Entries (in 2b-1: Télé, Balados and Art) SHALL still have its block on the Main page with its heading and anchor, plus a short "coming soon" note in the page's Language and a link to its Section page.

#### Scenario: Empty Section in Italian

- **WHEN** a Visitor opens `/it/` and goes to `#tele`
- **THEN** they see the heading "TV", an Italian "coming soon" note and a link to `/it/tele/`, and no empty list

## REMOVED Requirements

### Requirement: Section nav links to parts of the Main page

**Reason**: Every Section now has its own page, so the nav leads there instead of to anchors on the Main page.
**Migration**: See `site-navigation`, "Section nav links to the Section pages". The Main page blocks keep their `#articles` … `#art` ids.

### Requirement: Thèse is shown in full

**Reason**: The full Thèse moves to its own Section page, so that the Main page shows every Section as a short block.
**Migration**: See `section-pages`, "Thèse page shows its Text block in full", and the "Thèse block links to its page" requirement above.
