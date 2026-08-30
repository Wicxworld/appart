"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { photos } from "@/lib/photos";

const field =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage(
        "If an account exists for that email, a password reset link has been sent.",
      );
    } catch {
      setError("Unable to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell image={photos.kitchen} caption="We will send a quiet reset link to your email.">
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
        Account
      </p>
      <h1 className="mt-4 font-display text-4xl">Reset your password</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Enter your email and we will send a secure reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-7">
        <div>
          <label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <div role="alert" className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="border border-forest/20 bg-forest/5 px-4 py-3 text-sm text-forest">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Remembered it?{" "}
        <Link href="/auth/sign-in" className="text-ink underline decoration-bronze underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
