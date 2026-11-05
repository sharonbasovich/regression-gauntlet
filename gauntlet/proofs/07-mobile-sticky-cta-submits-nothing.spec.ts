import { expect, test } from "@playwright/test";
import { addToCart, fillCheckout } from "../../tests/helpers";

test("BUG-07: the visible Place order button places an order on mobile", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await fillCheckout(page);
  await page.getByRole("button", { name: /Place order/ }).locator("visible=true").first().click();
  await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
});
