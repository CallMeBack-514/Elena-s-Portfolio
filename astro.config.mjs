import { defineConfig } from "astro/config";

// Static-first: every page prerenders by default. When the admin portal
// feature is built, switch `output` to "hybrid" and opt individual portal
// routes out of prerendering (`export const prerender = false;`) rather
// than making the whole site server-rendered. See specs/tech-stack.md.
export default defineConfig({
  output: "static",
  site: "https://elena-portfolio.vercel.app",
});
