# Elena Meyer — Portfolio

A public portfolio of Elena Meyer's journalism, audio and art work in French,
English and Italian, plus a private Portal where Elena maintains it herself.

## People

**Elena**:
The journalist whose work the site presents, and the only person who can sign in to the Portal.
_Avoid_: user, admin, owner, author

**Visitor**:
Anyone viewing the public site; never signs in.
_Avoid_: user, reader, audience

**Maintainer**:
The developer who builds the site and owns its accounts, and can restore Elena's access.
_Avoid_: admin, owner

## Site structure

**Section**:
One of the top-level parts of the site — Articles, Télé, Balados, Thèse, Art — each with its own full page and a Preview on the Main page.
_Avoid_: category, page, tab, rubrique

**Subsection**:
A labelled group inside the Art Section — Portraits, Poésie, Substack — with its own Order.
_Avoid_: category, group, collection

**Main page**:
The single page per Language that shows every Section's Preview and Elena's Text blocks.
_Avoid_: home, landing page, index

**Preview**:
The first Published Entries of a Section shown on the Main page, in Elena's Order: three per Section, or the first of each Subsection in Art.
_Avoid_: featured, highlights, teaser

**Text block**:
A piece of Elena's own prose that isn't an Entry — her portrait/bio, collaborations, thesis description (the whole Thèse Section, for now), contact.
_Avoid_: page content, static text, copy

## Content

**Entry**:
One item of Elena's work listed in a Section.
_Avoid_: item, post, content, piece

**Article**:
An Entry in the Articles Section: a written piece published by an Outlet, added from its link.
_Avoid_: story, piece, link

**Clip**:
An Entry in the Télé Section: one TV segment or report, entered by hand.
_Avoid_: video, report, extract

**Show**:
An Entry in the Balados Section: one podcast series with its cover and Description, holding its Episodes.
_Avoid_: podcast, balado, series, programme

**Episode**:
One audio instalment of a Show, newest first, played on the site; part of a Show, not an Entry of its own. Elena can hide an individual Episode, and it stays hidden across imports.
_Avoid_: track, item

**Post**:
An Imported Entry in Art's Substack Subsection: one Substack publication by Elena.
_Avoid_: newsletter, article, issue

**Work title**:
The title an Entry's underlying work was published under; always kept in its Original language, never translated.
_Avoid_: headline, name

**Description**:
Elena's short text presenting an Entry, written in all three Languages.
_Avoid_: summary, blurb, excerpt, subtitle

**Original language**:
The single Language a work was published in, shown as a badge on its Entry.
_Avoid_: source language, locale

**Order**:
The sequence Elena arranges a Section's Entries in by hand; it decides what the Section and its Preview show first.
_Avoid_: sort, ranking, priority

**Series**:
An Entry in Art's Portraits Subsection made of several photos with optional captions, arranged in Elena's own order (e.g. a set of portraits).
_Avoid_: gallery, album, photo set

**Outlet**:
The publication or broadcaster an Entry appeared in (e.g. Radio-Canada, Le Devoir), used to filter a Section; unrelated to the Collaborations Text block.
_Avoid_: publisher, source, collaborator, media

**Poem**:
An Entry in Art's Poésie Subsection holding one poem's title and text, with its own page; never translated.
_Avoid_: post, text

## Lifecycle

**Draft**:
An Entry not visible to Visitors, whether still being written or deliberately hidden (including a hidden Post); visible only in the Portal.
_Avoid_: unpublished, hidden, pending

**Published**:
An Entry Elena has marked as visible to Visitors.
_Avoid_: live, public, active

**Imported**:
A Post or Episode that arrives automatically from one of Elena's public feeds instead of being added in the Portal; it arrives Published and is exempt from the three-Language Description rule. A new Post lands at the top of its Subsection's Order.
_Avoid_: synced, fetched, external

**Deleted**:
An Entry Elena has permanently removed, together with its photos, after confirming; there is no recovery. Hiding without losing is done with Draft.
_Avoid_: archived, trashed, removed

## Languages

**Language**:
One of French, English or Italian; every Visitor-facing page exists in all three.
_Avoid_: locale, translation, version

## Portal

**Portal**:
The private, signed-in part of the site where Elena adds, edits, orders and publishes Entries and Text blocks.
_Avoid_: admin, dashboard, back-office, CMS
