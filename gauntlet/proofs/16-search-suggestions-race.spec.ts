import { expect, test } from "@playwright/test";

test("BUG-16: suggestions match what was typed last even when an earlier response arrives late", async ({ page }) => {
  await page.route("**/api/products?*", async (route) => {
    if (/q=light/.test(route.request().url())) await new Promise((r) => setTimeout(r, 1_500));
    await route.continue();
  });
  await page.goto("/");
  const input = page.getByTestId("search-input").locator("visible=true").first();
  await input.fill("light");
  await page.waitForTimeout(400);
  await input.fill("bag");
  await page.waitForTimeout(2_500);
  const names = await page.getByTestId("search-suggestions").locator("visible=true").first().getByRole("link").allTextContents();
  expect(names.length).toBeGreaterThan(0);
  for (const n of names) expect(n).not.toMatch(/light/i);
});
