import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, searchProducts, type SortKey } from "@/lib/products";

export const metadata: Metadata = { title: "Shop" };

type Params = { q?: string; category?: string; sort?: string; max?: string; instock?: string };

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

function loadProducts(params: Params) {
  try {
    return searchProducts({
      q: params.q,
      category: params.category,
      sort: (params.sort as SortKey) ?? "featured",
      max: params.max ? Number(params.max) : undefined,
      inStock: params.instock === "1",
    });
  } catch (err) {
    console.error("catalog query failed", err);
    throw err;
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const products = loadProducts(params);
  const activeCategory = CATEGORIES.find((c) => c.id === params.category);
  const title = params.q ? `Results for “${params.q}”` : activeCategory ? activeCategory.label : "All products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link href="/products" className="hover:underline">Shop</Link>
        {activeCategory ? (
          <>
            {" "}<span aria-hidden="true">/</span> <span className="text-ink">{activeCategory.label}</span>
          </>
        ) : null}
      </nav>
      <h1 className="mt-2 text-3xl font-bold text-ink" data-testid="catalog-title">
        {title}
      </h1>
      {activeCategory ? <p className="mt-1 text-muted">{activeCategory.blurb}</p> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Filters">
          <form method="get" action="/products" className="space-y-6" data-testid="filter-form">
            {params.q ? <input type="hidden" name="q" value={params.q} /> : null}
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink">Category</legend>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href={params.q ? `/products?q=${encodeURIComponent(params.q)}` : "/products"} className={`block rounded px-2 py-1 hover:bg-ink-50 ${!params.category ? "bg-ink-50 font-semibold text-ink" : "text-ink/80"}`}>
                    All
                  </Link>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products?category=${c.id}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
                      className={`block rounded px-2 py-1 hover:bg-ink-50 ${params.category === c.id ? "bg-ink-50 font-semibold text-ink" : "text-ink/80"}`}
                      aria-current={params.category === c.id ? "page" : undefined}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </fieldset>
            {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
            <div>
              <label htmlFor="sort" className="label">Sort by</label>
              <select id="sort" name="sort" defaultValue={params.sort ?? "featured"} className="input">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="max" className="label">Max price ($)</label>
              <input id="max" name="max" type="number" min={10} step={10} defaultValue={params.max ?? ""} placeholder="Any" className="input" />
            </div>
            <div className="flex items-center gap-2">
              <input id="instock" name="instock" type="checkbox" value="1" defaultChecked={params.instock === "1"} className="h-4 w-4 rounded border-line accent-ink" />
              <label htmlFor="instock" className="text-sm text-ink">In stock only</label>
            </div>
            <button type="submit" className="btn-secondary w-full">Apply filters</button>
          </form>
        </aside>

        <section aria-live="polite">
          <p className="mb-4 text-sm text-muted" data-testid="result-count">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          {products.length === 0 ? (
            <div className="card p-10 text-center" data-testid="empty-state">
              <p className="text-lg font-semibold text-ink">No products match</p>
              <p className="mt-1 text-sm text-muted">Try a different search term or clear your filters.</p>
              <Link href="/products" className="btn-primary mt-4">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3" data-testid="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
