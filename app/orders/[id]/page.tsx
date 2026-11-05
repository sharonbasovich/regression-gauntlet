import type { Metadata } from "next";
import Link from "next/link";
import { deliveryEstimate } from "@/lib/dates";
import { readOrders } from "@/lib/orders";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = { title: "Order confirmation" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = (await readOrders()).find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-ink">We couldn&apos;t find that order</h1>
        <p className="mt-2 text-muted">Order {id} isn&apos;t in this browser&apos;s recent orders.</p>
        <Link href="/products" className="btn-primary mt-6">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-success">Order confirmed</p>
      <h1 className="mt-1 text-3xl font-bold text-ink" data-testid="order-heading">
        Thanks, {order.shippingName.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-muted">
        Order <span className="font-mono font-semibold text-ink" data-testid="order-id">{order.id}</span> · a receipt is on its way to {order.email}.
      </p>

      <div className="card mt-8 divide-y divide-line">
        <ul className="divide-y divide-line px-5">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.color}`} className="flex items-center justify-between py-3 text-sm">
              <span>
                <span className="font-medium text-ink">{i.name}</span>
                <span className="ml-2 text-muted">{i.color} × {i.quantity}</span>
              </span>
              <span className="text-ink">{formatMoney(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 px-5 py-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatMoney(order.totals.subtotal)}</dd></div>
          {order.totals.discount > 0 ? (
            <div className="flex justify-between text-success"><dt>Discount ({order.couponCode})</dt><dd>−{formatMoney(order.totals.discount)}</dd></div>
          ) : null}
          <div className="flex justify-between"><dt className="text-muted">Shipping ({order.shippingMethod})</dt><dd>{order.totals.shipping === 0 ? "Free" : formatMoney(order.totals.shipping)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatMoney(order.totals.tax)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink"><dt>Total charged</dt><dd data-testid="order-total">{formatMoney(order.totals.total)}</dd></div>
        </dl>
        <div className="grid gap-6 px-5 py-4 text-sm sm:grid-cols-2">
          <div>
            <h2 className="font-semibold text-ink">Shipping to</h2>
            <address className="mt-1 not-italic text-ink/80">
              {order.shippingName}<br />{order.address}<br />{order.city}, {order.postalCode}<br />{order.country}
            </address>
          </div>
          <div>
            <h2 className="font-semibold text-ink">Delivery</h2>
            <p className="mt-1 capitalize text-ink/80">{order.shippingMethod} shipping</p>
            <p className="text-ink/80" data-testid="order-eta">Arrives by {deliveryEstimate(order.shippingMethod, new Date(order.placedAt))}</p>
            <p className="mt-2 text-muted">Paid with card ending {order.cardLast4}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className="btn-primary">Continue shopping</Link>
        <Link href="/account" className="btn-secondary">View my orders</Link>
      </div>
    </div>
  );
}
