"use client";

import { useState } from "react";

export function NewsletterForm({ subscribedEmail }: { subscribedEmail: string | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (subscribedEmail && status !== "done") {
    return (
      <p className="text-sm text-white/80" data-testid="newsletter-subscribed">
        You&apos;re subscribed as <span className="font-semibold text-white">{subscribedEmail}</span>.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      setMessage("Thanks! Check your inbox for a welcome note.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-white" role="status" data-testid="newsletter-success">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-2 sm:flex-row" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input flex-1 border-transparent"
        aria-describedby={message ? "newsletter-message" : undefined}
        aria-invalid={status === "error" || undefined}
      />
      <button type="submit" className="btn bg-amber text-ink hover:bg-amber/90" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {message ? (
        <p id="newsletter-message" role="alert" className="basis-full text-sm text-amber">
          {message}
        </p>
      ) : null}
    </form>
  );
}
