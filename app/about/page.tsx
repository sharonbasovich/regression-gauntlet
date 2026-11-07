import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">We ride to work too.</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/80">
        Gauntlet Shop started in a shared garage in 2017 with one product — a pair of gloves that didn&apos;t soak through on the ride in. Everything we make since then has followed the same rule: build it for the person who rides every day, not the person who rides on Sunday. We ship every order from our workshop in Montréal.
      </p>
      <section id="sustainability" className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Sustainability</h2>
        <p className="mt-2 leading-relaxed text-ink/80">
          Our fabrics are bluesign® certified where available, our packaging is paper, and every product carries a lifetime repair promise. The most sustainable jacket is the one you keep wearing.
        </p>
      </section>
      <section id="careers" className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Careers</h2>
        <p className="mt-2 leading-relaxed text-ink/80">
          We&apos;re a team of eleven in Toronto. We don&apos;t have open roles right now, but we read every note sent to <a href="mailto:hello@gauntlet.shop" className="underline">hello@gauntlet.shop</a>.
        </p>
      </section>
      <p className="mt-12 rounded-md border border-line bg-white p-4 text-sm text-muted">
        Gauntlet Shop is a fictional store. It exists as the target application for the Regression Gauntlet benchmark; nothing here can be purchased.
      </p>
    </div>
  );
}
