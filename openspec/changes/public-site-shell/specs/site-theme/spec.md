# Spec Delta

## Purpose

Shows the site in Elena's light or dark design. It follows the Visitor's
device setting, with a toggle that saves an override on that device only.

## ADDED Requirements

### Requirement: Theme follows the device by default

With no saved choice, the site SHALL show the dark theme when the device prefers a dark colour scheme and the light theme otherwise.

#### Scenario: Dark device

- **GIVEN** a device that prefers a dark colour scheme and no saved choice
- **WHEN** the Visitor opens any page
- **THEN** the dark theme is shown

#### Scenario: Light device

- **GIVEN** a device that prefers a light colour scheme and no saved choice
- **WHEN** the Visitor opens any page
- **THEN** the light theme is shown

### Requirement: Toggle switches and saves the theme on this device

Every page SHALL have a theme toggle that switches between light and dark. Its accessible name says which theme it switches to, in the page's Language. The choice SHALL be saved on the device and override the device setting on later visits.

#### Scenario: Override persists

- **GIVEN** a dark-preferring device showing the dark theme
- **WHEN** the Visitor activates the toggle and then opens another page
- **THEN** the light theme is shown on both pages

#### Scenario: Accessible name

- **WHEN** a Visitor on `/fr/` sees the light theme
- **THEN** the toggle's accessible name, in French, says it switches to the dark theme

### Requirement: Saved theme applies before first paint

A saved theme SHALL be applied before the page is first painted, so the page never flashes the other theme while loading.

#### Scenario: No flash on load

- **GIVEN** a saved choice of light on a dark-preferring device
- **WHEN** the Visitor loads a page
- **THEN** the root element already carries the light theme marker when the first stylesheet applies

### Requirement: Site works when the choice cannot be stored

If the device refuses storage, the toggle SHALL still switch the current page's theme, and pages SHALL fall back to the device setting.

#### Scenario: Storage blocked

- **GIVEN** a browser that throws on storage access
- **WHEN** the Visitor activates the toggle
- **THEN** the theme switches on that page and no script error is raised

### Requirement: Both themes meet accessibility checks

Every Visitor-facing page SHALL have no automatically detectable accessibility violations, including colour contrast, in either theme and in every Language.

#### Scenario: Accessibility in both themes (invariant)

- **WHEN** the automated accessibility check runs on every Visitor-facing page in each Language, in light and in dark
- **THEN** it reports zero violations
