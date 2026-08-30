"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { photos } from "@/lib/photos";

const field =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage(
        "Account created. Check your email to verify your account before signing in.",
      );
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell image={photos.penthouse} caption="A private search for the home you actually want.">
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
        Membership
      </p>
      <h1 className="mt-4 font-display text-4xl">Open an account</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Start a personalized apartment search with Appart.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-7">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={field}
            placeholder="Your full name"
          />
        </div>

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
          <label htmlFor="password" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={field}
            placeholder="At least 8 characters"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already a member?{" "}
        <Link href="/auth/sign-in" className="text-ink underline decoration-bronze underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
