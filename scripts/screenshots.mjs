import { chromium } from "@playwright/test";
const b = await chromium.launch();
for (const [name, w, h] of [["desktop-1440",1440,900],["tablet-834",834,1112],["mobile-390",390,844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.screenshot({ path: `docs/screenshots/home-${name}.png`, fullPage: false });
  await p.goto("http://localhost:3000/products/ridgeline-insulated-gloves", { waitUntil: "networkidle" });
  await p.getByTestId("add-to-cart").click();
  await p.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `docs/screenshots/checkout-${name}.png`, fullPage: false });
  await ctx.close();
}
await b.close();
