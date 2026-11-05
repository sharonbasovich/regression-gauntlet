import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">That page took a wrong turn</h1>
      <p className="mt-2 text-muted">The link may be old, or the product may have been retired.</p>
      <Link href="/products" className="btn-primary mt-6">Back to the shop</Link>
    </div>
  );
}
