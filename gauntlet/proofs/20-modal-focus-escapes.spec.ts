import { expect, test } from "@playwright/test";
import { addToCart } from "../../tests/helpers";

test("BUG-20: Tab keeps focus inside the cart drawer", async ({ page }) => {
  await addToCart(page, "ridgeline-insulated-gloves", { closeDrawer: false });
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
    expect(inside, `focus left the dialog after ${i + 1} Tab presses`).toBe(true);
  }
});
