import { expect, test } from "@playwright/test";
import { DEMO, login } from "./helpers";

test.describe("Authentication", () => {
  test("demo login lands on the account page and logout clears the session", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-greeting")).toContainText(`Hi, ${DEMO.name}`);
    await expect(page.getByTestId("account-link")).toContainText("Demo");

    await page.getByTestId("logout").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("account-link")).toContainText("Log in");
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?next=(%2F|\/)account/);
  });

  test("wrong password shows an error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill(DEMO.email);
    await page.getByLabel("Password", { exact: true }).fill("not-the-password");
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toHaveText("Invalid email or password.");
    await expect(page).toHaveURL(/\/login/);
  });

  test("sign up, log out, log back in with the new credentials", async ({ page }) => {
    const email = `new-${Date.now()}@example.com`;
    await page.goto("/signup");
    await page.getByLabel("Full name").fill("Sam Newrider");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill("correct-horse-battery");
    await page.getByTestId("auth-submit").click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-greeting")).toContainText("Hi, Sam Newrider");

    await page.getByTestId("logout").click();
    await expect(page).toHaveURL(/\/$/);

    await login(page, email, "correct-horse-battery");
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-greeting")).toContainText("Hi, Sam Newrider");
  });

  test("login honours ?next= and keeps the cart", async ({ page }) => {
    await page.goto("/products/transit-musette");
    await page.getByTestId("add-to-cart").click();
    await page.getByRole("button", { name: "Continue shopping" }).click();
    await login(page, DEMO.email, DEMO.password, "/checkout");
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue(DEMO.email);
    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await expect(page.getByTestId("order-summary")).toContainText("Transit Musette");
  });
});
