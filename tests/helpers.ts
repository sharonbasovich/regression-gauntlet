import { expect, type Page } from "@playwright/test";

export const DEMO = { email: "demo@gauntlet.shop", password: "password123", name: "Demo Rider" };

export function isMobile(page: Page): boolean {
  const vp = page.viewportSize();
  return !!vp && vp.width < 768;
}

export async function addToCart(page: Page, slug: string, { closeDrawer = true } = {}) {
  await page.goto(`/products/${slug}`);
  await page.getByTestId("add-to-cart").click();
  const dialog = page.getByRole("dialog", { name: "Added to your cart" });
  await expect(dialog).toBeVisible();
  if (closeDrawer) {
    await dialog.getByRole("button", { name: "Continue shopping" }).click();
    await expect(dialog).toBeHidden();
  }
}

export async function login(page: Page, email = DEMO.email, password = DEMO.password, next?: string) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByTestId("auth-submit").click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"));
}

export const SHIPPING = {
  email: "rider@example.com",
  fullName: "Alex Rider",
  address: "12 Queen Street West",
  city: "Toronto",
  postalCode: "M5H 2M9",
};

export async function fillCheckout(page: Page, overrides: Partial<typeof SHIPPING> = {}) {
  const v = { ...SHIPPING, ...overrides };
  await page.getByLabel("Email", { exact: true }).fill(v.email);
  await page.getByLabel("Full name").fill(v.fullName);
  await page.getByLabel("Street address").fill(v.address);
  await page.getByLabel("City").fill(v.city);
  await page.getByLabel("Postal code").fill(v.postalCode);
  await page.getByLabel("Country").selectOption("CA");
  await page.getByLabel("Card number").fill("4242 4242 4242 4242");
  await page.getByLabel("Expiry (MM/YY)").fill("12/31");
  await page.getByLabel("CVC").fill("123");
}

export function money(text: string | null): number {
  if (!text) throw new Error("no money text");
  const m = text.replace(/[^\d.]/g, "");
  return Math.round(Number(m) * 100);
}
