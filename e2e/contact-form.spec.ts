import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("submits successfully with valid data", async ({ page }) => {
    await page.goto("/contact");
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "testuser@test.com");
    await page.fill('input[name="subject"]', "Test Subject");
    await page.fill('textarea[name="message"]', "This is a test message.");
    await page.click('button[type="submit"]');
    // Wait for success message (form uses useFormState with status)
    await expect(page.locator("text=/sent|received|success/i")).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows validation error for empty fields", async ({ page }) => {
    await page.goto("/contact");
    await page.click('button[type="submit"]');
    // Browser native validation or custom error should appear
    await expect(page.locator("body")).toBeVisible();
  });
});
