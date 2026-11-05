import { expect, test } from "@playwright/test";
import { addToCart, money } from "./helpers";

test.describe("Cart", () => {
  test("badge, quantities, removal and persistence across reload", async ({ page }) => {
    await addToCart(page, "merino-cycling-cap");
    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await addToCart(page, "insulated-bottle-620");
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.goto("/cart");
    const lines = page.getByTestId("cart-line");
    await expect(lines).toHaveCount(2);

    await page.getByRole("button", { name: "Increase quantity of Merino Cycling Cap" }).click();
    await expect(lines.nth(0).getByTestId("line-qty")).toHaveText("2");
    expect(money(await lines.nth(0).getByTestId("line-total").textContent())).toBe(2800 * 2);
    await expect(page.getByTestId("cart-count")).toHaveText("3");

    const subtotal = money(await page.getByTestId("cart-subtotal").textContent());
    expect(subtotal).toBe(2800 * 2 + 1900);

    await page.reload();
    await expect(page.getByTestId("cart-line")).toHaveCount(2);
    await expect(page.getByTestId("cart-count")).toHaveText("3");

    await page.getByRole("button", { name: "Remove Merino Cycling Cap from cart" }).click();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-line").first()).toContainText("Insulated Bottle 620");
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });

  test("cart drawer opens from the header and closes with Escape, returning focus", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("cart-button").click();
    const dialog = page.getByRole("dialog", { name: "Your cart" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Your cart is empty.")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("cart-button")).toBeFocused();
  });

  test("sold-out products cannot be added", async ({ page }) => {
    await page.goto("/products/ember-thermal-jersey");
    await expect(page.getByTestId("add-to-cart")).toBeDisabled();
    await expect(page.getByTestId("add-to-cart")).toHaveText("Sold out");
  });
});
