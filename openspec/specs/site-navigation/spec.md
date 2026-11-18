# site-navigation Specification

## Purpose

Lets a Visitor reach every Section and the Main page from any page, on a
desktop or a phone, with a keyboard or a screen reader, with or without
JavaScript.

Scenarios marked **(invariant)** are promoted to `tests/invariants/` during
`/sdd-build`.

## Requirements

### Requirement: Section nav links to the Section pages

Every Visitor-facing page SHALL have a nav labelled for assistive technology. It links to `/{lang}/articles/`, `/tele/`, `/balados/`, `/these/` and `/art/` in that order, in the page's Language, and uses the accent colour. On a Section page, or on one of its Outlet filter pages, that Section's link is marked as current.

#### Scenario: Every nav link reaches its page (invariant)

- **WHEN** a Visitor follows each nav link on `/it/`
- **THEN** each lands on that Section's Italian page with status 200

#### Scenario: Current Section is marked

- **WHEN** a Visitor is on `/fr/articles/le-devoir/`
- **THEN** the "Articles" nav link is marked as the current page for assistive technology, and no other nav link is

### Requirement: Masthead links to the Main page

On every page other than the Main page, the masthead name SHALL be a link to the Main page in the same Language. On those pages it is not a level-1 heading.

#### Scenario: Back to the Main page

- **GIVEN** a Visitor on `/en/these/`
- **WHEN** they activate "Elena Meyer" in the masthead
- **THEN** they land on `/en/`

### Requirement: Mobile menu below 820 pixels

When JavaScript runs and the viewport is narrower than 820 pixels, the nav SHALL collapse behind a menu button whose accessible name is in the page's Language and which reports whether the menu is expanded. Activating it opens the nav as a full-screen menu.

#### Scenario: Opening the menu

- **GIVEN** a 360 × 740 viewport
- **WHEN** a Visitor on `/fr/` activates the menu button
- **THEN** the button reports it is expanded and every nav link is shown full-screen

### Requirement: Mobile menu keyboard behaviour

While the mobile menu is open, keyboard focus SHALL stay within it, and the rest of the page is unavailable to assistive technology. Escape and following a link both close it. Closing it with Escape returns focus to the menu button.

#### Scenario: Keyboard journey (invariant)

- **GIVEN** a 360 × 740 viewport on `/en/`
- **WHEN** a keyboard Visitor opens the menu, tabs past the last link, and then presses Escape
- **THEN** focus wraps within the menu while it is open, and after Escape the menu is closed, the button reports collapsed, and focus is on the button

#### Scenario: Following a link closes the menu

- **GIVEN** the mobile menu is open on `/it/`
- **WHEN** the Visitor activates "Tesi"
- **THEN** they land on `/it/these/` with the menu closed

#### Scenario: Open menu passes accessibility checks (invariant)

- **GIVEN** the mobile menu is open, in each theme
- **WHEN** the automated accessibility check runs
- **THEN** it reports zero violations

### Requirement: Nav works without JavaScript

Without JavaScript, the menu button SHALL NOT be shown, and every nav link SHALL be visible and usable at every viewport width.

#### Scenario: No script on a phone (invariant)

- **GIVEN** a 360 × 740 viewport with JavaScript disabled
- **WHEN** a Visitor opens `/fr/`
- **THEN** no menu button is shown, every nav link is visible, and the document is no wider than the viewport
