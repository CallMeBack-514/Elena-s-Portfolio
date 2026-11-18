# Spec Delta

## MODIFIED Requirements

### Requirement: Unreviewed translations warn at build

Every English and Italian Text block value, and every Entry Description in every Language (French included, since we draft those), SHALL record whether Elena has reviewed it. A build with any unreviewed value SHALL succeed but print a warning that lists them.

#### Scenario: Draft translations

- **GIVEN** the English bio is marked unreviewed
- **WHEN** the site is built
- **THEN** the build succeeds and prints a warning naming the bio's English value

#### Scenario: Drafted French Description

- **GIVEN** an Article whose French Description is marked unreviewed
- **WHEN** the site is built
- **THEN** the build succeeds and prints a warning naming that Article's French Description

### Requirement: Launch check blocks unready content

A launch check command SHALL fail while any English or Italian Text block value is unreviewed, any Entry Description in any Language is unreviewed, or any value is still marked as a placeholder (such as the contact email). It lists every blocking item and succeeds only when none remain.

#### Scenario: Placeholder email blocks launch

- **GIVEN** the contact email is marked as a placeholder
- **WHEN** the launch check runs
- **THEN** it exits non-zero and lists the contact email

#### Scenario: Unreviewed Article Description blocks launch

- **GIVEN** an Article whose Italian Description is marked unreviewed, and every Text block is ready
- **WHEN** the launch check runs
- **THEN** it exits non-zero and lists that Article's Italian Description

#### Scenario: Ready to launch

- **GIVEN** every value is reviewed and no placeholder remains
- **WHEN** the launch check runs
- **THEN** it exits zero
