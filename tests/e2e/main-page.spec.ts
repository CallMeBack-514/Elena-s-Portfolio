// Spec: main-page.
import { expect, test } from "@playwright/test";
import { publishedArticles } from "../support/articles";

test("masthead: Elena's name is the only level-1 heading, with tagline and location", async ({
  page,
}) => {
  await page.goto("/en/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Elena Meyer");
  await expect(page.getByText("Multiplatform journalism, audio and research")).toBeVisible();
  await expect(page.getByText("Toronto · Montréal")).toBeVisible();
});

test("portrait without a photo shows heading, bio and byline, and no image", async ({ page }) => {
  await page.goto("/fr/");
  await expect(
    page.getByRole("heading", { name: "Journaliste multiplateforme à Radio-Canada, à Toronto" }),
  ).toBeVisible();
  await expect(page.getByText(/^À Radio-Canada depuis 2024\./)).toBeVisible();
  await expect(page.getByText("Par Elena Meyer · Toronto")).toBeVisible();
  // The portrait part only: Cards further down have their own images.
  await expect(page.locator(".front img")).toHaveCount(0);
});

test("Collaborations are listed in Elena's order", async ({ page }) => {
  await page.goto("/fr/");
  const list = page.getByRole("complementary").getByRole("listitem");
  await expect(list.locator(".outlet")).toHaveText([
    "Radio-Canada",
    "Le Devoir",
    "ICI RDI",
    "Festival Émergence",
    "CHOQ Radio",
  ]);
  await expect(list.first()).toContainText("Journaliste");
  await expect(list.first()).toContainText("2024");
});

test("each Section has a block, in nav order, between the portrait and Contact", async ({
  page,
}) => {
  await page.goto("/fr/");
  const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
  expect(ids).toEqual(["articles", "tele", "balados", "these", "art", "contact"]);
});

test("the Articles block previews the first three Published Articles and links to all", async ({
  page,
}) => {
  await page.goto("/fr/#articles");
  const block = page.locator("#articles");
  const firstThree = publishedArticles().slice(0, 3);
  await expect(block.locator(".card-title-text")).toHaveText(firstThree.map((a) => a.workTitle));
  const more = block.getByRole("link", { name: /^Tout voir/ });
  await expect(more).toHaveAttribute("href", "/fr/articles/");
  await expect(more).toContainText("Tout voir");
  await expect(more).toContainText("→");
});

test("the Thèse block shows the question and links to its page, without the fields", async ({
  page,
}) => {
  await page.goto("/it/#these");
  const these = page.locator("#these");
  await expect(these.locator("blockquote")).toBeVisible();
  await expect(these.getByRole("link", { name: /Continua a leggere/ })).toHaveAttribute(
    "href",
    "/it/these/",
  );
  await expect(these.locator("dt, dd")).toHaveCount(0);
});

test("a Section without content says 'coming soon' in the page's Language", async ({ page }) => {
  await page.goto("/it/");
  const tele = page.locator("#tele");
  await expect(tele.getByRole("heading", { level: 2 })).toHaveText("TV");
  await expect(tele.getByText("In arrivo.")).toBeVisible();
  await expect(tele.getByRole("list")).toHaveCount(0);
  await expect(tele.getByRole("link", { name: /Vedi tutto/ })).toHaveAttribute("href", "/it/tele/");
});

test("contact shows the email as text and the profile links, and no form", async ({ page }) => {
  for (const lang of ["fr", "en", "it"]) {
    await page.goto(`/${lang}/`);
    const contact = page.locator("#contact");
    await expect(contact.locator(".email")).toHaveText(/@/);
    const profile = contact.getByRole("link", { name: /Radio-Canada/ });
    await expect(profile).toHaveAttribute("href", "https://ici.radio-canada.ca/profil/elena-meyer");
    await expect(page.locator("form")).toHaveCount(0);
  }
});

test("the footer shows the build year", async ({ page }) => {
  await page.goto("/fr/");
  await expect(page.getByRole("contentinfo")).toHaveText(
    `© ${new Date().getFullYear()} Elena Meyer`,
  );
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("nothing scrolls sideways and the tools stay reachable", async ({ page }) => {
    await page.goto("/en/");
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(360);
    await expect(page.getByRole("navigation", { name: "Sections" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Language" })).toBeVisible();
    await expect(page.getByRole("button", { name: /theme/ })).toBeVisible();
  });
});
