import { expect, test } from "@playwright/test";
import { isMobile } from "./helpers";

test.describe("Navigation", () => {
  test("mobile menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    test.skip(!isMobile(page), "hamburger menu only exists below 768px");

    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    const toggle = page.getByTestId("menu-toggle");
    await expect(toggle).toBeVisible();
    await toggle.click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();

    await toggle.click();
    await menu.getByRole("link", { name: "Bags" }).click();
    await expect(page).toHaveURL(/category=bags/);
    await expect(page.getByTestId("mobile-menu")).toBeHidden();
    await expect(page.getByTestId("catalog-title")).toHaveText("Bags");
  });

  test("desktop navigation links are visible and work", async ({ page }) => {
    await page.goto("/");
    test.skip(isMobile(page), "primary nav is hidden below 768px");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Lights" }).click();
    await expect(page.getByTestId("catalog-title")).toHaveText("Lights");
  });

  test("header never overflows the viewport", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
    const logo = page.getByRole("link", { name: "Gauntlet Shop home" });
    const cart = page.getByTestId("cart-button");
    const a = await logo.boundingBox();
    const b = await cart.boundingBox();
    expect(a && b && a.x + a.width <= b.x).toBeTruthy();
  });
});
