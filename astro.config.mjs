import { defineConfig } from "astro/config";

// Static-first: every page prerenders by default, and `output` stays
// "static" (Astro removed the old "hybrid" mode in v5). When the Portal is
// built, add the @astrojs/cloudflare adapter and opt only the Portal's
// routes out of prerendering (`export const prerender = false;`).
// See specs/tech-stack.md and docs/adr/0003.
export default defineConfig({
  output: "static",
  // Intended free subdomain; confirm when the Cloudflare Pages project is
  // created, and keep in sync with SITE_ORIGIN in src/config/site.ts.
  site: "https://elena-meyer.pages.dev",
  i18n: {
    locales: ["fr", "en", "it"],
    defaultLocale: "fr",
    routing: {
      // Every Language lives under its own prefix, French included.
      prefixDefaultLocale: true,
      // Keep src/pages/index.astro as our own page: it picks the Visitor's
      // browser Language, which Astro's built-in redirect cannot do.
      redirectToDefaultLocale: false,
    },
  },
});
