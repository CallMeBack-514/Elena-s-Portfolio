# site-languages Specification

## Purpose

Lets every Visitor read the site in French, English or Italian, reach their
own Language from the bare address, switch Language from any page, and see
Elena's own text complete in each.

Scenarios marked **(invariant)** are promoted to `tests/invariants/` during
`/sdd-build`.

## Requirements

### Requirement: Every Visitor-facing page exists in all three Languages

Every Visitor-facing page SHALL be served under `/fr/`, `/en/` and `/it/`, with the same path after the Language prefix in each, and the page's `<html lang>` SHALL match that Language.

#### Scenario: Main page in each Language (invariant)

- **WHEN** a Visitor requests `/fr/`, `/en/` or `/it/`
- **THEN** the Main page is served with status 200 and `<html lang>` set to `fr`, `en` or `it` respectively

#### Scenario: No page exists in only some Languages (invariant)

- **GIVEN** the list of built Visitor-facing pages
- **WHEN** a page exists under one Language prefix
- **THEN** a page with the same path after the prefix exists under the other two

### Requirement: Bare address picks the Visitor's Language

A request to `/` SHALL send the Visitor to the first of their browser's preferred languages that is French, English or Italian, matched on the primary language subtag, and to `/fr/` when none matches.

#### Scenario: English browser

- **GIVEN** a browser whose preferred languages are `en-CA, fr`
- **WHEN** the Visitor opens `/`
- **THEN** they land on `/en/`

#### Scenario: Unsupported browser language

- **GIVEN** a browser whose only preferred language is `de-DE`
- **WHEN** the Visitor opens `/`
- **THEN** they land on `/fr/`

#### Scenario: No script

- **GIVEN** a browser with JavaScript disabled
- **WHEN** the Visitor opens `/`
- **THEN** the page shows a link to each of `/fr/`, `/en/` and `/it/`

### Requirement: Language switcher on every page

Every Visitor-facing page SHALL show a switcher naming each Language in that Language (Français, English, Italiano). It links to the same page in the other Languages and marks the current one.

#### Scenario: Switching from French to Italian

- **GIVEN** a Visitor on `/fr/`
- **WHEN** they choose "Italiano"
- **THEN** they land on `/it/`

#### Scenario: Current Language is marked

- **WHEN** a Visitor is on `/en/`
- **THEN** the "English" entry is marked as the current page for assistive technology and is not a link to itself

### Requirement: Interface text is in the page's Language

All interface text on a page (nav labels, Section names, "coming soon", footer and switcher labels) SHALL be in the page's Language. Section names are translated, while paths and anchors stay the same in every Language.

#### Scenario: Section names per Language

- **WHEN** a Visitor views the nav on `/fr/`, `/en/` and `/it/`
- **THEN** the Balados Section is labelled "Balados", "Podcasts" and "Podcast" respectively, and links to `#balados` in all three

### Requirement: Elena's own text must exist in every Language

Every Text block field that holds Elena's prose SHALL have a non-empty value in French, English and Italian. If any is missing, the build SHALL fail; it never falls back to another Language (ADR-0006).

#### Scenario: Missing Italian bio fails the build (invariant)

- **GIVEN** a Text block whose Italian bio is empty or absent
- **WHEN** the site is built
- **THEN** the build fails with an error naming the Text block, the field and the missing Language

#### Scenario: Complete Text blocks build

- **GIVEN** every Text block field has values in all three Languages
- **WHEN** the site is built
- **THEN** the build succeeds
