// Invariant: zero automatically detectable accessibility violations on every
// built page, in every Language, in both themes (spec: site-theme).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { builtPages, ROOT } from "../support/pages";

// The bare address redirects as soon as it loads. axe needs JavaScript, so
// serve that page without its redirect script and audit the markup a
// Visitor without JavaScript would see.
async function stayOnRoot(page: Page) {
  await page.route(/\/$/, async (route) => {
    if (new URL(route.request().url()).pathname !== ROOT) return route.continue();
    const response = await route.fetch();
    const html = (await response.text()).replace(/<script type="module">[\s\S]*?<\/script>/g, "");
    await route.fulfill({ response, body: html });
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`every page has no accessibility violations (${colorScheme})`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await stayOnRoot(page);
    for (const path of builtPages()) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect.soft(results.violations, `${path} (${colorScheme})`).toEqual([]);
    }
    await context.close();
  });
}
