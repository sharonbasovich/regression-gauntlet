import { expect, test } from "@playwright/test";
import { addToCart } from "../../tests/helpers";

test("BUG-03: header badge updates when a line is removed from the cart", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/cart");
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.getByRole("button", { name: /^Remove / }).click();
  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveCount(0);
});
