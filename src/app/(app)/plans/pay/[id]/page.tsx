import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getPlan, planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { loadOwnedPayment } from "./load-payment";
import { PaymentChoice } from "./payment-choice";
import { PaymentStatus } from "./payment-status";

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await loadOwnedPayment(id);
  const plan = getPlan(payment.plan);
  const amount = formatUsd(payment.amount_usd) ?? plan?.priceLabel;

  return (
    <main>
      <PageHeader
        kicker="Checkout"
        title={planLabel(payment.plan)}
        description={
          payment.status === "awaiting_payment"
            ? `${amount} USD monthly. Choose Bitcoin or a Lead Bank transfer. Membership is granted only after an operator confirms.`
            : `${amount} USD monthly. Membership is granted only after an operator confirms.`
        }
        action={
          <Link
            href="/plans"
            className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            Back to plans
          </Link>
        }
      />
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
        {payment.status === "awaiting_payment" ? (
          <PaymentChoice payment={payment} />
        ) : (
          <div className="mx-auto max-w-3xl">
            <PaymentStatus payment={payment} />
          </div>
        )}
      </div>
    </main>
  );
}
