// Spec: main-page.
import { expect, test } from "@playwright/test";

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

test("the Section nav lands on each part of the Main page, named in the page's Language", async ({
  page,
}) => {
  await page.goto("/it/");
  const nav = page.getByRole("navigation", { name: "Sezioni" });
  const expected = [
    ["Articoli", "articles"],
    ["TV", "tele"],
    ["Podcast", "balados"],
    ["Tesi", "these"],
    ["Arte", "art"],
  ];
  await expect(nav.getByRole("link")).toHaveText(expected.map(([name]) => name));
  for (const [name, id] of expected) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`).getByRole("heading", { level: 2 }).first()).toHaveText(
      name,
    );
  }
});

test("portrait without a photo shows heading, bio and byline, and no image", async ({ page }) => {
  await page.goto("/fr/");
  await expect(
    page.getByRole("heading", { name: "Journaliste multiplateforme à Radio-Canada, à Toronto" }),
  ).toBeVisible();
  await expect(page.getByText(/^À Radio-Canada depuis 2024\./)).toBeVisible();
  await expect(page.getByText("Par Elena Meyer · Toronto")).toBeVisible();
  await expect(page.locator("main img")).toHaveCount(0);
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

test("Thèse is shown in full, in English", async ({ page }) => {
  await page.goto("/en/#these");
  const these = page.locator("#these");
  await expect(these.locator("blockquote")).toHaveText(
    "How can we tell a community's story with it, rather than about it?",
  );
  await expect(these.locator("dt")).toHaveText(["Field", "Framework", "Deliverable", "Defence"]);
  await expect(these.locator("dd").last()).toHaveText("Planned for 2027");
});

test("a Section without content says 'coming soon' in the page's Language", async ({ page }) => {
  await page.goto("/it/");
  const tele = page.locator("#tele");
  await expect(tele.getByRole("heading", { level: 2 })).toHaveText("TV");
  await expect(tele.getByText("In arrivo.")).toBeVisible();
  await expect(tele.getByRole("list")).toHaveCount(0);
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
