import { expect, test } from "@playwright/test";

test("home page loads and links to the section pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Elena");
  await expect(page.getByRole("link", { name: "Articles" })).toHaveAttribute("href", "/articles");
  await expect(page.getByRole("link", { name: "Videos" })).toHaveAttribute("href", "/videos");
  await expect(page.getByRole("link", { name: "Photos" })).toHaveAttribute("href", "/photos");
  await expect(page.getByRole("link", { name: "Podcast" })).toHaveAttribute("href", "/podcast");
});
