// Invariant (spec: external-resources): on load, pages fetch nothing from
// other origins. Fonts, styles and scripts come from the site itself.
// Plain outbound links (<a href>) are not requests and are not restricted.
import { expect, test } from "@playwright/test";
import { builtPages } from "../support/pages";

// Adding an origin here is a deliberate decision, made in a spec (for
// example a Spotify embed in build step 2b). Never add one to get a build
// green.
const ALLOWED_ORIGINS: readonly string[] = [];

for (const colorScheme of ["light", "dark"] as const) {
  test(`pages load nothing from other origins (${colorScheme})`, async ({ browser, baseURL }) => {
    const own = new URL(baseURL!).origin;
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.protocol === "data:" || url.protocol === "blob:") return;
      if (url.origin !== own && !ALLOWED_ORIGINS.includes(url.origin)) {
        foreign.push(`${page.url()} → ${request.url()}`);
      }
    });
    for (const path of builtPages()) {
      await page.goto(path, { waitUntil: "networkidle" });
    }
    await context.close();
    expect(foreign).toEqual([]);
  });
}
