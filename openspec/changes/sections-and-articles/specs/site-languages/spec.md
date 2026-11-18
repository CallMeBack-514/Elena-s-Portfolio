# Spec Delta

## MODIFIED Requirements

### Requirement: Interface text is in the page's Language

All interface text on a page (nav labels, Section names, "coming soon", footer and switcher labels) SHALL be in the page's Language. Section names are translated, while paths and anchors stay the same in every Language.

#### Scenario: Section names per Language

- **WHEN** a Visitor views the nav on `/fr/`, `/en/` and `/it/`
- **THEN** the Balados Section is labelled "Balados", "Podcasts" and "Podcast" respectively, and links to `/fr/balados/`, `/en/balados/` and `/it/balados/`

### Requirement: Elena's own text must exist in every Language

Every Text block field that holds Elena's prose, and every Entry's Description, SHALL have a non-empty value in French, English and Italian. If any is missing, the build SHALL fail; it never falls back to another Language (ADR-0006).

#### Scenario: Missing Italian bio fails the build (invariant)

- **GIVEN** a Text block whose Italian bio is empty or absent
- **WHEN** the site is built
- **THEN** the build fails with an error naming the Text block, the field and the missing Language

#### Scenario: Missing English Description fails the build (invariant)

- **GIVEN** an Article whose English Description is empty or absent
- **WHEN** the site is built
- **THEN** the build fails with an error naming the Article, the Description and the missing Language

#### Scenario: Complete Text blocks build

- **GIVEN** every Text block field and every Entry Description has values in all three Languages
- **WHEN** the site is built
- **THEN** the build succeeds
