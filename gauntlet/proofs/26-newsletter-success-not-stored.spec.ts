import { expect, test } from "@playwright/test";

test("BUG-26: a guest newsletter subscription is remembered after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email address").fill("proof@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.getByTestId("newsletter-success")).toContainText("Thanks!");
  await page.reload();
  await expect(page.getByTestId("newsletter-subscribed")).toContainText("proof@example.com");
});
