import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const THEMES = [
  { name: "light", colorScheme: "light" as const },
  { name: "dark", colorScheme: "dark" as const },
];

const ROUTES = [
  { path: "/", filename: "home.png" },
  { path: "/locations", filename: "locations.png", waitForMap: true },
  { path: "/our-story", filename: "our-story.png" },
  { path: "/landlords", filename: "landlords.png" },
  { path: "/contact", filename: "contact.png" },
  { path: "/properties/salt-river-house", filename: "property-detail.png" },
];

async function main() {
  // Create output directories (per theme × viewport)
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      fs.mkdirSync(path.join(SCREENSHOTS_DIR, theme.name, vp.name), {
        recursive: true,
      });
    }
  }

  const browser = await chromium.launch({ headless: true });

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        colorScheme: theme.colorScheme,
      });
      const page = await context.newPage();

      // Hide Next.js dev overlay + apply theme class BEFORE navigation
      const isDark = theme.name === "dark";
      await page.addInitScript((dark) => {
        // Apply theme class immediately to avoid FOUC
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        try {
          localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {}
        const css =
          "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast]{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;}";
        const s = document.createElement("style");
        s.textContent = css;
        document.head.appendChild(s);
      }, isDark);

      // Cleanup helper: dev portal can render after mount — nuke it again
      const removeDevPortal = async () => {
        await page.evaluate(() => {
          document
            .querySelectorAll(
              "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast]",
            )
            .forEach((el) => (el as HTMLElement).remove());
        });
      };

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        console.log(`Capturing ${vp.name} → ${route.path}`);
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await removeDevPortal();

        if (route.waitForMap) {
          try {
            await page.waitForSelector(".leaflet-tile-loaded", {
              timeout: 10000,
            });
            await page.waitForTimeout(500);
          } catch (e) {
            console.warn(
              `Map tiles not loaded for ${route.path}, continuing...`,
            );
          }
        }

        const outPath = path.join(
          SCREENSHOTS_DIR,
          theme.name,
          vp.name,
          route.filename,
        );
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  ✓ Saved ${outPath}`);
      }

      // Bonus: Mobile menu open state
      if (vp.name === "mobile") {
        console.log(`Capturing ${theme.name}/mobile → navbar-open`);
        await page.goto(`${BASE_URL}/`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        // Wait for the menu button to be hydrated and clickable
        await page.waitForTimeout(1500);
        const openBtn = page.locator('header button[aria-label="Open menu"]');
        if ((await openBtn.count()) > 0) {
          await openBtn.click({ force: true });
          await page.waitForTimeout(800); // wait for animation
          await removeDevPortal();
          const outPath = path.join(
            SCREENSHOTS_DIR,
            theme.name,
            "mobile",
            "navbar-open.png",
          );
          // Use viewport-only capture (not fullPage) so the fullscreen drawer reads correctly
          await page.screenshot({ path: outPath, fullPage: false });
          console.log(`  ✓ Saved ${outPath}`);
        } else {
          console.warn(
            "Mobile menu button not found, skipping navbar-open screenshot",
          );
        }
      }

      await context.close();
    } // end viewports
  } // end themes

  // ============================================================
  // HOVER STATE PASS — capture interactive elements under :hover
  //   Covers: primary CTA, secondary CTA, nav link (active+inactive),
  //   theme toggle, "View All" carousel link, property card, form input.
  //   Themes: light + dark. Viewports: desktop + mobile.
  // ============================================================
  const HOVER_TARGETS: Array<{
    label: string;
    route: string;
    selector: string;
    /** Element-kind hint for the audit. */
    kind:
      | "primary-button"
      | "secondary-button"
      | "nav-link"
      | "theme-toggle"
      | "link-arrow"
      | "card"
      | "input";
    /** When true, capture the focused element too (form inputs). */
    focus?: boolean;
    /** When true, run on mobile. Default true; set false for inputs/cards. */
    mobile?: boolean;
  }> = [
    {
      label: "btn-primary-hover",
      route: "/",
      selector: 'a[href="/locations"]',
      kind: "primary-button",
    },
    {
      label: "btn-secondary-hover",
      route: "/",
      selector: 'main a[href="/contact"]',
      kind: "secondary-button",
    },
    {
      label: "nav-inactive-hover",
      route: "/",
      selector: 'header nav ul.lg\\:flex a[href="/our-story"]',
      kind: "nav-link",
      mobile: false,
    },
    {
      label: "nav-active-hover",
      route: "/locations",
      selector: 'header nav ul.lg\\:flex a[href="/locations"]',
      kind: "nav-link",
      mobile: false,
    },
    {
      label: "theme-toggle-hover",
      route: "/",
      selector: 'header button[aria-label*="Switch to"]',
      kind: "theme-toggle",
      mobile: false,
    },
    {
      label: "view-all-link-hover",
      route: "/",
      selector: 'a[href="/locations"]:has-text("View All")',
      kind: "link-arrow",
    },
    {
      label: "property-card-hover",
      route: "/",
      selector: 'a[href^="/properties/"]',
      kind: "card",
    },
    {
      label: "input-focus",
      route: "/contact",
      selector: 'input[type="email"]',
      kind: "input",
      focus: true,
      mobile: false,
    },
  ];

  for (const theme of THEMES) {
    for (const vp of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 375, height: 812 },
    ]) {
      const dir = path.join(SCREENSHOTS_DIR, theme.name, vp.name, "hover");
      fs.mkdirSync(dir, { recursive: true });

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
          "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast]{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;}";
        const s = document.createElement("style");
        s.textContent = css;
        document.head.appendChild(s);
      }, isDark);
      const removeDevPortal = async () => {
        await page.evaluate(() => {
          document
            .querySelectorAll(
              "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay],[data-nextjs-toast-wrapper],[data-nextjs-build-error-toast]",
            )
            .forEach((el) => (el as HTMLElement).remove());
        });
      };

      for (const target of HOVER_TARGETS) {
        // Skip when explicitly disabled for this viewport
        if (vp.name === "mobile" && target.mobile === false) continue;

        console.log(`Hover: ${theme.name}/${vp.name} → ${target.label}`);
        await page.goto(`${BASE_URL}${target.route}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        // Wait for hydration of client components (Navbar uses useEffect for scroll/theme)
        await page.waitForTimeout(1500);
        await removeDevPortal();

        const loc = page
          .locator(target.selector)
          .locator("visible=true")
          .first();
        if ((await loc.count()) === 0) {
          console.warn(`  ! Selector not found: ${target.selector}`);
          continue;
        }

        // Robust scroll: use JS scrollIntoView to bypass Playwright's stability check
        await loc.evaluate((el: HTMLElement) => {
          el.scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "instant" as ScrollBehavior,
          });
        });
        await page.waitForTimeout(300);
        await page.waitForTimeout(300);

        if (target.focus) {
          await loc.focus();
        } else {
          await loc.hover({ force: true });
        }
        await page.waitForTimeout(450); // let CSS transitions settle
        await removeDevPortal();

        const outPath = path.join(dir, `${target.label}.png`);
        await page.screenshot({ path: outPath, fullPage: false });
        console.log(`  ✓ ${outPath}`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log("\nDone! All screenshots saved to ./screenshots/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
