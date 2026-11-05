export interface LineItem {
  productId: string;
  name: string;
  slug: string;
  color: string;
  unitPrice: number; // cents
  quantity: number;
}

export interface Coupon {
  code: string;
  kind: "percent" | "free-shipping";
  value: number;
  label: string;
}

export const COUPONS: Coupon[] = [
  { code: "GAUNTLET10", kind: "percent", value: 10, label: "10% off your order" },
  { code: "FREESHIP", kind: "free-shipping", value: 0, label: "Free standard shipping" },
];

export const FREE_SHIPPING_THRESHOLD = 12000; // cents
export const SHIPPING_RATES = { standard: 800, express: 1900 } as const;
export type ShippingMethod = keyof typeof SHIPPING_RATES;
export const TAX_RATE = 0.08;

export function findCoupon(code: string | null | undefined): Coupon | undefined {
  if (!code) return undefined;
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function computeTotals(
  items: LineItem[],
  opts: { coupon?: Coupon; shipping?: ShippingMethod } = {},
): Totals {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const method = opts.shipping ?? "standard";
  let shipping: number = SHIPPING_RATES[method];
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) shipping = 0;
  if (items.length === 0) shipping = 0;

  let discount = 0;
  if (opts.coupon?.kind === "percent") {
    discount = Math.round((subtotal * opts.coupon.value) / 100);
  } else if (opts.coupon?.kind === "free-shipping" && method === "standard") {
    shipping = 0;
  }
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + shipping + tax;
  return { subtotal, discount, shipping, tax, total, itemCount };
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
