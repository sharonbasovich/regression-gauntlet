"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { computeTotals, formatMoney, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export function CartView() {
  const { items, hydrated, setQuantity, remove } = useCart();
  const totals = computeTotals(items);

  if (!hydrated) {
    return <p className="mt-6 text-muted">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="card mt-6 p-10 text-center" data-testid="cart-empty">
        <p className="text-lg font-semibold text-ink">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted">Find something for your next ride.</p>
        <Link href="/products" className="btn-primary mt-4">Continue shopping</Link>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line" data-testid="cart-items">
        {items.map((i) => (
          <li key={`${i.productId}-${i.color}`} className="flex gap-4 py-5" data-testid="cart-line">
            <Link href={`/products/${i.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-ink-50">
              <Image src={`/products/${i.slug}.svg`} alt="" fill sizes="96px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold text-ink">
                  <Link href={`/products/${i.slug}`} className="hover:underline">{i.name}</Link>
                </h2>
                <p className="text-sm text-muted">Colour: {i.color}</p>
                <p className="mt-1 text-sm text-muted">{formatMoney(i.unitPrice)} each</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center rounded-md border border-line bg-white">
                  <button type="button" className="px-3 py-1.5 text-ink" aria-label={`Decrease quantity of ${i.name}`} onClick={() => setQuantity(i.productId, i.color, i.quantity - 1)}>−</button>
                  <span className="w-8 text-center text-sm text-ink" data-testid="line-qty" aria-live="polite">{i.quantity}</span>
                  <button type="button" className="px-3 py-1.5 text-ink" aria-label={`Increase quantity of ${i.name}`} onClick={() => setQuantity(i.productId, i.color, i.quantity + 1)}>+</button>
                </div>
                <p className="w-20 text-right font-semibold text-ink" data-testid="line-total">{formatMoney(i.unitPrice * i.quantity)}</p>
                <button type="button" className="text-sm text-muted underline-offset-4 hover:text-danger hover:underline" onClick={() => remove(i.productId)} aria-label={`Remove ${i.name} from cart`}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="card h-fit p-5" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-semibold text-ink">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="text-ink" data-testid="cart-subtotal">{formatMoney(totals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="text-ink">{totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Estimated tax</dt><dd className="text-ink">{formatMoney(totals.tax)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt className="text-ink">Total</dt><dd className="text-ink" data-testid="cart-total">{formatMoney(totals.total)}</dd></div>
        </dl>
        {remaining > 0 ? (
          <p className="mt-3 text-xs text-muted">Add {formatMoney(remaining)} more for free standard shipping.</p>
        ) : (
          <p className="mt-3 text-xs text-success">You qualify for free standard shipping.</p>
        )}
        <Link href="/checkout" className="btn-primary mt-5 w-full" data-testid="checkout-link">Proceed to checkout</Link>
        <Link href="/products" className="btn-ghost mt-2 w-full">Continue shopping</Link>
      </aside>
    </div>
  );
}
