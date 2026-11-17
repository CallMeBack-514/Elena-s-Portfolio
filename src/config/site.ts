// Site-wide settings.
//
// LAUNCHED stays false until /sdd-release, after build step 2b and Elena's
// review of every English and Italian text. While false, every page and
// every response carries noindex. Flip it in its own PR, and only once
// `npm run check:launch` passes.
export const LAUNCHED = false;

// Canonical origin for absolute URLs (hreflang, Open Graph). Keep in sync
// with `site` in astro.config.mjs.
export const SITE_ORIGIN = "https://elena-meyer.pages.dev";

export const NAME = "Elena Meyer";
