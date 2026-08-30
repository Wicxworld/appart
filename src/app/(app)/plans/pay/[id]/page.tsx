import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getPlan, planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { CopyField } from "@/components/copy-field";
import { loadOwnedPayment } from "./load-payment";
import { PaymentThankYou } from "./payment-panel";

export default async function PayMethodChoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { payment } = await loadOwnedPayment(id);
  const plan = getPlan(payment.plan);

  if (payment.status !== "awaiting_payment") {
    return (
      <main>
        <PageHeader
          kicker="Checkout"
          title={planLabel(payment.plan)}
          description={`${formatUsd(payment.amount_usd) ?? plan?.priceLabel} USD monthly. Membership is granted only after an operator confirms.`}
          action={
            <Link
              href="/plans"
              className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
            >
              Back to plans
            </Link>
          }
        />
        <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
          <PaymentThankYou payment={payment} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        kicker="Checkout"
        title="Choose how to pay"
        description={`${planLabel(payment.plan)} · ${formatUsd(payment.amount_usd) ?? plan?.priceLabel} USD. Pay with one method only — bank transfer or Bitcoin.`}
        action={
          <Link
            href="/plans"
            className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            Back to plans
          </Link>
        }
      />
      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-4 border border-ink/10 bg-paper p-8 sm:flex-row sm:items-end sm:justify-between">
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

        <div className="mt-8">
          <CopyField
            label="Your reference"
            value={payment.reference}
            hint="Keep this reference. You will include it with whichever method you choose."
          />
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-muted">
          Pay with either method
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/plans/pay/${payment.id}/bank`}
            className="group border border-ink/10 bg-paper p-8 transition hover:border-ink hover:bg-ink hover:text-ivory"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
              Bank transfer
            </p>
            <p className="mt-4 font-display text-4xl">Lead Bank</p>
            <p className="mt-4 text-sm leading-6 text-muted transition group-hover:text-ivory/70">
              Account name, account number, and your unique reference — shown only on the next page.
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze">
              Pay by bank
            </p>
          </Link>
          <Link
            href={`/plans/pay/${payment.id}/btc`}
            className="group border border-ink/10 bg-paper p-8 transition hover:border-ink hover:bg-ink hover:text-ivory"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
              Bitcoin
            </p>
            <p className="mt-4 font-display text-4xl">BTC on-chain</p>
            <p className="mt-4 text-sm leading-6 text-muted transition group-hover:text-ivory/70">
              Bitcoin address, network warning, and your unique reference — shown only on the next page.
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze">
              Pay with Bitcoin
            </p>
          </Link>
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-muted">
          Choose one method. Do not send both a bank transfer and Bitcoin for the same reference.
        </p>
      </div>
    </main>
  );
}
