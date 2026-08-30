"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmSubscriptionPayment,
  rejectSubscriptionPayment,
} from "./actions";

export function PaymentReview({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"confirm" | "reject" | null>(null);

  async function run(kind: "confirm" | "reject") {
    setError("");
    setLoading(kind);
    const result =
      kind === "confirm"
        ? await confirmSubscriptionPayment(id)
        : await rejectSubscriptionPayment(id);
    setLoading(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => run("confirm")}
          className="bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-bronze hover:text-ink disabled:opacity-50"
        >
          {loading === "confirm" ? "Confirming..." : "Confirm"}
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => run("reject")}
          className="border border-ink/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted transition hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
      {error ? <p className="max-w-[12rem] text-right text-xs text-red-900">{error}</p> : null}
    </div>
  );
}
