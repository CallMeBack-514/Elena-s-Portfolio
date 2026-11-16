import { defineConfig, fontProviders } from "astro/config";
import prelaunch from "./integrations/prelaunch.ts";

// Static-first: every page prerenders by default, and `output` stays
// "static" (Astro removed the old "hybrid" mode in v5). When the Portal is
// built, add the @astrojs/cloudflare adapter and opt only the Portal's
// routes out of prerendering (`export const prerender = false;`).
// See specs/tech-stack.md and docs/adr/0003.
export default defineConfig({
  output: "static",
  integrations: [prelaunch()],
  // Intended free subdomain; confirm when the Cloudflare Pages project is
  // created, and keep in sync with SITE_ORIGIN in src/config/site.ts.
  site: "https://elena-meyer.pages.dev",
  // Elena's three fonts, downloaded at build time from Fontsource and served
  // from our own origin (spec: external-resources). Weights follow her mockup.
  fonts: [
    {
      name: "Libre Caslon Display",
      cssVariable: "--font-mast",
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Times New Roman", "Georgia", "serif"],
    },
    {
      name: "Newsreader",
      cssVariable: "--font-serif",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "Times New Roman", "serif"],
    },
    {
      name: "Libre Franklin",
      cssVariable: "--font-sans",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Helvetica Neue", "Arial", "sans-serif"],
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
