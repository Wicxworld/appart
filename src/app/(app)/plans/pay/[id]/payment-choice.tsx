import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { CopyField } from "@/components/copy-field";
import { StatusPill } from "@/components/status-pill";
import type { SubscriptionPaymentRow } from "@/lib/types";

export function PaymentChoice({ payment }: { payment: SubscriptionPaymentRow }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Amount due
          </p>
          <p className="mt-3 font-display text-5xl">
            {formatUsd(payment.amount_usd)}
          </p>
          <p className="mt-2 text-sm text-muted">
            {planLabel(payment.plan)} · USD / month
          </p>
        </div>
        <StatusPill status={payment.status} />
      </div>

      <div className="mt-10">
        <CopyField
          label="APPART reference"
          value={payment.reference}
          hint="Include this exact reference with the transfer so we can match it."
        />
      </div>

      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-muted">
        Choose how to pay
      </p>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <Link
          href={`/plans/pay/${payment.id}/bank`}
          className="group flex min-h-[280px] flex-col border border-ink/10 bg-paper p-10 transition hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Bank transfer
          </p>
          <p className="mt-6 font-display text-4xl sm:text-5xl">Lead Bank</p>
          <p className="mt-4 flex-1 text-sm leading-6 text-muted transition group-hover:text-ivory/70">
            Send a transfer to our Lead Bank account. Use the APPART reference
            as the narration so we can match it.
          </p>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em]">
            Pay with bank
          </p>
        </Link>
        <Link
          href={`/plans/pay/${payment.id}/btc`}
          className="group flex min-h-[280px] flex-col border border-ink/10 bg-paper p-10 transition hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Bitcoin
          </p>
          <p className="mt-6 font-display text-4xl sm:text-5xl">BTC on-chain</p>
          <p className="mt-4 flex-1 text-sm leading-6 text-muted transition group-hover:text-ivory/70">
            Send Bitcoin only to our bc1 address. Other coins or networks cannot
            be recovered.
          </p>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em]">
            Pay with Bitcoin
          </p>
        </Link>
      </div>
    </div>
  );
}
