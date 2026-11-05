"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Field } from "./Field";
import { deliveryEstimate } from "@/lib/dates";
import { isValidEmail } from "@/lib/validation";
import { computeTotals, findCoupon, formatMoney, SHIPPING_RATES, type Coupon, type ShippingMethod } from "@/lib/pricing";

interface Defaults {
  email: string;
  fullName: string;
  city: string;
  country: string;
}

type Fields = "email" | "fullName" | "address" | "city" | "postalCode" | "country" | "cardNumber" | "expiry" | "cvc";

const COUNTRIES = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["GB", "United Kingdom"],
  ["DE", "Germany"],
  ["NL", "Netherlands"],
  ["AU", "Australia"],
];

export function CheckoutForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter();
  const { items, hydrated, clear } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<Fields, string>>({
    email: defaults.email,
    fullName: defaults.fullName,
    address: "",
    city: defaults.city,
    postalCode: "",
    country: defaults.country || "US",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | undefined>();
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const totals = computeTotals(items, { coupon, shipping });

  function set(field: Fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };
  }

  function applyCoupon() {
    const found = findCoupon(couponInput);
    if (!found) {
      setCoupon(undefined);
      setCouponMessage(`“${couponInput.trim()}” isn't a valid code.`);
      return;
    }
    setCoupon(found);
    setCouponMessage(`${found.code} applied — ${found.label}.`);
  }

  function validate(): Partial<Record<Fields, string>> {
    const er: Partial<Record<Fields, string>> = {};
    if (!isValidEmail(values.email)) er.email = "Enter a valid email address.";
    if (values.fullName.trim().length < 2) er.fullName = "Enter the recipient's full name.";
    if (values.address.trim().length < 4) er.address = "Enter a street address.";
    if (!values.city.trim()) er.city = "Enter a city.";
    if (values.postalCode.trim().length < 3) er.postalCode = "Enter a postal code.";
    if (!values.country) er.country = "Choose a country.";
    const digits = values.cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(digits)) er.cardNumber = "Enter a 16-digit card number.";
    if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(values.expiry.trim())) er.expiry = "Use MM/YY.";
    if (!/^\d{3,4}$/.test(values.cvc)) er.cvc = "3 or 4 digits.";
    return er;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const er = validate();
    setErrors(er);
    const firstError = Object.keys(er)[0] as Fields | undefined;
    if (firstError) {
      const el = formRef.current?.elements.namedItem(firstError) as HTMLElement | null;
      el?.scrollIntoView({ block: "center" });
      el?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, color: i.color, quantity: i.quantity })),
          shippingMethod: shipping,
          couponCode: coupon?.code ?? null,
          contact: { email: values.email, fullName: values.fullName, address: values.address, city: values.city, postalCode: values.postalCode, country: values.country },
          payment: { cardNumber: values.cardNumber.replace(/\s+/g, ""), expiry: values.expiry, cvc: values.cvc },
        }),
      });
      const data = (await res.json()) as { ok: boolean; orderId?: string; error?: string };
      if (!res.ok || !data.ok || !data.orderId) {
        setServerError(data.error ?? "We couldn't place your order. Please try again.");
        return;
      }
      clear();
      router.push(`/orders/${data.orderId}`);
    } catch {
      setServerError("Network error — your card was not charged. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="card mt-6 p-10 text-center" data-testid="checkout-empty">
        <p className="text-lg font-semibold text-ink">There&apos;s nothing to check out yet</p>
        <Link href="/products" className="btn-primary mt-4">Browse products</Link>
      </div>
    );
  }

  const summary = (
    <dl className="space-y-2 text-sm">
      {items.map((i) => (
        <div key={`${i.productId}-${i.color}`} className="flex justify-between gap-4">
          <dt className="text-ink/80">
            {i.name} <span className="text-muted">× {i.quantity}</span>
          </dt>
          <dd className="text-ink">{formatMoney(i.unitPrice * i.quantity)}</dd>
        </div>
      ))}
      <div className="flex justify-between border-t border-line pt-2"><dt className="text-muted">Subtotal</dt><dd data-testid="sum-subtotal">{formatMoney(totals.subtotal)}</dd></div>
      {totals.discount > 0 ? (
        <div className="flex justify-between text-success"><dt>Discount ({coupon?.code})</dt><dd data-testid="sum-discount">−{formatMoney(totals.discount)}</dd></div>
      ) : null}
      <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd data-testid="sum-shipping">{totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted">Tax (8%)</dt><dd data-testid="sum-tax">{formatMoney(totals.tax)}</dd></div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink"><dt>Total</dt><dd data-testid="sum-total">{formatMoney(totals.total)}</dd></div>
    </dl>
  );

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
      <details className="card p-4 lg:hidden" data-testid="mobile-summary">
        <summary className="flex cursor-pointer items-center justify-between font-semibold text-ink">
          <span>Order summary</span>
          <span>{formatMoney(totals.total)}</span>
        </summary>
        <div className="mt-4">{summary}</div>
      </details>

      <form ref={formRef} onSubmit={submit} noValidate className="space-y-10" data-testid="checkout-form">
        <section aria-labelledby="contact-heading" className="space-y-4">
          <h2 id="contact-heading" className="text-xl font-semibold text-ink">Contact</h2>
          <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
        </section>

        <section aria-labelledby="shipping-heading" className="space-y-4">
          <h2 id="shipping-heading" className="text-xl font-semibold text-ink">Shipping address</h2>
          <Field id="fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={set("fullName")} error={errors.fullName} />
          <Field id="address" label="Street address" autoComplete="street-address" value={values.address} onChange={set("address")} error={errors.address} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="city" label="City" autoComplete="address-level2" value={values.city} onChange={set("city")} error={errors.city} />
            <Field id="postalCode" label="Postal code" autoComplete="postal-code" value={values.postalCode} onChange={set("postalCode")} error={errors.postalCode} />
          </div>
          <div>
            <label htmlFor="country" className="label">Country</label>
            <select id="country" name="country" autoComplete="country" value={values.country} onChange={set("country")} className="input" aria-invalid={!!errors.country || undefined}>
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            {errors.country ? <p className="field-error">{errors.country}</p> : null}
          </div>
        </section>

        <section aria-labelledby="delivery-heading" className="space-y-3">
          <h2 id="delivery-heading" className="text-xl font-semibold text-ink">Delivery</h2>
          <fieldset className="space-y-2">
            <legend className="sr-only">Delivery method</legend>
            {(["standard", "express"] as ShippingMethod[]).map((m) => (
              <label key={m} className={`flex cursor-pointer items-center justify-between rounded-md border p-3 ${shipping === m ? "border-ink bg-ink-50" : "border-line bg-white"}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="shippingMethod" value={m} checked={shipping === m} onChange={() => setShipping(m)} className="h-4 w-4 accent-ink" />
                  <span>
                    <span className="block text-sm font-medium capitalize text-ink">{m}</span>
                    <span className="block text-xs text-muted" data-testid={`eta-${m}`}>Arrives by {deliveryEstimate(m)}</span>
                  </span>
                </span>
                <span className="text-sm font-medium text-ink">
                  {m === "standard" && totals.subtotal >= 12000 ? "Free" : formatMoney(SHIPPING_RATES[m])}
                </span>
              </label>
            ))}
          </fieldset>
        </section>

        <section aria-labelledby="coupon-heading" className="space-y-3">
          <h2 id="coupon-heading" className="text-xl font-semibold text-ink">Promo code</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="coupon" className="sr-only">Promo code</label>
              <input id="coupon" name="coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="input uppercase" placeholder="e.g. GAUNTLET10" autoComplete="off" />
            </div>
            <button type="button" onClick={applyCoupon} className="btn-secondary" data-testid="apply-coupon">Apply</button>
          </div>
          {couponMessage ? (
            <p className={`text-sm ${coupon ? "text-success" : "text-danger"}`} role="status" data-testid="coupon-message">{couponMessage}</p>
          ) : null}
        </section>

        <section aria-labelledby="payment-heading" className="space-y-4">
          <h2 id="payment-heading" className="text-xl font-semibold text-ink">Payment</h2>
          <p className="text-sm text-muted">This is a demo store. Use card number 4242 4242 4242 4242 with any future expiry and any CVC.</p>
          <Field id="cardNumber" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={values.cardNumber} onChange={set("cardNumber")} error={errors.cardNumber} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="expiry" label="Expiry (MM/YY)" inputMode="numeric" autoComplete="cc-exp" placeholder="12/29" value={values.expiry} onChange={set("expiry")} error={errors.expiry} />
            <Field id="cvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={values.cvc} onChange={set("cvc")} error={errors.cvc} />
          </div>
        </section>

        {serverError ? (
          <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger" data-testid="checkout-error">{serverError}</p>
        ) : null}

        <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-64" disabled={submitting || !hydrated} data-testid="place-order">
          {submitting ? "Processing payment…" : `Place order · ${formatMoney(totals.total)}`}
        </button>
      </form>

      <aside className="card hidden h-fit p-5 lg:sticky lg:top-24 lg:block" aria-labelledby="summary-heading" data-testid="order-summary">
        <h2 id="summary-heading" className="mb-4 text-lg font-semibold text-ink">Order summary</h2>
        {summary}
      </aside>
    </div>
  );
}
