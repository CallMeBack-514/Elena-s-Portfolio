# Spec Delta

## Purpose

Keeps the unfinished site out of search engines until launch, and stops it
from going public while any of Elena's texts are unreviewed drafts or
placeholders.

## ADDED Requirements

### Requirement: Every page is noindex until launch

While the site is not marked as launched, every built page SHALL carry a robots meta tag with `noindex, nofollow`, and every response from the host SHALL carry an `X-Robots-Tag: noindex, nofollow` header.

#### Scenario: Pre-launch page (invariant while not launched)

- **GIVEN** the site is not marked as launched
- **WHEN** any built page is fetched
- **THEN** it has `<meta name="robots" content="noindex, nofollow">`

#### Scenario: Pre-launch header

- **GIVEN** the site is not marked as launched
- **WHEN** the build output is inspected
- **THEN** its host headers file applies `X-Robots-Tag: noindex, nofollow` to every path

#### Scenario: After launch

- **GIVEN** the site is marked as launched
- **WHEN** the site is built
- **THEN** no page carries the robots noindex tag and the build output has no noindex header rule

### Requirement: Unreviewed translations warn at build

Every English and Italian Text block value SHALL record whether Elena has reviewed it. A build with any unreviewed value SHALL succeed but print a warning that lists them.

#### Scenario: Draft translations

- **GIVEN** the English bio is marked unreviewed
- **WHEN** the site is built
- **THEN** the build succeeds and prints a warning naming the bio's English value

### Requirement: Launch check blocks unready content

A launch check command SHALL fail while any English or Italian Text block value is unreviewed or any value is still marked as a placeholder (such as the contact email). It lists every blocking item and succeeds only when none remain.

#### Scenario: Placeholder email blocks launch

- **GIVEN** the contact email is marked as a placeholder
- **WHEN** the launch check runs
- **THEN** it exits non-zero and lists the contact email

#### Scenario: Ready to launch

- **GIVEN** every value is reviewed and no placeholder remains
- **WHEN** the launch check runs
- **THEN** it exits zero
