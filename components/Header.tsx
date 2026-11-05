"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { SearchBox } from "./SearchBox";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/products", label: "Shop all" },
  { href: "/products?category=gloves", label: "Gloves" },
  { href: "/products?category=apparel", label: "Apparel" },
  { href: "/products?category=bags", label: "Bags" },
  { href: "/products?category=lights", label: "Lights" },
  { href: "/about", label: "About" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-ink" aria-label="Gauntlet Shop home">
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="7" fill="#1b2a41" />
        <path d="M22.5 11.2A7.6 7.6 0 1 0 23.6 17H16.5v-2.8h10.2c.1.6.2 1.2.2 1.8 0 6.1-4.9 11-11 11S5 22.1 5 16 9.9 5 16 5c3 0 5.8 1.2 7.8 3.2z" fill="#f3b562" />
      </svg>
      <span className="text-lg font-bold tracking-tight">Gauntlet Shop</span>
    </Link>
  );
}

export function Header({ user }: { user: SessionUser | null }) {
  const { count, hydrated, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <a href="#main" className="sr-only-focusable fixed left-2 top-2 z-50 rounded bg-ink px-3 py-2 text-white">
        Skip to content
      </a>
      <p className="bg-ink px-4 py-1.5 text-center text-xs font-medium text-white">
        Free standard shipping on orders over $120<span className="hidden sm:inline"> · 30-day returns</span>
      </p>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="btn-ghost -ml-2 px-2 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          data-testid="menu-toggle"
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <Logo />
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-5 whitespace-nowrap md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-ink/80 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchBox className="hidden w-64 lg:block" />
          <Link href={user ? "/account" : "/login"} className="btn-ghost px-2" data-testid="account-link">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span className="sr-only whitespace-nowrap text-sm sm:not-sr-only">{user ? `${user.name.split(" ")[0]}’s account` : "Log in"}</span>
          </Link>
          <button type="button" onClick={openDrawer} className="btn-ghost relative px-2" data-testid="cart-button">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L21.5 8H6" />
              <circle cx="9.5" cy="20" r="1.2" />
              <circle cx="17.5" cy="20" r="1.2" />
            </svg>
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-xs font-bold text-ink" data-testid="cart-count" aria-hidden="true">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      <div className="hidden border-t border-line px-6 py-2 md:block lg:hidden">
        <SearchBox className="mx-auto max-w-2xl" />
      </div>
      {menuOpen ? (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[6.25rem] z-40 overflow-y-auto border-t border-line bg-white p-4 md:hidden" data-testid="mobile-menu">
          <SearchBox className="mb-4" onNavigate={() => setMenuOpen(false)} />
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block py-3 text-base font-medium text-ink" onClick={() => setMenuOpen(false)}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={user ? "/account" : "/login"} className="block py-3 text-base font-medium text-ink" onClick={() => setMenuOpen(false)}>
                  {user ? "My account" : "Log in / Sign up"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
