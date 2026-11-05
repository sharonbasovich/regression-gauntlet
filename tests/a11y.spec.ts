import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { addToCart, login } from "./helpers";

const PAGES = ["/", "/products", "/products?category=gloves&q=glove", "/products/ridgeline-insulated-gloves", "/cart", "/login", "/signup", "/about", "/help"];

async function audit(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);
}

test.describe("Accessibility (axe-core)", () => {
  for (const path of PAGES) {
    test(`no serious violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      await audit(page);
    });
  }

  test("no serious violations on checkout with items and the cart drawer open", async ({ page }) => {
    await addToCart(page, "courier-18-rolltop-backpack", { closeDrawer: false });
    await audit(page);
    await page.keyboard.press("Escape");
    await page.goto("/checkout");
    await expect(page.getByTestId("checkout-form")).toBeVisible();
    await audit(page);
  });

  test("no serious violations on the account page", async ({ page }) => {
    await login(page);
    await audit(page);
  });

  test("cart drawer traps focus and the close button is reachable", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("cart-button").click();
    const dialog = page.getByRole("dialog", { name: "Your cart" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"));
      expect(inside).toBe(true);
    }
  });
});
