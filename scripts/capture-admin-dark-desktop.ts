import { chromium } from "playwright";
import * as path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots", "admin-audit");

const ROUTES = [
  { path: "/admin/login", filename: "01-login.png" },
  { path: "/admin", filename: "02-dashboard.png", requiresAuth: true },
  { path: "/admin/properties", filename: "03-properties-list.png", requiresAuth: true },
  { path: "/admin/properties/new", filename: "04-property-new.png", requiresAuth: true },
  {
    path: "/admin/properties/cmtdkfo4l00003e2gpkug1ihy/edit",
    filename: "05-property-edit.png",
    requiresAuth: true,
  },
  { path: "/admin/submissions/contact", filename: "06-submissions-contact.png", requiresAuth: true },
  { path: "/admin/submissions/landlord", filename: "07-submissions-landlord.png", requiresAuth: true },
  { path: "/admin/settings", filename: "08-settings.png", requiresAuth: true },
];

async function login(page: any) {
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "admin@southeastproperties.co.za");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
  await page.waitForTimeout(800);
}

async function removeDevPortal(page: any) {
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast],[data-nextjs-dev-tools-panel],[data-nextjs-dev-tools],[data-nextjs-dev-tools-button]",
      )
      .forEach((el) => (el as HTMLElement).remove());
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  // Force dark theme via init script
  await page.addInitScript(() => {
    document.documentElement.classList.add("dark");
    try {
      localStorage.setItem("theme", "dark");
    } catch {}
    const css =
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast],[data-nextjs-dev-tools-panel],[data-nextjs-dev-tools],[data-nextjs-dev-tools-button],nextjs-portal *{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;width:0!important;height:0!important;}";
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  });

  let loggedIn = false;

  for (const route of ROUTES) {
    if (route.requiresAuth && !loggedIn) {
      console.log("Logging in...");
      try {
        await login(page);
        loggedIn = true;
      } catch (err) {
        console.error("Login failed:", err);
        break;
      }
    }

    const url = `${BASE_URL}${route.path}`;
    console.log(`Capturing → ${route.path}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await removeDevPortal(page);
      await page.waitForTimeout(500);

      const outPath = path.join(
        SCREENSHOTS_DIR,
        "dark",
        "desktop",
        route.filename,
      );
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`  ✓ Saved ${outPath}`);
    } catch (err) {
      console.error(`Failed to capture ${route.path}:`, err);
    }
  }

  await context.close();
  await browser.close();
}

(async () => {
  try {
    await run();
  } catch (err) {
    console.error("Script failed:", err);
    process.exit(1);
  }
})();