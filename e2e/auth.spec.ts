import { test, expect } from "@playwright/test";

test.describe("Admin authentication flow", () => {
  test("redirects to login when accessing /admin without session", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "wrong@test.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("login page has noindex meta tag", async ({ page }) => {
    await page.goto("/admin/login");
    const metaRobots = page.locator('meta[name="robots"]');
    await expect(metaRobots).toHaveAttribute("content", /noindex/i);
  });
});

test.describe("Public pages load correctly", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("properties detail page loads", async ({ page }) => {
    await page.goto("/properties/salt-river-house");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("404 page for non-existent property", async ({ page }) => {
    await page.goto("/properties/nonexistent-property");
    await expect(page.locator("body")).toBeVisible();
  });
});
