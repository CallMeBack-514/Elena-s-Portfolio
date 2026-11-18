# Spec Delta

## MODIFIED Requirements

### Requirement: Site works when the choice cannot be stored

If the device refuses storage, the toggle SHALL still switch the current page's theme, and pages SHALL fall back to the device setting. If storage can be read but saving the new choice fails, any previously saved choice SHALL be cleared, so that later pages follow the device rather than the old choice.

#### Scenario: Storage blocked

- **GIVEN** a browser that throws on storage access
- **WHEN** the Visitor activates the toggle
- **THEN** the theme switches on that page and no script error is raised

#### Scenario: Saving fails after an earlier choice

- **GIVEN** a dark-preferring device with a saved choice of light, where reading storage works but saving throws
- **WHEN** the Visitor activates the toggle and then opens another page
- **THEN** the current page switches to dark, no script error is raised, and the next page follows the device (dark) instead of the old saved light choice
