import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { getProduct, relatedProducts } from "@/lib/products";
import { AddToCart } from "./AddToCart";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link href="/products" className="hover:underline">Shop</Link> <span aria-hidden="true">/</span>{" "}
        <Link href={`/products?category=${product.category}`} className="capitalize hover:underline">{product.category}</Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-50">
          <Image src={`/products/${product.slug}.svg`} alt={`${product.name} product image`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          {product.badge ? <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{product.badge}</p> : null}
          <h1 className="mt-1 text-3xl font-bold text-ink" data-testid="product-title">{product.name}</h1>
          <p className="mt-2 flex items-center gap-3 text-sm text-muted">
            <span aria-label={`Rated ${product.rating} out of 5`}>★ {product.rating.toFixed(1)}</span>
            <span aria-hidden="true">·</span>
            <a href="#reviews" className="hover:underline">{product.reviews} reviews</a>
          </p>
          <Price cents={product.price} compareAt={product.compareAt} className="mt-4 text-2xl" testId="product-price" />
          <p className="mt-4 text-base leading-relaxed text-ink/80">{product.short}</p>
          <div className="mt-6">
            <AddToCart product={product} />
          </div>
          <p className="mt-4 text-sm text-muted">
            {product.inStock ? "In stock · ships in 1 business day" : "Back in stock soon"} · Free shipping over $120 · 30-day returns
          </p>

          <section className="mt-10" aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-lg font-semibold text-ink">Details</h2>
            <p className="mt-2 leading-relaxed text-ink/80">{product.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <section id="reviews" className="mt-16" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-2xl font-bold text-ink">What riders say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Priya N.", "Exactly what I needed for the winter commute. Fit is true to size."],
            ["Marcus T.", "Survived three months of rain. Would buy again."],
            ["Jo L.", "Good quality, quick delivery. Took one star off for the colour being darker than pictured."],
          ].map(([name, body], i) => (
            <blockquote key={name} className="card p-5">
              <p className="text-sm text-amber-700" aria-label={`${i === 2 ? 4 : 5} out of 5 stars`}>{i === 2 ? "★★★★☆" : "★★★★★"}</p>
              <p className="mt-2 text-sm text-ink/90">{body}</p>
              <footer className="mt-3 text-xs text-muted">— {name}, verified buyer</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-2xl font-bold text-ink">You might also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
