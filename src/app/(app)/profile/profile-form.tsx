"use client";

import { FormEvent, useState } from "react";
import { updateDisplayName } from "../actions";

const field =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze";

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    const result = await updateDisplayName(new FormData(event.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-8">
      <div>
        <label htmlFor="full_name" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
          Display name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultName}
          className={field}
        />
      </div>
      {error ? (
        <div role="alert" className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      ) : null}
      {saved ? (
        <p className="text-sm text-forest">Name saved.</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save name"}
      </button>
    </form>
  );
}
