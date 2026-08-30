"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatUsd } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import {
  methodLabel,
  paymentStatusLabel,
  payouts,
  type PaymentMethod,
} from "@/lib/payouts";
import { CopyField } from "@/components/copy-field";
import { StatusPill } from "@/components/status-pill";
import { markPaymentSent } from "../../../actions";
import type { SubscriptionPaymentRow } from "@/lib/types";

export function PaymentPanel({
  payment,
  method,
}: {
  payment: SubscriptionPaymentRow;
  method: PaymentMethod;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    form.set("payment_id", payment.id);
    form.set("method", method);
    const result = await markPaymentSent(form);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  if (payment.status !== "awaiting_payment") {
    return <PaymentThankYou payment={payment} />;
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink/10 bg-paper p-8 lg:p-10">
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

      <div className="mt-10 space-y-5">
        <CopyField
          label="APPART reference"
          value={payment.reference}
          hint="Include this exact reference with the transfer so we can match it."
        />

        {method === "btc" ? (
          <>
            <CopyField label="BTC address" value={payouts.btc.address} />
            <div className="border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm leading-6 text-red-900">
              {payouts.btc.warning}
            </div>
          </>
        ) : (
          <>
            <CopyField label="Bank" value={payouts.bank.bankName} />
            <CopyField label="Account name" value={payouts.bank.accountName} />
            <CopyField
              label="Account number"
              value={payouts.bank.accountNumber}
            />
          </>
        )}
      </div>

      <div className="mt-10">
        <label
          htmlFor="payer_note"
          className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted"
        >
          Optional note
        </label>
        <textarea
          id="payer_note"
          name="payer_note"
          rows={3}
          defaultValue={payment.payer_note ?? ""}
          placeholder="Transaction hash, sender name, or the time you sent it."
          className="w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-bronze"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-8 border border-red-800/20 bg-red-800/5 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-10 w-full bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-bronze hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Recording..." : "I've paid"}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Paying with {methodLabel(method)}. Your plan is not activated until we
        confirm {payment.reference}.
      </p>
    </form>
  );
}

export function PaymentThankYou({
  payment,
}: {
  payment: SubscriptionPaymentRow;
}) {
  const copy = thankYouCopy(payment.status);

  return (
    <div className="border border-ink/10 bg-paper p-8 lg:p-10">
      <StatusPill status={payment.status} />
      <h2 className="mt-6 font-display text-4xl">{copy.title}</h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted">{copy.body}</p>
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
        <CopyField label="APPART reference" value={payment.reference} />
      </div>
    </div>
  );
}

function thankYouCopy(status: string) {
  if (status === "pending_review") {
    return {
      title: "Thank you. We have your payment.",
      body: "An Appart operator will confirm the transfer. Your plan stays unpaid until then — do not send again unless we ask.",
    };
  }
  if (status === "paid") {
    return {
      title: "Payment confirmed.",
      body: "This membership is now active on your profile.",
    };
  }
  if (status === "rejected") {
    return {
      title: "This payment was not confirmed.",
      body: "Open Plans to start a new Bitcoin or Lead Bank transfer if you still want this membership.",
    };
  }
  return {
    title: "This payment was cancelled.",
    body: "Open Plans to start a new Bitcoin or Lead Bank transfer if you still want this membership.",
  };
}
