// Generates public/og-card.png, the 1200 × 630 link-sharing image (spec:
// page-metadata): "Elena Meyer" in the masthead face on the paper colour,
// over the location line. One card serves all three Languages, so it holds
// no translated text.
// Run by hand only when the design changes, after `npm run build`:
//
//   node scripts/make-og-card.ts
//
// It borrows the self-hosted @font-face rules from the built French Main
// page and serves dist/ through Playwright's request routing, so the card
// uses exactly the fonts the site ships.
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";

const DIST = "dist";
const ORIGIN = "http://og-card.local";

const page = readFileSync(join(DIST, "fr/index.html"), "utf8");
const fontFaces = [...page.matchAll(/<style>(@font-face[\s\S]*?)<\/style>/g)]
  .map((match) => match[1])
  .join("\n");
const location = /<div class="strip"><div class="wrap"><span>([^<]+)<\/span>/.exec(page)?.[1];
if (!location) throw new Error("Location line not found in dist/fr/index.html; run npm run build");

const card = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>${fontFaces}
  html, body { margin: 0; width: 1200px; height: 630px; }
  body { background: #f7f6f2; color: #121212; display: grid; place-content: center;
         text-align: center; gap: 28px; }
  h1 { font-family: var(--font-mast); font-weight: 400; font-size: 132px; line-height: 1; margin: 0; }
  p { font-family: var(--font-sans); font-size: 26px; font-weight: 600; letter-spacing: .09em;
      text-transform: uppercase; margin: 0; }
  hr { width: 280px; border: 0; border-top: 4px solid #121212; margin: 0 auto; }
</style></head>
<body><h1>Elena Meyer</h1><hr><p>${location}</p></body></html>`;

const TYPES: Record<string, string> = { ".woff2": "font/woff2", ".css": "text/css" };

const browser = await chromium.launch();
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await tab.route(`${ORIGIN}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/") return route.fulfill({ contentType: "text/html", body: card });
    const body = readFileSync(join(DIST, path));
    return route.fulfill({ contentType: TYPES[extname(path)] ?? "application/octet-stream", body });
  });
  await tab.goto(`${ORIGIN}/`);
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: "public/og-card.png" });
  console.log("Wrote public/og-card.png");
} finally {
  await browser.close();
}
