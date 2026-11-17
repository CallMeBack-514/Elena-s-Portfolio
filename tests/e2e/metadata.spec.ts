// Spec: page-metadata, plus the page-level half of prelaunch-visibility.
import { expect, test } from "@playwright/test";

const ORIGIN = "https://elena-meyer.pages.dev";

test("title and description are in the page's Language", async ({ page }) => {
  await page.goto("/it/");
  await expect(page).toHaveTitle(/Elena Meyer/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /giornalista multipiattaforma/,
  );
});

test("alternate links tie the three Languages together with absolute URLs", async ({ page }) => {
  await page.goto("/en/");
  const alternates = await page
    .locator('link[rel="alternate"]')
    .evaluateAll((links) =>
      links.map((link) => [link.getAttribute("hreflang"), link.getAttribute("href")]),
    );
  expect(alternates).toEqual([
    ["fr", `${ORIGIN}/fr/`],
    ["en", `${ORIGIN}/en/`],
    ["it", `${ORIGIN}/it/`],
    ["x-default", `${ORIGIN}/`],
  ]);
});

test("link-sharing tags are complete, with a 1200 × 630 PNG", async ({ page, request }) => {
  await page.goto("/fr/");
  const og = (property: string) =>
    page.locator(`meta[property="${property}"]`).getAttribute("content");

  expect(await og("og:title")).toContain("Elena Meyer");
  expect(await og("og:description")).toBeTruthy();
  expect(await og("og:locale")).toBe("fr_CA");
  expect(await og("og:url")).toBe(`${ORIGIN}/fr/`);
  expect(await og("og:image:alt")).toBeTruthy();

  const image = await og("og:image");
  expect(image).toBe(`${ORIGIN}/og-card.png`);
  // The canonical origin isn't served locally; fetch the same path here.
  const response = await request.get(new URL(image!).pathname);
  expect(response.headers()["content-type"]).toBe("image/png");
  const png = await response.body();
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});

test("og:locale follows the Language", async ({ page }) => {
  for (const [lang, locale] of [
    ["en", "en_CA"],
    ["it", "it_IT"],
  ]) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale);
  }
});

test("pages carry noindex before launch", async ({ page }) => {
  await page.goto("/fr/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});
