"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/auth";

const COUNTRIES = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["GB", "United Kingdom"],
  ["DE", "Germany"],
  ["NL", "Netherlands"],
  ["AU", "Australia"],
];

export function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(profile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="card mt-4 space-y-5 p-6" data-testid="settings-form">
      <div>
        <label htmlFor="displayName" className="label">Display name</label>
        <input id="displayName" name="displayName" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="input" placeholder="How we greet you" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="defaultCity" className="label">Default city</label>
          <input id="defaultCity" name="defaultCity" value={form.defaultCity} onChange={(e) => setForm({ ...form, defaultCity: e.target.value })} className="input" />
        </div>
        <div>
          <label htmlFor="defaultCountry" className="label">Default country</label>
          <select id="defaultCountry" name="defaultCountry" value={form.defaultCountry} onChange={(e) => setForm({ ...form, defaultCountry: e.target.value })} className="input">
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-ink">
        <input type="checkbox" name="marketingEmails" checked={form.marketingEmails} onChange={(e) => setForm({ ...form, marketingEmails: e.target.checked })} className="mt-0.5 h-4 w-4 accent-ink" />
        <span>
          Email me about new products and offers
          <span className="block text-xs text-muted">Twice a month at most.</span>
        </span>
      </label>
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === "saving"} data-testid="save-settings">
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" ? <p role="status" className="text-sm text-success" data-testid="settings-saved">Saved.</p> : null}
        {status === "error" ? <p role="alert" className="text-sm text-danger">Couldn&apos;t save. Try again.</p> : null}
      </div>
    </form>
  );
}
