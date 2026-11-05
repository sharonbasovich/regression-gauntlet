import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Help</h1>
      <section id="shipping" className="mt-8">
        <h2 className="text-xl font-semibold text-ink">Shipping &amp; returns</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink/80">
          <li>Standard shipping is $8, free on orders over $120. It arrives in 3–5 business days.</li>
          <li>Express shipping is $19 and arrives in 1–2 business days.</li>
          <li>Returns are free within 30 days. Items should be unworn, with tags.</li>
        </ul>
      </section>
      <section id="sizing" className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Size guide</h2>
        <table className="mt-3 w-full text-left text-sm">
          <caption className="sr-only">Glove sizes by hand circumference</caption>
          <thead>
            <tr className="border-b border-line text-muted">
              <th scope="col" className="py-2 font-medium">Size</th>
              <th scope="col" className="py-2 font-medium">Hand circumference</th>
              <th scope="col" className="py-2 font-medium">Finger length</th>
            </tr>
          </thead>
          <tbody>
            {[["S", "18–19 cm", "7.5 cm"], ["M", "20–21 cm", "8.0 cm"], ["L", "22–23 cm", "8.5 cm"], ["XL", "24–25 cm", "9.0 cm"]].map(([s, c, f]) => (
              <tr key={s} className="border-b border-line">
                <th scope="row" className="py-2 font-medium text-ink">{s}</th>
                <td className="py-2 text-ink/80">{c}</td>
                <td className="py-2 text-ink/80">{f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section id="payments" className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Test payments</h2>
        <p className="mt-2 text-ink/80">
          This is a demo store; no real payments are taken. Card <code className="rounded bg-ink-50 px-1 font-mono">4242 4242 4242 4242</code> succeeds, <code className="rounded bg-ink-50 px-1 font-mono">4000 0000 0000 0002</code> is declined. Promo codes <code className="rounded bg-ink-50 px-1 font-mono">GAUNTLET10</code> (10% off) and <code className="rounded bg-ink-50 px-1 font-mono">FREESHIP</code> work at checkout.
        </p>
      </section>
      <section id="contact" className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Contact us</h2>
        <p className="mt-2 text-ink/80">
          Email <a href="mailto:help@gauntlet.shop" className="underline">help@gauntlet.shop</a>. We reply within one business day.
        </p>
      </section>
    </div>
  );
}
