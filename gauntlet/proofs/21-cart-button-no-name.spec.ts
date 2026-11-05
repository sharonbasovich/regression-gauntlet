import { expect, test } from "@playwright/test";

test("BUG-21: the header cart button has an accessible name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("cart-button")).toHaveAccessibleName(/cart/i);
});
