import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Temporary: rewritten in task 7.2 to cover every built page, Language and theme.
const pages = ["/"];

for (const path of pages) {
  test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
