import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";
import { newOrderId, ORDERS_COOKIE, readOrders, serializeOrders, type Order } from "@/lib/orders";
import { computeTotals, findCoupon, type LineItem, type ShippingMethod } from "@/lib/pricing";
import { getProductById } from "@/lib/products";
import { isFutureExpiry, isValidCard, isValidEmail } from "@/lib/validation";

interface CheckoutBody {
  items?: { productId: string; color: string; quantity: number }[];
  shippingMethod?: ShippingMethod;
  couponCode?: string | null;
  contact?: { email: string; fullName: string; address: string; city: string; postalCode: string; country: string };
  payment?: { cardNumber: string; expiry: string; cvc: string };
}

const DECLINED_CARD = "4000000000000002";
const PROCESSOR_LATENCY_MS = 600;

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body || !Array.isArray(body.items) || body.items.length === 0) return bad("Your cart is empty.");

  const items: LineItem[] = [];
  for (const raw of body.items) {
    const product = getProductById(raw.productId);
    if (!product || !product.inStock) return bad("One of the items in your cart is no longer available.");
    const quantity = Math.floor(Number(raw.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 10) return bad("Invalid quantity.");
    const color = product.colors.includes(raw.color) ? raw.color : product.colors[0];
    items.push({ productId: product.id, name: product.name, slug: product.slug, color, unitPrice: product.price, quantity });
  }

  const c = body.contact;
  if (!c || !isValidEmail(c.email) || !c.fullName?.trim() || !c.address?.trim() || !c.city?.trim() || !c.postalCode?.trim() || !c.country) {
    return bad("Please complete the contact and shipping details.");
  }
  const method: ShippingMethod = body.shippingMethod === "express" ? "express" : "standard";
  const coupon = findCoupon(body.couponCode);
  if (body.couponCode && !coupon) return bad("That promo code isn't valid.");

  const p = body.payment;
  const cardNumber = (p?.cardNumber ?? "").replace(/\s+/g, "");
  if (!p || !isValidCard(cardNumber)) return bad("Check the card number and try again.");
  if (!isFutureExpiry(p.expiry)) return bad("The card's expiry date has passed.");
  if (!/^\d{3,4}$/.test(p.cvc)) return bad("Check the card's security code.");

  await new Promise((r) => setTimeout(r, PROCESSOR_LATENCY_MS));
  if (cardNumber === DECLINED_CARD) return bad("Your card was declined. Try a different card.", 402);

  const order: Order = {
    id: newOrderId(),
    placedAt: new Date().toISOString(),
    email: c.email.trim().toLowerCase(),
    shippingName: c.fullName.trim(),
    address: c.address.trim(),
    city: c.city.trim(),
    postalCode: c.postalCode.trim(),
    country: c.country,
    shippingMethod: method,
    couponCode: coupon?.code ?? null,
    items,
    totals: computeTotals(items, { coupon, shipping: method }),
    cardLast4: cardNumber.slice(-4),
  };

  const existing = await readOrders();
  const res = NextResponse.json({ ok: true, orderId: order.id, total: order.totals.total });
  res.cookies.set(ORDERS_COOKIE, serializeOrders([order, ...existing]), { ...cookieOptions, maxAge: 60 * 60 * 24 * 90 });
  return res;
}
