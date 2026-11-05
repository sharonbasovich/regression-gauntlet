import { expect, test } from "@playwright/test";
import { login } from "../../tests/helpers";

test("BUG-18: a saved display name survives a reload", async ({ page }) => {
  await login(page);
  await page.goto("/account");
  await page.getByLabel("Display name").fill("Proof Rider");
  await page.getByTestId("save-settings").click();
  await expect(page.getByTestId("settings-saved")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Display name")).toHaveValue("Proof Rider");
  await expect(page.getByTestId("account-greeting")).toContainText("Proof Rider");
});
