// Spec: site-languages.
import { expect, test } from "@playwright/test";

test.describe("bare address with an English browser", () => {
  test.use({ locale: "en-CA" });
  test("lands on /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test.describe("bare address with an unsupported browser language", () => {
  test.use({ locale: "de-DE" });
  test("falls back to /fr/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr\/$/);
  });
});

test.describe("bare address without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("offers a link to each Language", async ({ page }) => {
    await page.goto("/");
    for (const [name, href] of [
      ["Français", "/fr/"],
      ["English", "/en/"],
      ["Italiano", "/it/"],
    ]) {
      await expect(page.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    // Still a Visitor-facing page, so it carries the footer (spec: main-page).
    await expect(page.getByRole("contentinfo")).toHaveText(
      `© ${new Date().getFullYear()} Elena Meyer`,
    );
  });
});

test("the switcher goes to the same page in another Language", async ({ page }) => {
  await page.goto("/fr/");
  await page
    .getByRole("navigation", { name: "Langue" })
    .getByRole("link", { name: "Italiano" })
    .click();
  await expect(page).toHaveURL(/\/it\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "it");
});

test("the current Language is marked and is not a link to itself", async ({ page }) => {
  await page.goto("/en/");
  const switcher = page.getByRole("navigation", { name: "Language" });
  await expect(switcher.locator('[aria-current="page"]')).toHaveText("English");
  await expect(switcher.getByRole("link", { name: "English" })).toHaveCount(0);
});

test("Section names are translated but anchors are shared", async ({ page }) => {
  for (const [lang, label] of [
    ["fr", "Balados"],
    ["en", "Podcasts"],
    ["it", "Podcast"],
  ]) {
    await page.goto(`/${lang}/`);
    const link = page.locator(".nav").getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", "#balados");
  }
});
