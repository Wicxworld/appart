"use client";

import { FormEvent, useState } from "react";
import { createSearchRequest } from "./actions";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-2 block text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            placeholder="Lagos"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400"
          />
        </div>

        <div>
          <label htmlFor="budget_max" className="mb-2 block text-sm font-medium">
            Max yearly rent (USD)
          </label>
          <input
            id="budget_max"
            name="budget_max"
            type="number"
            min="0"
            placeholder="2500"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400"
          />
        </div>

        <div>
          <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            placeholder="2"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Requirements
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Estate, generator, close to the island, unfurnished..."
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting search..." : "Start search"}
      </button>
    </form>
  );
}
