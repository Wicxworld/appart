"use client";

import { FormEvent, useState } from "react";
import { createSearchRequest } from "./actions";

const field =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze";

export function SearchForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const result = await createSearchRequest(new FormData(form));

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            placeholder="New York"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="budget_max" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            Max monthly rent (USD)
          </label>
          <input
            id="budget_max"
            name="budget_max"
            type="number"
            min="0"
            placeholder="4500"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="bedrooms" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            placeholder="2"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted">
            The brief
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Doorman, in-unit laundry, near the subway, unfurnished..."
            className={field}
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening search..." : "Open a search"}
      </button>
    </form>
  );
}
