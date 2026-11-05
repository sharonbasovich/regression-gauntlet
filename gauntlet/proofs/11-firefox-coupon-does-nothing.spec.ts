import { expect, test } from "@playwright/test";
import { addToCart } from "../../tests/helpers";

test("BUG-11: applying a promo code works in Firefox", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await page.getByRole("textbox", { name: "Promo code" }).fill("GAUNTLET10");
  await page.getByTestId("apply-coupon").click();
  await expect(page.getByTestId("coupon-message")).toContainText("GAUNTLET10 applied");
  await expect(page.getByTestId("sum-discount").last()).toBeVisible();
});
