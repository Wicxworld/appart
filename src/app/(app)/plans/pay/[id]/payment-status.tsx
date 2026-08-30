import { formatUsd } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { methodLabel, paymentStatusLabel } from "@/lib/payouts";
import { CopyField } from "@/components/copy-field";
import { StatusPill } from "@/components/status-pill";
import type { SubscriptionPaymentRow } from "@/lib/types";

export function PaymentStatus({ payment }: { payment: SubscriptionPaymentRow }) {
  let title = "Thank you. We have your payment.";
  let body =
    "An Appart operator will confirm the transfer. Your plan stays unpaid until then — do not send again unless we ask.";

  if (payment.status === "paid") {
    title = "Payment confirmed.";
    body = "This membership is now active on your profile.";
  } else if (payment.status === "rejected") {
    title = "This payment was not confirmed.";
    body =
      "Open Plans to start a new Bitcoin or Lead Bank transfer if you still want this membership.";
  } else if (payment.status === "cancelled") {
    title = "This payment was cancelled.";
    body =
      "Open Plans to start a new Bitcoin or Lead Bank transfer if you still want this membership.";
  }

  return (
    <div className="border border-ink/10 bg-paper p-8 lg:p-10">
      <StatusPill status={payment.status} />
      <h2 className="mt-6 font-display text-4xl">{title}</h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted">{body}</p>
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Plan
          </dt>
          <dd className="mt-2 text-sm">{planLabel(payment.plan)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Amount
          </dt>
          <dd className="mt-2 text-sm">{formatUsd(payment.amount_usd)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Method
          </dt>
          <dd className="mt-2 text-sm">{methodLabel(payment.method)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Status
          </dt>
          <dd className="mt-2 text-sm">{paymentStatusLabel(payment.status)}</dd>
        </div>
      </dl>
      <div className="mt-8">
        <CopyField label="Payment reference" value={payment.reference} />
      </div>
    </div>
  );
}
