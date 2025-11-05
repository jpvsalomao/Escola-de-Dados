import { test, expect } from "@playwright/test";

test.describe("SQL Learn Platform", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SQL Learn/);
    await expect(page.locator("h1")).toContainText("SQL Learn");
  });

  test("should display pack challenges", async ({ page }) => {
    await page.goto("/");
    // Wait for pack to load
    await page.waitForSelector("text=SQL Basics", { timeout: 10000 });
    // Check that challenges are displayed
    await expect(page.locator("text=Select All Customers")).toBeVisible();
  });

  test("should navigate to a challenge", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=Select All Customers", { timeout: 10000 });
    await page.click("text=Select All Customers");
    await expect(page).toHaveURL(/challenges\/pack_basics/);
    await expect(page.locator("h1")).toContainText("Select All Customers");
  });
});
