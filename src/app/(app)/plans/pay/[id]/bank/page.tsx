import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getPlan, planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { loadOwnedPayment } from "../load-payment";
import { PaymentPanel } from "../payment-panel";

export default async function BankPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { payment } = await loadOwnedPayment(id);
  const plan = getPlan(payment.plan);
  const awaiting = payment.status === "awaiting_payment";

  return (
    <main>
      <PageHeader
        kicker="Bank transfer"
        title="Lead Bank"
        description={`${planLabel(payment.plan)} · ${formatUsd(payment.amount_usd) ?? plan?.priceLabel} USD. Send the exact amount and include your Appart reference.`}
        action={
          <Link
            href={awaiting ? `/plans/pay/${payment.id}` : "/plans"}
            className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            {awaiting ? "Choose another method" : "Back to plans"}
          </Link>
        }
      />
      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
        <PaymentPanel payment={payment} method="bank" />
      </div>
    </main>
  );
}
