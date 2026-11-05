import { expect, test } from "@playwright/test";
import { money } from "../../tests/helpers";

test("BUG-04: 'price: low to high' sorts ascending", async ({ page }) => {
  await page.goto("/products?sort=price-asc");
  const prices = (await page.locator("[data-testid=card-price] > span:first-child").allTextContents()).map(money);
  expect(prices.length).toBeGreaterThan(5);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});
