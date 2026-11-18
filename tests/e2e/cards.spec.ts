// Spec: entry-cards (and the Card link rules of articles-section).
import { expect, test } from "@playwright/test";
import { publishedArticles } from "../support/articles";

const cardOf = (page: import("@playwright/test").Page, title: string) =>
  page.locator(".card").filter({ has: page.getByRole("link", { name: title }) });

test("a Card shows image area, kicker, title, Description, Outlet and date, in that order", async ({
  page,
}) => {
  const [first] = publishedArticles();
  await page.goto("/fr/articles/");
  const card = page.locator(".card").first();
  await expect(card.locator(".card-media")).toBeVisible();
  await expect(card.locator(".kicker")).toHaveText("Articles");
  await expect(card.locator(".card-title-text")).toHaveText(first.workTitle);
  await expect(card.locator(".card-desc")).toHaveText(first.description.fr.value);
  await expect(card.locator(".card-meta")).toContainText(first.outlet);
  const expectedDate = new Date(first.date).toLocaleDateString("fr", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  await expect(card.locator("time")).toHaveText(expectedDate);
  await expect(card.locator("time")).toHaveAttribute("datetime", first.date);
  const order = await card
    .locator(":scope > *")
    .evaluateAll((els) => els.map((el) => el.className));
  expect(order).toEqual(["card-media", "kicker", "card-title", "card-desc", "card-meta"]);
});

test("the date is written in the page's Language", async ({ page }) => {
  const [first] = publishedArticles();
  for (const lang of ["fr", "en", "it"] as const) {
    await page.goto(`/${lang}/articles/`);
    const expected = new Date(first.date).toLocaleDateString(lang, {
      dateStyle: "long",
      timeZone: "UTC",
    });
    await expect(page.locator(".card time").first()).toHaveText(expected);
  }
});

test("a French Article is marked lang=fr, with an FR badge on /en/ and none on /fr/", async ({
  page,
}) => {
  const french = publishedArticles().find((a) => a.originalLanguage === "fr");
  test.skip(!french, "no French Article in the data");
  await page.goto("/en/articles/");
  const card = cardOf(page, french!.workTitle);
  await expect(card.locator(".card-title-text")).toHaveAttribute("lang", "fr");
  await expect(card.locator(".badge")).toHaveText("FR");
  await page.goto("/fr/articles/");
  await expect(cardOf(page, french!.workTitle).locator(".badge")).toHaveCount(0);
});

test("an Article without an image shows a 3:2 placeholder and no image", async ({ page }) => {
  const imageless = publishedArticles().find((a) => !a.image);
  test.skip(!imageless, "every Article has an image");
  await page.goto("/fr/articles/");
  const card = cardOf(page, imageless!.workTitle);
  await expect(card.locator(".card-placeholder")).toBeVisible();
  await expect(card.locator("img")).toHaveCount(0);
  const box = await card.locator(".card-media").boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
});

test("Card images keep a 3:2 area and do not overflow it", async ({ page }) => {
  await page.goto("/fr/articles/");
  const media = page.locator(".card-media:has(img)").first();
  await media.scrollIntoViewIfNeeded();
  const box = await media.boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
  const img = await media.locator("img").boundingBox();
  expect(img!.width).toBeLessThanOrEqual(box!.width + 1);
  expect(img!.height).toBeLessThanOrEqual(box!.height + 1);
});

test("each Card is one tab stop whose name starts with the title and names the Outlet's site", async ({
  page,
}) => {
  const list = publishedArticles();
  await page.goto("/fr/articles/");
  const cards = page.locator(".card");
  await expect(cards).toHaveCount(list.length);
  const focusables = await cards.evaluateAll((els) =>
    els.map((el) => el.querySelectorAll("a, button, [tabindex]").length),
  );
  expect(focusables.every((n) => n === 1)).toBe(true);
  const first = list[0];
  const link = page.getByRole("link", { name: first.workTitle });
  await expect(link).toHaveAccessibleName(
    new RegExp(
      `^${first.workTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*\\(site ${first.outlet}\\)$`,
    ),
  );
});

test("activating anywhere on an Article Card opens the Outlet's page in the same tab", async ({
  page,
  context,
}) => {
  const [first] = publishedArticles();
  // Answer the Outlet's address locally: the test never leaves the machine.
  await context.route(first.url, (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>Outlet</title>" }),
  );
  await page.goto("/en/articles/");
  let popup = false;
  context.on("page", () => (popup = true));
  await page.locator(".card").first().locator(".card-desc").click();
  await expect(page).toHaveURL(first.url);
  expect(popup).toBe(false);
});

test("keyboard focus shows the hover feedback and a visible focus indicator", async ({ page }) => {
  await page.goto("/fr/articles/");
  const link = page.locator(".card-title a").first();
  await link.focus();
  const card = page.locator(".card").first();
  await expect(card.locator(".card-title-text")).toHaveCSS(
    "background-size",
    /^\d+(\.\d+)?px 1px$/,
  );
  const outline = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hovering shows the underline without a transition and does not scale the image", async ({
    page,
  }) => {
    await page.goto("/fr/articles/");
    const card = page.locator(".card:has(img)").first();
    await card.hover();
    const img = card.locator("img");
    await expect(img).toHaveCSS("transform", "none");
    await expect(card.locator(".card-title-text")).toHaveCSS("transition-duration", "0s");
    await expect(card.locator(".card-title-text")).not.toHaveCSS("background-size", "0px 1px");
  });
});
