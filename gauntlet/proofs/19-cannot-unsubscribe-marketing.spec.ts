import { expect, test } from "@playwright/test";
import { login } from "../../tests/helpers";

test("BUG-19: opting out of marketing emails persists", async ({ page }) => {
  await login(page);
  await page.goto("/account");
  const box = page.getByLabel("Email me about new products and offers");
  await box.check();
  await page.getByTestId("save-settings").click();
  await expect(page.getByTestId("settings-saved")).toBeVisible();
  await page.reload();
  await expect(box).toBeChecked();
  await box.uncheck();
  await page.getByTestId("save-settings").click();
  await expect(page.getByTestId("settings-saved")).toBeVisible();
  await page.reload();
  await expect(box).not.toBeChecked();
});
