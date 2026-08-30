"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { photos } from "@/lib/photos";

const field =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell image={photos.tower} caption="Return to a search that is still looking.">
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
        Members
      </p>
      <h1 className="mt-4 font-display text-4xl">Welcome back</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Sign in to manage your apartment search.
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

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-[11px] uppercase tracking-[0.22em] text-muted">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] uppercase tracking-[0.18em] text-bronze hover:text-ink"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={field}
            placeholder="Your password"
          />
        </div>

        {error && (
          <div role="alert" className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        New here?{" "}
        <Link href="/auth/sign-up" className="text-ink underline decoration-bronze underline-offset-4">
          Open an account
        </Link>
      </p>
    </AuthShell>
  );
}
