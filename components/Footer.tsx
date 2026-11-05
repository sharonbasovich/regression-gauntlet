import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ subscribedEmail }: { subscribedEmail: string | null }) {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">Ride notes, twice a month</h2>
          <p className="mb-4 mt-1 max-w-sm text-sm text-white/70">
            New products, route ideas and the occasional discount. No spam, unsubscribe any time.
          </p>
          <NewsletterForm subscribedEmail={subscribedEmail} />
        </div>
        <nav aria-label="Shop">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?category=gloves" className="hover:underline">Gloves</Link></li>
            <li><Link href="/products?category=apparel" className="hover:underline">Apparel</Link></li>
            <li><Link href="/products?category=bags" className="hover:underline">Bags</Link></li>
            <li><Link href="/products?category=lights" className="hover:underline">Lights</Link></li>
            <li><Link href="/products?category=tools" className="hover:underline">Tools</Link></li>
            <li><Link href="/products?category=accessories" className="hover:underline">Accessories</Link></li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:underline">Shipping &amp; returns</Link></li>
            <li><Link href="/help#sizing" className="hover:underline">Size guide</Link></li>
            <li><Link href="/help#contact" className="hover:underline">Contact us</Link></li>
            <li><Link href="/account" className="hover:underline">My account</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/about#sustainability" className="hover:underline">Sustainability</Link></li>
            <li><Link href="/about#careers" className="hover:underline">Careers</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Gauntlet Shop. A fictional store built as a testing benchmark — nothing is for sale.</p>
          <p>Demo account: demo@gauntlet.shop / password123</p>
        </div>
      </div>
    </footer>
  );
}
