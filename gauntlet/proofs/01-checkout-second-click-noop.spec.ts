import { expect, test } from "@playwright/test";
import { addToCart, fillCheckout } from "../../tests/helpers";

test("BUG-01: checkout can still be submitted after a validation error", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await page.getByTestId("place-order").click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await fillCheckout(page);
  await page.getByTestId("place-order").click();
  await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
});
