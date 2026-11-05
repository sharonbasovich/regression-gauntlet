import { expect, test } from "@playwright/test";
import { addToCart, money } from "../../tests/helpers";

test("BUG-02: the order total reflects the coupon discount", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves");
  await page.goto("/checkout");
  await page.getByRole("textbox", { name: "Promo code" }).fill("GAUNTLET10");
  await page.getByTestId("apply-coupon").click();
  await expect(page.getByTestId("coupon-message")).toContainText("applied");
  const read = async (id: string) => money(await page.getByTestId(id).first().textContent());
  const subtotal = await read("sum-subtotal");
  const discount = await read("sum-discount");
  const shippingText = await page.getByTestId("sum-shipping").first().textContent();
  const shipping = /free/i.test(shippingText ?? "") ? 0 : money(shippingText);
  const tax = await read("sum-tax");
  const total = await read("sum-total");
  expect(discount).toBe(Math.round(subtotal * 0.1));
  expect(total).toBe(subtotal - discount + shipping + tax);
});
