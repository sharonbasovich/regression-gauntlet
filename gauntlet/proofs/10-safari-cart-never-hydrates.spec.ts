import { expect, test } from "@playwright/test";
import { addToCart } from "../../tests/helpers";

test("BUG-10: the cart hydrates and persists in WebKit", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.reload();
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.goto("/checkout");
  await expect(page.getByTestId("place-order")).toBeEnabled();
});
