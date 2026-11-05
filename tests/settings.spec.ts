import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test.describe("Account settings (state-asserting)", () => {
  test("saved settings survive a reload and prefill checkout", async ({ page }) => {
    await login(page);
    await page.getByLabel("Display name").fill("Captain Commute");
    await page.getByLabel("Default city").fill("Montréal");
    await page.getByLabel("Default country").selectOption("CA");
    await page.getByLabel("Email me about new products and offers").check();
    await page.getByTestId("save-settings").click();
    await expect(page.getByTestId("settings-saved")).toBeVisible();
    await expect(page.getByTestId("account-greeting")).toContainText("Hi, Captain Commute");

    await page.reload();
    await expect(page.getByLabel("Display name")).toHaveValue("Captain Commute");
    await expect(page.getByLabel("Default city")).toHaveValue("Montréal");
    await expect(page.getByLabel("Default country")).toHaveValue("CA");
    await expect(page.getByLabel("Email me about new products and offers")).toBeChecked();
    await expect(page.getByTestId("account-greeting")).toContainText("Hi, Captain Commute");

    await page.goto("/products/frame-pump-mini");
    await page.getByTestId("add-to-cart").click();
    await page.getByRole("link", { name: "Checkout" }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("Captain Commute");
    await expect(page.getByLabel("City")).toHaveValue("Montréal");
    await expect(page.getByLabel("Country")).toHaveValue("CA");
  });

  test("settings API rejects anonymous writes", async ({ request }) => {
    const res = await request.patch("/api/account/settings", { data: { displayName: "x" } });
    expect(res.status()).toBe(401);
  });
});
