// Spec: articles-section (the Section page and the Outlet filter).
import { expect, test } from "@playwright/test";
import { publishedArticles } from "../support/articles";

const titles = (page: import("@playwright/test").Page) => page.locator(".card .card-title-text");

test("the Articles page lists every Published Article in Elena's Order", async ({ page }) => {
  await page.goto("/en/articles/");
  await expect(titles(page)).toHaveText(publishedArticles().map((a) => a.workTitle));
});

test("an Outlet filter page lists only that Outlet, in Order, and names it in the title", async ({
  page,
}) => {
  await page.goto("/fr/articles/le-devoir/");
  const expected = publishedArticles().filter((a) => a.outlet === "Le Devoir");
  await expect(titles(page)).toHaveText(expected.map((a) => a.workTitle));
  await expect(page).toHaveTitle(/Le Devoir/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the filter links work and mark the current view", async ({ page }) => {
    await page.goto("/en/articles/");
    const filter = page.getByRole("navigation", { name: "Filter by outlet" });
    await expect(filter.getByRole("link")).toHaveText(["All", "Le Devoir", "Radio-Canada"]);
    await expect(filter.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
    await filter.getByRole("link", { name: "Radio-Canada" }).click();
    await expect(page).toHaveURL("/en/articles/radio-canada/");
    const here = page.getByRole("navigation", { name: "Filter by outlet" });
    await expect(here.getByRole("link", { name: "Radio-Canada" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(here.locator("[aria-current]")).toHaveCount(1);
    await here.getByRole("link", { name: "All" }).click();
    await expect(page).toHaveURL("/en/articles/");
  });
});
