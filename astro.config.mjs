import { defineConfig, fontProviders } from "astro/config";
import prelaunch from "./integrations/prelaunch.ts";

// Static-first: every page prerenders by default, and `output` stays
// "static" (Astro removed the old "hybrid" mode in v5). When the Portal is
// built, add the @astrojs/cloudflare adapter and opt only the Portal's
// routes out of prerendering (`export const prerender = false;`).
// See specs/tech-stack.md and docs/adr/0003.
/** One local font variant per weight and style: src/assets/fonts/<slug>-<weight>-<style>.woff2 */
function localVariants(slug, weights, styles) {
  return weights.flatMap((weight) =>
    styles.map((style) => ({
      weight,
      style,
      src: [`./src/assets/fonts/${slug}-${weight}-${style}.woff2`],
    })),
  );
}

export default defineConfig({
  output: "static",
  // Fail, not warn, when two pages or two Entries claim the same path or id.
  // Under "warn", the file() loader keeps the last Article with a repeated
  // id and silently drops the other.
  prerenderConflictBehavior: "error",
  integrations: [prelaunch()],
  // Intended free subdomain; confirm when the Cloudflare Pages project is
  // created, and keep in sync with SITE_ORIGIN in src/config/site.ts.
  site: "https://elena-meyer.pages.dev",
  // Elena's three fonts, committed under src/assets/fonts/ (SIL Open Font
  // License, see the LICENSE-*.txt files there) and served from our own
  // origin (spec: external-resources). They are not downloaded at build time,
  // because a Fontsource CDN fetch failure broke CI on PR #11. Weights follow
  // her mockup.
  fonts: [
    {
      name: "Libre Caslon Display",
      cssVariable: "--font-mast",
      provider: fontProviders.local(),
      fallbacks: ["Times New Roman", "Georgia", "serif"],
      options: { variants: localVariants("libre-caslon-display", [400], ["normal"]) },
    },
    {
      name: "Newsreader",
      cssVariable: "--font-serif",
      provider: fontProviders.local(),
      fallbacks: ["Georgia", "Times New Roman", "serif"],
      options: {
        variants: localVariants("newsreader", [400, 500, 600, 700], ["normal", "italic"]),
      },
    },
    {
      name: "Libre Franklin",
      cssVariable: "--font-sans",
      provider: fontProviders.local(),
      fallbacks: ["Helvetica Neue", "Arial", "sans-serif"],
      options: { variants: localVariants("libre-franklin", [400, 500, 600, 700], ["normal"]) },
    },
  ],
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
