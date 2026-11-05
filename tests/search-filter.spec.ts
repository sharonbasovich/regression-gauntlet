import { expect, test } from "@playwright/test";
import { isMobile } from "./helpers";

test.describe("Search and filter", () => {
  test("header search suggests products and submits to the results page", async ({ page }) => {
    await page.goto("/");
    if (isMobile(page)) await page.getByTestId("menu-toggle").click();
    const input = page.getByTestId("search-input").locator("visible=true").first();
    await input.fill("glove");
    const suggestions = page.getByTestId("search-suggestions").locator("visible=true").first();
    await expect(suggestions).toBeVisible();
    await expect(suggestions.getByRole("link")).toHaveCount(3);
    await input.press("Enter");
    await expect(page).toHaveURL(/\/products\?q=glove/);
    await expect(page.getByTestId("catalog-title")).toHaveText("Results for “glove”");
    await expect(page.getByTestId("product-card")).toHaveCount(3);
  });

  test("search is case-insensitive and matches multiple words", async ({ page }) => {
    await page.goto("/products?q=Waterproof%20GLOVES");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("product-card")).toContainText("Stormline Waterproof Gloves");
    await page.goto("/products?q=zzzz");
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("category, sort, max price and in-stock filters", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("link", { name: "Apparel", exact: true }).first().click();
    await expect(page).toHaveURL(/category=apparel/);
    await expect(page.getByTestId("catalog-title")).toHaveText("Apparel");
    await expect(page.getByTestId("product-card")).toHaveCount(3);

    await page.getByLabel("Sort by").selectOption("price-asc");
    await page.getByLabel("In stock only").check();
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(/sort=price-asc/);
    await expect(page).toHaveURL(/instock=1/);
    const cards = page.getByTestId("product-card");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText("Cinder Merino Base Layer");
    await expect(cards.nth(1)).toContainText("Slipstream Packable Shell");

    await page.getByLabel("Max price ($)").fill("100");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("result-count")).toHaveText("1 product");
  });
});
