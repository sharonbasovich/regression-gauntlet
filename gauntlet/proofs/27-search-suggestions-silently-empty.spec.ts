import { expect, test } from "@playwright/test";

test("BUG-27: header search shows suggestions", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("search-input").locator("visible=true").first().fill("glove");
  const suggestions = page.getByTestId("search-suggestions").locator("visible=true").first();
  await expect(suggestions).toBeVisible();
  await expect(suggestions.getByRole("link")).toHaveCount(3);
});
