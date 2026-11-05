import { NextResponse } from "next/server";
import { searchProducts, type SortKey } from "@/lib/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 50) || 50));
  const products = searchProducts({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    sort: (url.searchParams.get("sort") as SortKey) ?? "featured",
    max: url.searchParams.get("max") ? Number(url.searchParams.get("max")) : undefined,
    inStock: url.searchParams.get("instock") === "1",
  });
  return NextResponse.json({
    count: products.length,
    products: products.slice(0, limit).map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, category: p.category, inStock: p.inStock })),
  });
}
