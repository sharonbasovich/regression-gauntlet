import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.badge === "Bestseller").slice(0, 4);
  const fresh = PRODUCTS.filter((p) => p.badge === "New");

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src="/hero.svg" alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 md:py-28 lg:py-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber">Autumn / Winter collection</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Gear for people who ride every day.
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Gloves, layers, bags and lights designed around the commute — tested through a thousand wet mornings so you don&apos;t have to.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn bg-amber text-ink hover:bg-amber/90">
              Shop the collection
            </Link>
            <Link href="/products?category=gloves" className="btn border border-white/40 text-white hover:bg-white/10">
              Winter gloves
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-2xl font-bold text-ink">
          Shop by category
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link href={`/products?category=${c.id}`} className="card block p-4 hover:border-ink/40">
                <span className="block text-base font-semibold text-ink">{c.label}</span>
                <span className="mt-1 block text-xs text-muted">{c.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" aria-labelledby="bestsellers-heading">
        <div className="flex items-end justify-between">
          <h2 id="bestsellers-heading" className="text-2xl font-bold text-ink">
            Bestsellers
          </h2>
          <Link href="/products?sort=rating" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="featured-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            ["Free shipping over $120", "Standard delivery in 3–5 business days, express in 1–2."],
            ["30-day returns", "Ride it. If it isn't right, send it back for a full refund."],
            ["Repairs for life", "Zips, seams and buckles repaired free for as long as you own it."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="new-heading">
        <h2 id="new-heading" className="text-2xl font-bold text-ink">
          New this season
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
