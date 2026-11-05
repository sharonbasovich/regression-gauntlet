import { expect, test } from "@playwright/test";

test("BUG-24: product-card prices are never clipped", async ({ page }) => {
  await page.goto("/products");
  const clipped = await page.locator("[data-testid=card-price]").evaluateAll((els) =>
    els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
  );
  expect(clipped).toEqual([]);
});
