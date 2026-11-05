import type { Metadata } from "next";
import { getProfile, getSessionUser } from "@/lib/auth";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const profile = await getProfile();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Checkout</h1>
      <CheckoutForm
        defaults={{
          email: user?.email ?? "",
          fullName: profile.displayName || user?.name || "",
          city: profile.defaultCity,
          country: profile.defaultCountry,
        }}
      />
    </div>
  );
}
