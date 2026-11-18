// Spec: section-pages.
import { expect, test } from "@playwright/test";

test("every Section has a page in Italian, headed by its Italian name", async ({ page }) => {
  for (const [path, name] of [
    ["articles", "Articoli"],
    ["tele", "TV"],
    ["balados", "Podcast"],
    ["these", "Tesi"],
    ["art", "Arte"],
  ]) {
    const response = await page.goto(`/it/${path}/`);
    expect(response?.status()).toBe(200);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(name);
  }
});

test("an empty Section says coming soon, with no list", async ({ page }) => {
  await page.goto("/fr/tele/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Télé");
  await expect(page.locator("main").getByText("En cours d'ajout.")).toBeVisible();
  await expect(page.locator("main ul.cards, main .card")).toHaveCount(0);
});

test("the Thèse page shows the question, the summary and four labelled fields", async ({
  page,
}) => {
  await page.goto("/en/these/");
  await expect(page.locator("main blockquote")).toBeVisible();
  await expect(page.locator("main .lede")).not.toBeEmpty();
  await expect(page.locator("main dl.facts dt")).toHaveText([
    "Field",
    "Framework",
    "Deliverable",
    "Defence",
  ]);
  await expect(page.locator("main dl.facts dd")).toHaveCount(4);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("the Articles page fits the screen with one Card per row", async ({ page }) => {
    await page.goto("/fr/articles/");
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(360);
    const lefts = await page
      .locator(".cards > li")
      .evaluateAll((els) => els.slice(0, 3).map((el) => el.getBoundingClientRect().left));
    expect(new Set(lefts).size).toBe(1);
  });

  for (const path of ["tele", "balados", "these", "art"]) {
    test(`/${path}/ fits the screen`, async ({ page }) => {
      await page.goto(`/en/${path}/`);
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(360);
    });
  }
});
