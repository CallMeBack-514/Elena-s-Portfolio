# Mission

Vocabulary in this file follows `GLOSSARY.md`. The reasoning behind the
larger decisions is in `docs/adr/`.

## What this is

Elena Meyer's portfolio: a public website presenting her journalism, TV,
podcast, research and art work in French, English and Italian. It also has a
private **Portal** where Elena signs in to add and manage that work without
needing a developer.

Elena is a multiplatform journalist (Radio-Canada, Le Devoir, ICI RDI),
podcast host and producer, and an M.A. journalism research student at
Concordia, based in Toronto and Montréal. The site's structure and visual
design come from a mockup she made herself.

## Why it exists

Elena needs a single, professional home for her work that she controls
directly. Her work is currently scattered across outlets, Spotify and
Substack. The site gathers links to that work and plays her audio and video,
under her own name and design, and she keeps it current herself.

## Who it's for

- **Primary**: editors, producers and publications evaluating Elena for
  commissions or hiring. They want to judge her range and quality quickly,
  often on a phone, and then contact her.
- **Secondary**: readers and listeners who followed a link from a byline, a
  podcast or social media.
- **Not the audience**: the general public browsing for content. This is a
  portfolio, not a publishing platform. Her articles, TV pieces and podcasts
  stay hosted where they were published, and the site curates and links to
  them.

## The project's second purpose

The project is also how its Maintainer learns and exercises their
spec-driven workflow (`~/.claude/WORKFLOW.md`). Its ceremony, including the
Critical-track work on authentication, is part of the point, not overhead
to cut. Shipping a good site for Elena is still the result that matters.

## Scope

### In scope (v1)

**Public site**, in three Languages (French, English, Italian):

- Each Visitor-facing page exists at `/fr/…`, `/en/…` and `/it/…`.
- A bare address sends the Visitor to the Language matching their browser,
  falling back to French.
- The **Main page** shows Elena's Text blocks and a Preview of every Section.
- Each **Section** also has its own full page, listing its Entries as
  Cards. Every Entry except an Article has its own Detail page. An
  Article's Card links to the Outlet, which keeps its text.
- Entry images, including the share image an Outlet publishes for an
  Article, are stored by us and never loaded from another site
  (ADR-0010).
- The Sections:
  - **Articles**: Articles, filterable by Outlet.
  - **Télé**: Clips. Video plays behind our own cover that loads the
    platform's player only on click.
  - **Balados**: Shows, each listing its Episodes, played in Spotify's
    embedded player (ADR-0009).
  - **Thèse**: a single Text block for now.
  - **Art**: three Subsections, which are Portraits (photo Series, nudes
    shown directly), Poésie (Poems, each with its own page) and Substack
    (Imported Posts).
- An About part (portrait/bio, collaborations, contact email and social
  links as plain text and links). There is no contact form.
- Light and dark themes. The site follows the Visitor's device setting and
  has a toggle, remembered only on that device.
- Elena's own text (Text blocks and Descriptions) exists in all three
  Languages. Work titles, Poem text and Imported content stay in their
  Original language, with a badge.

**Portal**, reachable only by Elena:

- Sign in with email and password.
- Add, edit, order (drag-and-drop) and delete Entries. Deleting is permanent
  and asks for confirmation. Draft/Published switch.
- Edit every Text block in all three Languages.
- Add an Article by pasting its link. The Work title, a Description draft
  and the cover image are fetched automatically and stay editable.
- Upload photos for Series. Photos are resized in the browser before upload.
- Hide individual Episodes and Posts.
- Saving a Published Entry puts it live within a couple of minutes.

**Automatic imports**:

- Substack Posts are imported from Elena's public feed, arriving Published at
  the top of the Substack Subsection.
- Podcast Episodes are imported from each Show's public feed, where one
  exists.

### Out of scope (v1, revisit later if asked for)

- Multiple accounts or roles (editor, assistant…).
- Visitor accounts, comments, likes, newsletter signup, contact form.
- Analytics of our own. We collect no Visitor data. Third-party embeds may
  track Visitors; that is accepted (ADR-0009).
- Self-hosted video: video stays on YouTube or Radio-Canada.
- A custom domain. The site lives on a free `*.pages.dev` subdomain.
- Search, or tag filtering beyond the Outlet filter.
- A second sign-in factor (see ADR-0004).

### Planned after v1

- A **"Traduire"** button in the Portal that drafts the other two Languages
  for Elena to review (ADR-0006).

## Build order

Each step is its own feature through `/sdd-start`:

1. **Constitution amendment**: this file, `tech-stack.md`,
   `threat-model.md`, `GLOSSARY.md` and the ADRs.
2. **Public site**, in Elena's design, in FR/EN/IT, with her current content
   built in. Includes the video cover and the theme toggle. Split in two:
   - **2a, site shell** (done, PR #11): design, Languages, theme toggle,
     Main page with Elena's Text blocks, launch gate.
   - **2b, Sections**, in the design brief's Card design, split in two:
     - **2b-1** (done, PR #17): Cards, Section pages, the Main page in blocks with
       Previews, the mobile menu, and Articles with the Outlet filter.
     - **2b-2**: Télé (video cover), Balados (Spotify), Art (Series,
       Poems, Substack) and their Detail pages.
3. **Portal core**: sign-in, Entries, Order, Draft/Published, Text blocks,
   rebuild on save, the 3-day scheduled rebuild. _Critical._
4. **Photo uploads** for Series. _Critical._
5. **Article link auto-fetch.** _Critical._
6. **Feed imports** (Substack, podcasts).
7. **Traduire** button.

## Sensitive areas: these force the Critical track

Named here so that no later session can downgrade them on its own judgement:

- **Authentication**: Elena's sign-in, password reset.
- **Portal write routes**: anything that creates, edits, orders, deletes or
  publishes an Entry or Text block, or triggers a rebuild.
- **File upload handling**: file type and size validation, storage bucket
  permissions, file naming.
- **Session handling**: cookies, tokens, expiry, sign-out.
- **Server-side fetching of URLs**: the Article link auto-fetch, and the feed
  imports wherever they run at request time rather than at build time.
- **Row Level Security policies** on Supabase.

Any change touching these is Critical track regardless of size, per
`~/.claude/WORKFLOW.md` §1.

## Success looks like

- Elena can sign in and publish a new Article, Clip or Series within a
  couple of minutes, without asking anyone.
- New Substack Posts and podcast Episodes appear on the site with no action
  from her.
- No one but Elena can reach the Portal's write routes.
- An editor skimming on a phone finds the site fast, credible and in their
  Language, and can find how to contact her.
- The site costs nothing to run.
