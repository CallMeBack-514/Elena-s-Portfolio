import { defineConfig } from "astro/config";

// Static-first: every page prerenders by default, and `output` stays
// "static" (Astro removed the old "hybrid" mode in v5). When the Portal is
// built, add the @astrojs/cloudflare adapter and opt only the Portal's
// routes out of prerendering (`export const prerender = false;`).
// See specs/tech-stack.md and docs/adr/0003.
export default defineConfig({
  output: "static",
  // Intended free subdomain; confirm when the Cloudflare Pages project is created.
  site: "https://elena-meyer.pages.dev",
});
