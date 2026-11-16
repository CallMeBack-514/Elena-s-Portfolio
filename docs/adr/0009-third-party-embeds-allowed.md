# Third-party embeds are allowed; the site no longer promises Visitors no tracking

_Supersedes ADR-0007._

The Maintainer dropped the promise that Visitors are never tracked. Spotify and YouTube embeds may set cookies and track Visitors, so Balados plays Episodes through Spotify's embedded player, and we build no audio player of our own. We still build no analytics and collect no Visitor data ourselves, so analytics stays out of scope as a feature. Every third-party origin a page loads is still a deliberate choice, guarded by the `external-resources` invariant. Fonts stay self-hosted.

We accept a legal risk: EU rules (for Italian Visitors) and Quebec's privacy law expect consent before third-party cookies are set, and we show no consent banner. If that risk becomes real (a complaint, or a wider audience), add a consent step or bring back click-to-load covers.

Whether Télé videos keep a click-to-load cover is decided in build step 2b, on performance grounds alone: each YouTube embed weighs about 1 MB, which slows an editor reading on a phone.

## Considered Options

- Keep ADR-0007 (our own audio player, click-to-load covers): rejected by the Maintainer. Tracking is not a concern for this site, and our own player costs a build step.
- A consent banner in front of the embeds: not now. It means more interface for every Visitor to deal with, in return for a risk accepted above.
