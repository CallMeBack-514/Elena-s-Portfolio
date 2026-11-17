# Spec Delta

## Purpose

Makes every request a page makes to another origin a deliberate decision.
Fonts, styles, scripts and images come from the site's own origin unless an
embed is explicitly allowed, which keeps pages fast and their dependencies
visible.

## ADDED Requirements

### Requirement: Pages load resources only from the site's origin or an allowed embed

On load, a Visitor-facing page SHALL request resources only from its own origin, plus origins named on an explicit allow-list kept in the test suite. In 2a the allow-list is empty. Plain outbound links (`<a href>`) are not resource requests and are not restricted.

#### Scenario: No third-party requests on load (invariant)

- **WHEN** each Visitor-facing page is loaded in each Language and both themes, with the network observed
- **THEN** every request goes to the page's own origin or an allow-listed origin

#### Scenario: Fonts are self-hosted

- **WHEN** the Main page is loaded
- **THEN** Libre Caslon Display, Newsreader and Libre Franklin are fetched from the page's own origin, and nothing is fetched from `fonts.googleapis.com` or `fonts.gstatic.com`
