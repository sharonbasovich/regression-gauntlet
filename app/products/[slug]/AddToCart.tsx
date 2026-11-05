"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        add({ productId: product.id, name: product.name, slug: product.slug, color, unitPrice: product.price }, qty);
      }}
    >
      <fieldset>
        <legend className="label">
          Colour: <span className="font-normal text-muted">{color}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <label key={c} className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm ${c === color ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/50"}`}>
              <input type="radio" name="color" value={c} checked={c === color} onChange={() => setColor(c)} className="sr-only" />
              {c}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="qty" className="label">Quantity</label>
        <div className="inline-flex items-center rounded-md border border-line bg-white">
          <button type="button" className="px-3 py-2 text-ink disabled:opacity-40" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
          <input id="qty" type="number" min={1} max={10} value={qty} onChange={(e) => setQty(Math.min(10, Math.max(1, Number(e.target.value) || 1)))} className="w-12 border-x border-line py-2 text-center text-base text-ink" />
          <button type="button" className="px-3 py-2 text-ink disabled:opacity-40" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10}>+</button>
        </div>
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-56" disabled={!product.inStock} data-testid="add-to-cart">
        {product.inStock ? "Add to cart" : "Sold out"}
      </button>
    </form>
  );
}
