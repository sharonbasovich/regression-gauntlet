import { cookies } from "next/headers";
import { decode } from "./auth";
import type { LineItem, Totals } from "./pricing";

export const ORDERS_COOKIE = "gs_orders";

export interface Order {
  id: string;
  placedAt: string; // ISO
  email: string;
  shippingName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: "standard" | "express";
  couponCode: string | null;
  items: LineItem[];
  totals: Totals;
  cardLast4: string;
}

export function newOrderId(): string {
  const n = Math.floor(Math.random() * 0xffffff).toString(36).toUpperCase().padStart(5, "0");
  return `GS-${n}`;
}

export async function readOrders(): Promise<Order[]> {
  const store = await cookies();
  return decode<Order[]>(store.get(ORDERS_COOKIE)?.value) ?? [];
}

export function serializeOrders(orders: Order[]): string {
  // Cookies are capped at ~4 KB; keep the two most recent orders and skip the
  // base64 layer, which inflated the payload by a third.
  return JSON.stringify(orders.slice(0, 2));
}
