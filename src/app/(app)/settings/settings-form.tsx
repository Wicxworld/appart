"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateNotificationPrefs } from "../actions";

export function SettingsForm({
  notificationEmail,
  notificationMatches,
}: {
  notificationEmail: boolean;
  notificationMatches: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    const result = await updateNotificationPrefs(new FormData(event.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="space-y-16">
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-5">
          <legend className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Notifications
          </legend>
          <label className="flex items-start gap-4 border border-ink/10 bg-ivory px-5 py-4">
            <input
              type="checkbox"
              name="notification_email"
              defaultChecked={notificationEmail}
              className="mt-1 accent-bronze"
            />
            <span>
              <span className="block text-sm">Account email</span>
              <span className="mt-1 block text-sm text-muted">
                Occasional updates about your membership and search.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-4 border border-ink/10 bg-ivory px-5 py-4">
            <input
              type="checkbox"
              name="notification_matches"
              defaultChecked={notificationMatches}
              className="mt-1 accent-bronze"
            />
            <span>
              <span className="block text-sm">Match alerts</span>
              <span className="mt-1 block text-sm text-muted">
                Email when a qualifying residence is found.
              </span>
            </span>
          </label>
        </fieldset>
        {error ? (
          <div role="alert" className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        ) : null}
        {saved ? <p className="text-sm text-forest">Preferences saved.</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save preferences"}
        </button>
      </form>

      <section>
        <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
          Session
        </p>
        <p className="mt-3 max-w-lg text-sm text-muted">
          Sign out on this device. Your searches stay on the account.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 border border-ink/20 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] transition hover:border-ink hover:bg-ink hover:text-ivory"
        >
          Sign out
        </button>
      </section>

      <section className="border border-ink/10 bg-ivory p-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
          Danger zone
        </p>
        <p className="mt-4 font-display text-2xl">Close this account</p>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
          Account deletion is not available yet. Reach out if you need a search
          paused in the meantime.
        </p>
        <button
          type="button"
          disabled
          className="mt-6 cursor-not-allowed border border-ink/15 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted"
        >
          Coming soon
        </button>
      </section>
    </div>
  );
}
