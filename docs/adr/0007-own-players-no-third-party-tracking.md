_Superseded by ADR-0009: the no-tracking promise was dropped._

# Our own audio player and click-to-load video covers, instead of plain embeds

The site promises Visitors no tracking, but standard YouTube and Spotify embeds set cookies and track Visitors as soon as a page loads. Videos therefore show our own designed cover and load YouTube's player only when clicked. Podcast episodes play in our own audio player, streaming the MP3 from the show's public feed (no Spotify or Apple player), where such a feed exists; a show without one falls back to a Spotify embed behind the same click-to-load cover. A fully custom video player was rejected because hosting video files is impossible on the free plans.

## Considered Options

- Custom controls drawn over YouTube's player (Plyr/Vidstack) — rejected: YouTube's terms restrict hiding its branding, the libraries break when YouTube changes, and tracking still occurs once loaded.
- Plain Spotify/YouTube embeds — rejected: tracking on page load.
