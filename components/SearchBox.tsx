"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/pricing";

interface Suggestion {
  slug: string;
  name: string;
  price: number;
  category: string;
}

export function SearchBox({ className = "", autoFocus = false, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const requestSeq = useRef(0);
  const listId = useId();

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const seq = ++requestSeq.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=5`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { products: Suggestion[] };
        // Ignore responses that arrive out of order.
        if (seq !== requestSeq.current) return;
        setResults(data.products);
        setOpen(true);
      } catch {
        /* aborted */
      }
    }, 120);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    onNavigate?.();
    router.push(`/products?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search products
      </label>
      <div className="relative">
        <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l4 4" />
        </svg>
        <input
          id={`${listId}-input`}
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search gloves, lights, bags…"
          autoComplete="off"
          autoFocus={autoFocus}
          className="input pl-9"
          data-testid="search-input"
        />
      </div>
      {open && results.length > 0 ? (
        <ul id={listId} className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-md border border-line bg-white shadow-lg" data-testid="search-suggestions">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/products/${r.slug}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-ink-50"
              >
                <span>
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="ml-2 text-xs uppercase tracking-wide text-muted">{r.category}</span>
                </span>
                <span className="text-muted">{formatMoney(r.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
