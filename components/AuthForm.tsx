"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const target = next && next.startsWith("/") ? next : "/account";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && name.trim().length < 2) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(target);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login" ? (
          <>New here? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-ink underline">Create an account</Link>.</>
        ) : (
          <>Already have one? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-ink underline">Log in</Link>.</>
        )}
      </p>
      <form onSubmit={submit} noValidate className="card mt-8 space-y-4 p-6" data-testid="auth-form">
        {mode === "signup" ? (
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          {mode === "signup" ? <p className="mt-1 text-xs text-muted">At least 8 characters.</p> : null}
        </div>
        {error ? (
          <p role="alert" className="text-sm text-danger" data-testid="auth-error">{error}</p>
        ) : null}
        <button type="submit" className="btn-primary w-full" disabled={busy} data-testid="auth-submit">
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
        {mode === "login" ? (
          <p className="text-center text-xs text-muted">Demo account: demo@gauntlet.shop / password123</p>
        ) : null}
      </form>
    </div>
  );
}
