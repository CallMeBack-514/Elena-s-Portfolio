// Spec: site-theme.
import { expect, test, type Page } from "@playwright/test";

const bg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const DARK_BG = "rgb(18, 18, 18)";
const LIGHT_BG = "rgb(255, 255, 255)";

test.describe("on a dark device", () => {
  test.use({ colorScheme: "dark" });

  test("follows the device by default", async ({ page }) => {
    await page.goto("/en/");
    expect(await bg(page)).toBe(DARK_BG);
  });

  test("the toggle switches to light and the choice persists across pages", async ({ page }) => {
    await page.goto("/en/");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    expect(await bg(page)).toBe(LIGHT_BG);
    await page.goto("/fr/");
    expect(await bg(page)).toBe(LIGHT_BG);
    await expect(page.getByRole("button", { name: "Passer au thème sombre" })).toBeVisible();
  });

  test("a saved choice applies before the first stylesheet, so nothing flashes", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
      const seen: (string | undefined)[] = [];
      (window as unknown as { themeAtFirstStyle: typeof seen }).themeAtFirstStyle = seen;
      new MutationObserver((records, observer) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            const isStyle =
              node instanceof HTMLStyleElement ||
              (node instanceof HTMLLinkElement && node.rel === "stylesheet");
            if (isStyle) {
              seen.push(document.documentElement.dataset.theme);
              observer.disconnect();
              return;
            }
          }
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page.goto("/en/");
    const seen = await page.evaluate(
      () => (window as unknown as { themeAtFirstStyle: string[] }).themeAtFirstStyle,
    );
    expect(seen).toEqual(["light"]);
  });
});

test.describe("on a light device", () => {
  test.use({ colorScheme: "light" });

  test("follows the device by default", async ({ page }) => {
    await page.goto("/en/");
    expect(await bg(page)).toBe(LIGHT_BG);
  });

  test("the toggle's name says, in the page's Language, which theme it switches to", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await expect(page.getByRole("button", { name: "Passer au thème sombre" })).toBeVisible();
  });

  test("still switches when the device refuses storage, with no script error", async ({ page }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => errors.push(error));
    await page.addInitScript(() => {
      const refuse = () => {
        throw new DOMException("blocked", "SecurityError");
      };
      Storage.prototype.getItem = refuse;
      Storage.prototype.setItem = refuse;
    });
    await page.goto("/en/");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    expect(await bg(page)).toBe(DARK_BG);
    expect(errors).toEqual([]);
  });
});

test.describe("on a dark device whose storage can be read but not written", () => {
  test.use({ colorScheme: "dark" });

  // Issue #15: a stale saved choice must not outlive a failed save.
  test("a failed save clears the old choice, so the next page follows the device", async ({
    page,
  }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => errors.push(error));
    await page.addInitScript(() => {
      // Seed the old choice once, then make every later save fail.
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("theme", "light");
        sessionStorage.setItem("seeded", "1");
      }
      Storage.prototype.setItem = () => {
        throw new DOMException("full", "QuotaExceededError");
      };
    });
    await page.goto("/en/");
    expect(await bg(page)).toBe(LIGHT_BG);
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    expect(await bg(page)).toBe(DARK_BG);
    await page.goto("/en/these/");
    expect(await bg(page)).toBe(DARK_BG);
    expect(errors).toEqual([]);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the toggle is not shown", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator(".theme-toggle")).toBeHidden();
  });
});
