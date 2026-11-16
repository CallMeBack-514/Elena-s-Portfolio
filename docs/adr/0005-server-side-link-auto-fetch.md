# The Portal fetches an article's title, description and image from its link

When Elena pastes an article link, the server fetches that page and fills in the Work title, Description draft and a cover image; a small resized copy of the image is stored in our own storage rather than displayed from the outlet's site. Server-side fetching of user-supplied URLs is a known risk (a server tricked into requesting addresses it shouldn't), so this is its own Critical-track feature. Running on Cloudflare's functions means fetches cannot reach internal network addresses; we additionally restrict to ordinary http(s) URLs, cap response size and time, and treat everything returned as untrusted. Fields always stay editable for when a site blocks the fetch.

## Considered Options

- Manual entry only — simpler and safer, declined for Elena's convenience.
- Displaying the image from the outlet's site — rejected: breaks when the outlet moves it, and makes every Visitor contact third-party servers.
