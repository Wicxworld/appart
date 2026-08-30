import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { paymentStatusLabel } from "@/lib/payouts";
import { StatusPill } from "@/components/status-pill";
import type { SubscriptionPaymentRow } from "@/lib/types";

export function PendingPaymentCard({
  payment,
}: {
  payment: Pick<
    SubscriptionPaymentRow,
    "id" | "plan" | "amount_usd" | "reference" | "status"
  >;
}) {
  const awaiting = payment.status === "awaiting_payment";

  return (
    <div className="mb-12 border border-bronze/30 bg-paper p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Open payment
          </p>
          <p className="mt-3 font-display text-3xl">
            {planLabel(payment.plan)} · {formatUsd(payment.amount_usd)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            {awaiting
              ? "Finish the transfer, then tell us you have sent it. Membership stays unpaid until an operator confirms."
              : "Thank you. We have your payment and will confirm it once the transfer is visible. Membership stays unpaid until then."}
          </p>
          <p className="mt-4 text-sm">
            Reference <span className="font-medium">{payment.reference}</span>
          </p>
        </div>
        <StatusPill status={payment.status} />
      </div>
      <Link
        href={`/plans/pay/${payment.id}`}
        className="mt-8 inline-block bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-bronze hover:text-ink"
      >
        {awaiting ? "Continue payment" : paymentStatusLabel(payment.status)}
      </Link>
    </div>
  );
}
