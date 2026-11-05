import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("BUG-22: no serious colour-contrast violations on the catalog", async ({ page }) => {
  await page.goto("/products");
  const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.length} nodes`)).toEqual([]);
});
