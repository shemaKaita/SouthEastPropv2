import "dotenv/config";
import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots", "admin-audit");

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const THEMES = [
  { name: "light", colorScheme: "light" as const },
  { name: "dark", colorScheme: "dark" as const },
];

async function getFirstPropertyId(): Promise<string | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });
  const property = await prisma.property.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  await prisma.$disconnect();
  return property?.id ?? null;
}

const ADMIN_ROUTES: Array<{
  path: string;
  filename: string;
  requiresAuth?: boolean;
}> = [
  { path: "/admin/login", filename: "01-login.png" },
  { path: "/admin", filename: "02-dashboard.png", requiresAuth: true },
  { path: "/admin/properties", filename: "03-properties-list.png", requiresAuth: true },
  { path: "/admin/properties/new", filename: "04-property-new.png", requiresAuth: true },
  { path: "/admin/submissions/contact", filename: "06-submissions-contact.png", requiresAuth: true },
  { path: "/admin/submissions/landlord", filename: "07-submissions-landlord.png", requiresAuth: true },
  { path: "/admin/settings", filename: "08-settings.png", requiresAuth: true },
];

async function login(page: any) {
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "admin@southeastproperties.co.za");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  // Wait for redirect to dashboard
  await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  // Allow data to load
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

async function main() {
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      fs.mkdirSync(path.join(SCREENSHOTS_DIR, theme.name, vp.name), {
        recursive: true,
      });
    }
  }

  const browser = await chromium.launch({ headless: true });

  // Inject the dynamic property edit route
  const propertyId = await getFirstPropertyId();
  const propertyEditPath = propertyId
    ? `/admin/properties/${propertyId}/edit`
    : null;
  const propertyEditFilename = "05-property-edit.png";
  if (!propertyEditPath) {
    console.warn(
      "No property found in DB; skipping property-edit screenshots.",
    );
  }
  const allRoutes = propertyEditPath
    ? [
        ...ADMIN_ROUTES.slice(0, 4),
        {
          path: propertyEditPath,
          filename: propertyEditFilename,
          requiresAuth: true,
        },
        ...ADMIN_ROUTES.slice(4),
      ]
    : ADMIN_ROUTES;

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        colorScheme: theme.colorScheme,
      });
      const page = await context.newPage();

      const isDark = theme.name === "dark";
      await page.addInitScript((dark) => {
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        try {
          localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {}
        const css =
          "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast],[data-nextjs-dev-tools-panel],[data-nextjs-dev-tools],[data-nextjs-dev-tools-button],nextjs-portal *{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;width:0!important;height:0!important;}";
        const s = document.createElement("style");
        s.textContent = css;
        document.head.appendChild(s);
        const mo = new MutationObserver(() => {
          document
            .querySelectorAll(
              "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast],[data-nextjs-dev-tools-panel],[data-nextjs-dev-tools],[data-nextjs-dev-tools-button]",
            )
            .forEach((el) => el.remove());
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
      }, isDark);

      let loggedIn = false;

      for (const route of allRoutes) {
        if (route.requiresAuth && !loggedIn) {
          console.log(`Logging in for ${theme.name}/${vp.name}...`);
          try {
            await login(page);
            loggedIn = true;
          } catch (err) {
            console.error("Login failed:", err);
            break;
          }
        }

        const url = `${BASE_URL}${route.path}`;
        console.log(`Capturing ${vp.name} → ${route.path}`);
        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
          await removeDevPortal(page);
          await page.waitForTimeout(500);

          const outPath = path.join(
            SCREENSHOTS_DIR,
            theme.name,
            vp.name,
            route.filename,
          );
          await page.screenshot({ path: outPath, fullPage: true });
          console.log(`  ✓ Saved ${outPath}`);
        } catch (err) {
          console.error(`Failed to capture ${route.path}:`, err);
        }
      }

      // Bonus: Mobile sidebar open
      if (vp.name === "mobile" && loggedIn) {
        console.log(`Capturing ${theme.name}/mobile → sidebar-open`);
        try {
          await page.goto(`${BASE_URL}/admin`, {
            waitUntil: "networkidle",
            timeout: 30000,
          });
          await page.waitForTimeout(500);
          const toggleBtn = page.getByRole("button", {
            name: "Open admin menu",
          });
          if ((await toggleBtn.count()) > 0) {
            await toggleBtn.click({ force: true });
            await page.waitForTimeout(500);
            await removeDevPortal(page);
            const outPath = path.join(
              SCREENSHOTS_DIR,
              theme.name,
              "mobile",
              "sidebar-open.png",
            );
            await page.screenshot({ path: outPath, fullPage: false });
            console.log(`  ✓ Saved ${outPath}`);
          }
        } catch (err) {
          console.error("Sidebar open capture failed:", err);
        }
      }

      await context.close();
    }
  }

  await browser.close();
  console.log("\n✅ Admin audit screenshots complete.");
  console.log(`Output: ${SCREENSHOTS_DIR}`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});