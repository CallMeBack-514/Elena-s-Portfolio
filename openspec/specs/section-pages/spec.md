# section-pages Specification

## Purpose

Gives every Section its own page in each Language, listing Elena's
Published Entries in her Order, so an editor can see all of one kind of
work in one place.

Scenarios marked **(invariant)** are promoted to `tests/invariants/` during
`/sdd-build`.

## Requirements

### Requirement: A page for every Section

Each Section SHALL have its own page at `/{lang}/{section}/`, with the paths `articles`, `tele`, `balados`, `these` and `art` in every Language. The page's only level-1 heading is the Section name in the page's Language.

#### Scenario: Section pages exist in every Language

- **WHEN** a Visitor requests `/it/articles/`, `/it/tele/`, `/it/balados/`, `/it/these/` and `/it/art/`
- **THEN** each is served with status 200, and its only level-1 heading is "Articoli", "TV", "Podcast", "Tesi" or "Arte" respectively

### Requirement: Entries are listed as Cards in Elena's Order

A Section page SHALL list every Published Entry of that Section as a Card, in Elena's Order, with no limit on the count.

#### Scenario: Order is respected

- **GIVEN** three Published Articles with Orders 1, 2 and 3, and dates that run in the opposite direction
- **WHEN** a Visitor opens `/en/articles/`
- **THEN** their Cards appear in Order 1, 2, 3, regardless of date

### Requirement: Draft Entries are never shown

No Visitor-facing page SHALL show, link to or contain the Work title of an Entry in Draft.

#### Scenario: Draft Article is absent everywhere (invariant)

- **GIVEN** an Article in Draft
- **WHEN** every built page is inspected, in every Language
- **THEN** none contains its Work title or a link to its URL

### Requirement: Empty Section says "coming soon"

A Section page with no Published Entries SHALL show its heading and a short "coming soon" note in the page's Language, and no empty list.

#### Scenario: Télé before 2b-2

- **GIVEN** the Télé Section has no Published Entries
- **WHEN** a Visitor opens `/fr/tele/`
- **THEN** they see the heading "Télé" and "En cours d'ajout.", and no list

### Requirement: Thèse page shows its Text block in full

The Thèse page SHALL show the Thèse Text block in the page's Language: the programme, the research question as a quotation, the summary, and the labelled fields Terrain, Cadre, Livrable and Soutenance.

#### Scenario: Thèse page in English

- **WHEN** a Visitor opens `/en/these/`
- **THEN** the research question is shown as a quotation, followed by the summary and four labelled fields with English labels and values

### Requirement: Section pages are readable on a phone

Every Section page SHALL be fully usable at a 360-pixel-wide viewport without horizontal scrolling, with Cards in a single column.

#### Scenario: Articles on a narrow viewport

- **GIVEN** a 360 × 740 viewport
- **WHEN** a Visitor opens `/fr/articles/`
- **THEN** the document is no wider than the viewport, and Cards are stacked one per row
