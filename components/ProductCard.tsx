import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card group flex flex-col overflow-hidden" data-testid="product-card">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-ink-50">
        <Image
          src={`/products/${product.slug}.svg`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            {product.badge}
          </span>
        ) : null}
        {!product.inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.category}</p>
        <h3 className="text-base font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{product.short}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <Price cents={product.price} compareAt={product.compareAt} className="w-16 overflow-hidden whitespace-nowrap" testId="card-price" />
          <span className="flex items-center gap-1 text-xs text-muted" aria-label={`Rated ${product.rating} out of 5`}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-amber-700">
              <path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L10 14.8 4.6 17.7l1.2-5.9L1.4 7.7l6-.7z" />
            </svg>
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}
