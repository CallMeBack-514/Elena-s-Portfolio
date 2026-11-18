// Spec: site-navigation.
import { expect, test, type Page } from "@playwright/test";

const PHONE = { width: 360, height: 740 };
const nav = (page: Page) => page.locator("nav.nav");
const menuButton = (page: Page) => nav(page).locator(".menu-toggle");

test("the nav links to the Section pages, in order, with the accent colour", async ({ page }) => {
  await page.goto("/fr/");
  const links = nav(page).getByRole("link");
  await expect(links).toHaveText(["Articles", "Télé", "Balados", "Thèse", "Art"]);
  const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  expect(hrefs).toEqual(["/fr/articles/", "/fr/tele/", "/fr/balados/", "/fr/these/", "/fr/art/"]);
});

test("on an Outlet filter page, only the Articles link is marked current", async ({ page }) => {
  await page.goto("/fr/articles/le-devoir/");
  const current = nav(page).locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText("Articles");
});

test("the Main page marks no Section as current", async ({ page }) => {
  await page.goto("/en/");
  await expect(nav(page).locator("[aria-current]")).toHaveCount(0);
});

test("the masthead name links to the Main page, and is not a heading there", async ({ page }) => {
  await page.goto("/en/these/");
  const home = page.locator(".mast").getByRole("link", { name: "Elena Meyer" });
  await expect(page.locator(".mast h1")).toHaveCount(0);
  await home.click();
  await expect(page).toHaveURL("/en/");
});

test.describe("on a phone", () => {
  test.use({ viewport: PHONE });

  test("the menu button opens a full-screen menu and reports it is expanded", async ({ page }) => {
    await page.goto("/fr/");
    const button = menuButton(page);
    await expect(nav(page).getByRole("link", { name: "Articles" })).toBeHidden();
    await expect(button).toHaveAccessibleName("Ouvrir le menu");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(button).toHaveAccessibleName("Fermer le menu");
    for (const name of ["Articles", "Télé", "Balados", "Thèse", "Art"]) {
      await expect(nav(page).getByRole("link", { name, exact: true })).toBeVisible();
    }
    const box = await nav(page).boundingBox();
    expect(box).toMatchObject({ x: 0, y: 0, width: PHONE.width, height: PHONE.height });
  });

  // The keyboard journey is an invariant: tests/invariants/navigation.spec.ts.

  test("following a link closes the menu", async ({ page }) => {
    await page.goto("/it/");
    await menuButton(page).click();
    await nav(page).getByRole("link", { name: "Tesi" }).click();
    await expect(page).toHaveURL("/it/these/");
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
  });

  test("growing the window past 820 px closes the menu", async ({ page }) => {
    await page.goto("/en/");
    await menuButton(page).click();
    await page.setViewportSize({ width: 1024, height: 740 });
    await expect(page.locator("html")).toHaveAttribute("data-menu", "closed");
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
    await expect(menuButton(page)).toBeHidden();
  });
});

// The no-JavaScript nav on a phone is an invariant: tests/invariants/navigation.spec.ts.
