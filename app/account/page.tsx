import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile, getSessionUser } from "@/lib/auth";
import { readOrders } from "@/lib/orders";
import { formatMoney } from "@/lib/pricing";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const profile = await getProfile();
  const orders = await readOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink" data-testid="account-greeting">
            Hi, {profile.displayName || user.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn-secondary" data-testid="logout">Log out</button>
        </form>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <section aria-labelledby="settings-heading">
          <h2 id="settings-heading" className="text-xl font-semibold text-ink">Settings</h2>
          <p className="mt-1 text-sm text-muted">Changes are saved to your account and used to prefill checkout.</p>
          <SettingsForm profile={profile} />
        </section>

        <section aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="text-xl font-semibold text-ink">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="card mt-4 p-5 text-sm text-muted" data-testid="orders-empty">No orders yet in this browser.</p>
          ) : (
            <ul className="card mt-4 divide-y divide-line" data-testid="orders-list">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between p-4 text-sm">
                  <span>
                    <Link href={`/orders/${o.id}`} className="font-mono font-semibold text-ink hover:underline">{o.id}</Link>
                    <span className="block text-xs text-muted">{new Date(o.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {o.totals.itemCount} item{o.totals.itemCount === 1 ? "" : "s"}</span>
                  </span>
                  <span className="font-semibold text-ink">{formatMoney(o.totals.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
