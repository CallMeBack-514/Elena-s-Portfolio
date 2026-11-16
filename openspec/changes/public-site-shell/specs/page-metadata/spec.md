# Spec Delta

## Purpose

Gives each page a title, description, Language marking and link-sharing
preview in its own Language, so links shared by editors look right and
search engines tie the three Language versions together.

## ADDED Requirements

### Requirement: Title and description per Language
Every Visitor-facing page SHALL have a `<title>` and a meta description in the page's Language.

#### Scenario: Italian Main page
- **WHEN** a Visitor requests `/it/`
- **THEN** the `<title>` contains "Elena Meyer" and the meta description is in Italian

### Requirement: Alternate Language links
Every Visitor-facing page SHALL list itself and its versions in the other two Languages as alternate links (`hreflang` fr, en, it), plus an `x-default` pointing at the bare address. Every URL is absolute and uses the site's canonical origin.

#### Scenario: Alternates on the English Main page
- **WHEN** `/en/` is fetched
- **THEN** its head contains alternate links for `fr`, `en`, `it` and `x-default`, pointing at `/fr/`, `/en/`, `/it/` and `/` on the canonical origin

### Requirement: Link-sharing preview
Every Visitor-facing page SHALL carry Open Graph tags: title, description, locale (`fr_CA`, `en_CA`, `it_IT`), canonical URL, and an absolute share image of 1200 × 630 pixels with alt text.

#### Scenario: Shared link preview
- **WHEN** `/fr/` is fetched
- **THEN** it has `og:title`, `og:description`, `og:locale` = `fr_CA`, `og:url`, `og:image` (an absolute URL that returns a 1200 × 630 PNG) and `og:image:alt`
