import { expect, test } from "@playwright/test";
import { addToCart, fillCheckout } from "../../tests/helpers";

test("BUG-14: an order still goes through when the checkout API is slow (~2.8 s extra)", async ({ page }) => {
  await page.route("**/api/checkout", async (route) => {
    await new Promise((r) => setTimeout(r, 2_800));
    await route.continue();
  });
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await fillCheckout(page);
  await page.getByTestId("place-order").click();
  await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 20_000 });
});
