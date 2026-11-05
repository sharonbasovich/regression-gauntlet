import { expect, test } from "@playwright/test";
import { addToCart, fillCheckout } from "../../tests/helpers";

test("BUG-28: a successful payment lands on a confirmation that shows the order", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await fillCheckout(page);
  await page.getByTestId("place-order").click();
  await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
  await expect(page.getByTestId("order-heading")).toBeVisible();
  await expect(page.getByTestId("order-id")).toContainText(/GS-/);
  await expect(page.getByText("We couldn't find that order")).toHaveCount(0);
});
