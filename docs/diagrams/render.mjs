import { chromium } from "file:///C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

async function capture(name) {
  const page = await browser.newPage({
    deviceScaleFactor: 2,
    viewport: { width: 1600, height: 2400 },
  });
  const file = path.join(dir, `${name}.html`).replaceAll("\\", "/");
  await page.goto(`file://${file}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#capture");
  await page.locator("#capture").screenshot({
    path: path.join(dir, `${name}.png`),
    type: "png",
  });
  await page.close();
}

await capture("architecture");
await capture("ask-workflow");
await browser.close();
console.log("Wrote architecture.png and ask-workflow.png");
