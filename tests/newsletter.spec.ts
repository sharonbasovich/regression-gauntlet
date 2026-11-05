import { expect, test } from "@playwright/test";

test.describe("Newsletter", () => {
  test("subscribing shows success and is remembered after reload", async ({ page }) => {
    await page.goto("/about");
    const form = page.locator("footer form");
    await form.getByLabel("Email address").fill("not-an-email");
    await form.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.locator("#newsletter-message")).toContainText("valid email");

    await form.getByLabel("Email address").fill("newsletter@example.com");
    await form.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByTestId("newsletter-success")).toContainText("Thanks!");

    await page.reload();
    await expect(page.getByTestId("newsletter-subscribed")).toContainText("newsletter@example.com");
    await expect(page.locator("footer form")).toHaveCount(0);
  });
});
