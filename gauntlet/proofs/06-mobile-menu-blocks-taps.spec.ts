import { expect, test } from "@playwright/test";

test("BUG-06: Add to cart is tappable on a phone-width viewport", async ({ page }) => {
  await page.goto("/products/ridgeline-insulated-gloves");
  await page.getByTestId("add-to-cart").click({ timeout: 10_000 });
  await expect(page.getByRole("dialog", { name: "Added to your cart" })).toBeVisible();
});
