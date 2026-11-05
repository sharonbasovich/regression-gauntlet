import { expect, test } from "@playwright/test";

test("BUG-23: Escape closes the cart drawer opened from the header", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cart-button").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
