import { expect, test } from "@playwright/test";
import { addToCart, fillCheckout, money } from "./helpers";

test.describe("Purchase flow", () => {
  test("browse → product → cart → checkout → confirmation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Gear for people who ride every day");

    await page.getByRole("link", { name: "Shop the collection" }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByTestId("catalog-title")).toHaveText("All products");

    await page.getByRole("link", { name: "Ridgeline Insulated Gloves" }).first().click();
    await expect(page.getByTestId("product-title")).toHaveText("Ridgeline Insulated Gloves");
    const unit = money(await page.getByTestId("product-price").locator("span").first().textContent());

    await page.getByRole("radio", { name: "Moss" }).check({ force: true });
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByTestId("add-to-cart").click();

    const dialog = page.getByRole("dialog", { name: "Added to your cart" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("drawer-items")).toContainText("Moss · Qty 2");
    expect(money(await dialog.getByTestId("drawer-subtotal").textContent())).toBe(unit * 2);
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await dialog.getByRole("link", { name: "Checkout" }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await fillCheckout(page);
    await page.getByRole("radio", { name: /express/i }).check();
    const total = money(await page.getByTestId("sum-total").first().textContent());
    await page.getByTestId("place-order").click();

    await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
    await expect(page.getByTestId("order-heading")).toContainText("Thanks, Alex!");
    await expect(page.getByTestId("order-id")).toHaveText(/GS-[A-Z0-9]{5}/);
    expect(money(await page.getByTestId("order-total").textContent())).toBe(total);
    await expect(page.getByTestId("order-eta")).toContainText(/Arrives by \w{3}, \w{3} \d{1,2}/);

    // Cart is emptied after a successful order.
    await expect(page.getByTestId("cart-count")).toHaveCount(0);
    await page.goto("/cart");
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("coupon GAUNTLET10 takes 10% off the subtotal and the charged total", async ({ page }) => {
    await addToCart(page, "courier-18-rolltop-backpack");
    await page.goto("/checkout");
    await expect(page.getByTestId("sum-subtotal").first()).not.toHaveText("$0.00");
    const subtotal = money(await page.getByTestId("sum-subtotal").first().textContent());
    const before = money(await page.getByTestId("sum-total").first().textContent());

    await page.getByRole("textbox", { name: "Promo code" }).fill("gauntlet10");
    await page.getByTestId("apply-coupon").click();
    await expect(page.getByTestId("coupon-message")).toContainText("GAUNTLET10 applied");

    const discount = money(await page.getByTestId("sum-discount").first().textContent());
    expect(discount).toBe(Math.round(subtotal * 0.1));
    const after = money(await page.getByTestId("sum-total").first().textContent());
    // total = (subtotal - discount) * 1.08 + shipping; discount also lowers tax.
    expect(after).toBe(before - discount - Math.round(subtotal * 0.08) + Math.round((subtotal - discount) * 0.08));

    await fillCheckout(page);
    await page.getByTestId("place-order").click();
    await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
    expect(money(await page.getByTestId("order-total").textContent())).toBe(after);
    await expect(page.getByText("Discount (GAUNTLET10)")).toBeVisible();
  });

  test("validation errors are shown and the order can still be placed afterwards", async ({ page }) => {
    await addToCart(page, "beacon-800-front-light");
    await page.goto("/checkout");
    await page.getByTestId("place-order").click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel("Email", { exact: true })).toBeFocused();

    await fillCheckout(page);
    await page.getByTestId("place-order").click();
    await expect(page).toHaveURL(/\/orders\/GS-/, { timeout: 15_000 });
  });

  test("declined card shows an error and keeps the cart", async ({ page }) => {
    await addToCart(page, "beacon-800-front-light");
    await page.goto("/checkout");
    await fillCheckout(page);
    await page.getByLabel("Card number").fill("4000 0000 0000 0002");
    await page.getByTestId("place-order").click();
    await expect(page.getByTestId("checkout-error")).toContainText("declined");
    await expect(page.getByTestId("place-order")).toBeEnabled();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });
});
