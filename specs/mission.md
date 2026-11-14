# Mission

## What this is

Elena's personal journalism portfolio: a public website showcasing her
articles, videos, photography, and podcast work, plus a private portal where
Elena logs in to add and manage that content without needing a developer.

## Why it exists

Elena needs a single, professional home for her work that she controls
directly. Right now her work is scattered across Substack, YouTube/Spotify,
and wherever her articles and photos were originally published. This site
aggregates links and embeds to that work and presents it under her own
name and design, and lets her keep it current herself.

## Audience

- **Primary**: editors, producers, and publications evaluating Elena for
  commissions or hiring — people who want to see a portfolio quickly and
  judge range and quality.
- **Secondary**: readers/viewers who followed a link to her site from a
  byline, social media, or a Substack/podcast cross-post.
- **Not the audience**: the general public browsing for content discovery.
  This is a portfolio, not a publishing platform — Elena's actual
  articles/videos/podcast episodes continue to live on Substack, YouTube,
  Spotify/Apple Podcasts, etc. This site curates and links/embeds to them.

## Scope

### In scope (v1)

- Public-facing pages: home, articles, videos, photos, podcast — each a
  curated list of entries (title, description, date, link or embed).
- A private admin portal, reachable only by Elena, to log in and:
  - add/edit/remove a content entry (article link, video embed, photo set,
    podcast episode)
  - upload a photo/image file, or paste an external link (YouTube, Substack,
    Spotify/Apple Podcasts) as the entry's media
- Single admin account (Elena). No visitor accounts, no comments, no
  newsletter signup, no contact form in v1.
- Public pages render as fast static output wherever possible; only the
  admin portal and its data-writing routes require a server at request time.

### Out of scope (v1 — revisit later if asked for)

- Multi-user / multi-role accounts (editor, assistant, etc.)
- Visitor-facing accounts, comments, likes, newsletter signup
- Self-hosted video/audio transcoding or a CDN pipeline for large media
  (v1 supports image uploads and link/embed-based video & audio; see
  tech-stack.md)
- Analytics or visitor tracking of any kind
- Search, tagging/filtering UI beyond simple chronological or category lists
- Internationalization

### Explicitly deferred architecture decision

The admin portal and file uploads turn this from a purely static site into
one with a real authentication boundary. That boundary is treated as a
**sensitive area** — see "Sensitive areas" below and `threat-model.md`.
It is built as its own spec'd feature (Normal/Critical track via
`/sdd-start`), not assumed or partially implemented during `/sdd-init`.

## Sensitive areas — these force the Critical track

Per the SDD workflow, the following are named now, in the constitution, so
no later session can downgrade them by local judgement:

- **Authentication** — Elena's login (any flow: password, magic link, OAuth)
- **The admin portal's write routes** — anything that creates, edits, or
  deletes a published content entry, or uploads a file
- **File upload handling** — path/filename handling, file type validation,
  storage bucket permissions
- **Session handling** — cookies, tokens, expiry, logout

Any change touching these is Critical track regardless of how small it
looks, per `~/.claude/WORKFLOW.md` §1.

## Success looks like

- Elena can, without asking a developer, log in and publish a new article
  link, video embed, or photo set within a couple of minutes.
- No one but Elena can reach the admin portal's write routes.
- The public site loads fast (static-first) and looks credible to an editor
  skimming it on a phone.
