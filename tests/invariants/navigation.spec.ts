// Invariants (spec: site-navigation): every Section is reachable from the
// nav in every Language, and the nav stays usable on a phone by keyboard,
// with assistive technology and without JavaScript.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { LANGUAGES } from "../../src/lib/languages";

const PHONE = { width: 360, height: 740 };
const nav = (page: Page) => page.locator("nav.nav");
const menuButton = (page: Page) => nav(page).locator(".menu-toggle");

test("every nav link on every Language's Main page reaches its Section page", async ({
  page,
  request,
}) => {
  for (const lang of LANGUAGES) {
    await page.goto(`/${lang}/`);
    const hrefs = await nav(page)
      .getByRole("link")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
    expect(hrefs).toEqual(
      ["articles", "tele", "balados", "these", "art"].map((s) => `/${lang}/${s}/`),
    );
    for (const href of hrefs) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  }
});

test.describe("on a phone", () => {
  test.use({ viewport: PHONE });

  test("keyboard: the open menu keeps focus, hides the page, and Escape returns focus", async ({
    page,
  }) => {
    await page.goto("/en/");
    const button = menuButton(page);
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // Button, the five links, then back round to the button, both ways.
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    const last = nav(page).getByRole("link", { name: "Art", exact: true });
    await expect(last).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();
    for (const part of ["body > header", "main", "body > footer"]) {
      await expect(page.locator(part)).toHaveJSProperty("inert", true);
    }
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`the open menu has no accessibility violations (${colorScheme})`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: PHONE, colorScheme });
      const page = await context.newPage();
      await page.goto("/fr/");
      await menuButton(page).click();
      await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
      await context.close();
    });
  }
});

test.describe("on a phone without JavaScript", () => {
  test.use({ viewport: PHONE, javaScriptEnabled: false });

  test("no menu button, every nav link visible, nothing scrolls sideways", async ({ page }) => {
    await page.goto("/fr/");
    await expect(menuButton(page)).toBeHidden();
    for (const name of ["Articles", "Télé", "Balados", "Thèse", "Art"]) {
      await expect(nav(page).getByRole("link", { name, exact: true })).toBeVisible();
    }
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(PHONE.width);
  });
});
