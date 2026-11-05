"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Modal } from "./Modal";
import { computeTotals, formatMoney } from "@/lib/pricing";

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, lastAdded } = useCart();
  const totals = computeTotals(items);

  return (
    <Modal open={drawerOpen} onClose={closeDrawer} title={lastAdded ? "Added to your cart" : "Your cart"} side>
      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-line" data-testid="drawer-items">
          {items.map((i) => (
            <li key={`${i.productId}-${i.color}`} className="flex gap-4 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-ink-50">
                <Image src={`/products/${i.slug}.svg`} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-ink">{i.name}</p>
                <p className="text-muted">
                  {i.color} · Qty {i.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">{formatMoney(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-ink" data-testid="drawer-subtotal">
            {formatMoney(totals.subtotal)}
          </span>
        </div>
        <div className="mt-4 grid gap-2">
          <Link href="/checkout" onClick={closeDrawer} className="btn-primary w-full">
            Checkout
          </Link>
          <Link href="/cart" onClick={closeDrawer} className="btn-secondary w-full">
            View cart
          </Link>
          <button type="button" onClick={closeDrawer} className="btn-ghost w-full">
            Continue shopping
          </button>
        </div>
      </div>
    </Modal>
  );
}
