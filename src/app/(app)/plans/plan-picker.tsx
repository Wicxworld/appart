"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { membershipPlans, type PlanId } from "@/lib/plans";
import { startPlanPayment } from "../actions";

export function PlanPicker({
  currentPlan,
  pendingPayment,
}: {
  currentPlan: string | null;
  pendingPayment: { id: string; plan: string; status: string } | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelect(planId: PlanId) {
    setError("");
    setLoading(planId);
    const result = await startPlanPayment(planId);
    setLoading(null);
    if (result.error && !result.id) {
      setError(result.error);
      return;
    }
    if (result.id) {
      router.push(`/plans/pay/${result.id}`);
      router.refresh();
    }
  }

  return (
    <div>
      {error ? (
        <div
          role="alert"
          className="mb-8 border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-3">
        {membershipPlans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const pendingForPlan = pendingPayment?.plan === plan.id;
          const awaiting = pendingForPlan && pendingPayment?.status === "awaiting_payment";
          const reviewing = pendingForPlan && pendingPayment?.status === "pending_review";

          let label = `Pay ${plan.name}`;
          if (loading === plan.id) label = "Opening...";
          else if (reviewing) label = "Awaiting review";
          else if (awaiting) label = "Continue payment";
          else if (isCurrent) label = "Current plan";

          return (
            <article
              key={plan.id}
              className={
                plan.featured
                  ? "bg-ink px-8 py-10 text-ivory"
                  : "border border-ink/10 bg-paper px-8 py-10"
              }
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
                {plan.name}
              </p>
              <p className="mt-6 font-display text-5xl">{plan.priceLabel}</p>
              <p
                className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${
                  plan.featured ? "text-ivory/50" : "text-muted"
                }`}
              >
                USD / month
              </p>
              <p
                className={`mt-4 text-sm leading-6 ${
                  plan.featured ? "text-ivory/70" : "text-muted"
                }`}
              >
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="text-bronze">—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={loading === plan.id}
                onClick={() => handleSelect(plan.id)}
                className={
                  plan.featured
                    ? "mt-10 block w-full bg-bronze px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-ivory disabled:opacity-50"
                    : "mt-10 block w-full bg-ink px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-bronze hover:text-ink disabled:opacity-50"
                }
              >
                {label}
              </button>
              {isCurrent && !pendingForPlan ? (
                <p
                  className={`mt-4 text-center text-xs ${
                    plan.featured ? "text-ivory/60" : "text-muted"
                  }`}
                >
                  Confirmed on your profile. Pay again to renew.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
