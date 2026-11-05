import { expect, test } from "@playwright/test";
import { addToCart } from "../../tests/helpers";

test("BUG-13: removing one colour keeps the other colour in the cart", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/products/ridgeline-insulated-gloves");
  await page.getByText("Moss", { exact: true }).click();
  await page.getByTestId("add-to-cart").click();
  const dialog = page.getByRole("dialog", { name: "Added to your cart" });
  await dialog.getByRole("button", { name: "Continue shopping" }).click();
  await page.goto("/cart");
  await expect(page.getByTestId("cart-line")).toHaveCount(2);
  await page.getByRole("button", { name: /^Remove / }).first().click();
  await expect(page.getByTestId("cart-line")).toHaveCount(1);
  await expect(page.getByTestId("cart-count")).toHaveText("1");
});
