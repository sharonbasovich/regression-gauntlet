import { expect, test } from "@playwright/test";

test("BUG-09: the header fits the viewport on small screens", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
  const cart = await page.getByTestId("cart-button").boundingBox();
  const width = page.viewportSize()!.width;
  expect(cart!.x + cart!.width).toBeLessThanOrEqual(width);
});
