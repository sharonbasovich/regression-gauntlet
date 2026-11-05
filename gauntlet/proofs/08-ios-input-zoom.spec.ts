import { expect, test } from "@playwright/test";

test("BUG-08: text inputs are at least 16px on mobile (prevents iOS focus zoom)", async ({ page }) => {
  await page.goto("/login");
  const size = await page.getByLabel("Email", { exact: true }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});
