import { expect, test } from "@playwright/test";
import { addToCart, DEMO, login } from "../../tests/helpers";

test("BUG-05: the guest cart survives logging in", async ({ page }) => {
  await addToCart(page, "transit-musette");
  await login(page, DEMO.email, DEMO.password, "/checkout");
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await expect(page.getByTestId("checkout-empty")).toHaveCount(0);
});
