import { chromium } from "playwright";
import * as path from "path";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const outDir = path.join(process.cwd(), "screenshots", "verify");
  fs.mkdirSync(outDir, { recursive: true });

  for (const theme of ["light", "dark"] as const) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.addInitScript((dark) => {
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }, theme === "dark");

    await page.goto("http://localhost:3000/locations", {
      waitUntil: "networkidle",
    });
    await page.waitForSelector(".leaflet-tile-loaded");
    await page.waitForTimeout(1000);

    const marker = page.locator(".leaflet-marker-icon").first();
    const box = await marker.boundingBox();
    if (!box) throw new Error("no marker bbox");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1200);

    const popupOpen = await page.locator(".leaflet-popup").count();
    console.log("[" + theme + "] leaflet-popup count:", popupOpen);

    const sample = (await page.evaluate(`(function () {
      var get = function (el, prop) {
        return el ? getComputedStyle(el).getPropertyValue(prop).trim() : '(missing)';
      };
      var wrap = document.querySelector('.leaflet-popup-content-wrapper');
      var tip = document.querySelector('.leaflet-popup-tip');
      var h3 = document.querySelector('.leaflet-popup-content h3');
      var link = document.querySelector('.leaflet-popup-content a');
      var price = document.querySelector('.leaflet-popup-content p');
      return {
        wrapBg: get(wrap, 'background-color'),
        wrapColor: get(wrap, 'color'),
        tipBg: get(tip, 'background-color'),
        h3Color: get(h3, 'color'),
        priceColor: get(price, 'color'),
        linkColor: get(link, 'color'),
        htmlDark: document.documentElement.classList.contains('dark')
      };
    })()`)) as Record<string, string>;
    console.log("[" + theme + "]", JSON.stringify(sample, null, 2));

    const file = path.join(outDir, "popup-" + theme + ".png");
    await page.screenshot({ path: file, fullPage: false });
    console.log("[" + theme + "] saved " + file);

    await context.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
