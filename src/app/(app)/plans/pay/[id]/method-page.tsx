import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getPlan } from "@/lib/plans";
import { type PaymentMethod } from "@/lib/payouts";
import { PageHeader } from "@/components/page-header";
import { loadOwnedPayment } from "./load-payment";
import { MethodInstructions } from "./method-instructions";
import { PaymentStatus } from "./payment-status";

export async function MethodPage({
  id,
  method,
}: {
  id: string;
  method: PaymentMethod;
}) {
  const payment = await loadOwnedPayment(id);
  const plan = getPlan(payment.plan);
  const amount = formatUsd(payment.amount_usd) ?? plan?.priceLabel;
  const isBank = method === "bank";

  return (
    <main>
      <PageHeader
        kicker={isBank ? "Lead Bank" : "Bitcoin"}
        title={isBank ? "Bank transfer" : "Send Bitcoin"}
        description={
          isBank
            ? `${amount} USD monthly. Transfer to Lead Bank using the APPART reference. Membership is granted only after an operator confirms.`
            : `${amount} USD monthly. Send Bitcoin only to the bc1 address below. Membership is granted only after an operator confirms.`
        }
        action={
          <Link
            href={`/plans/pay/${payment.id}`}
            className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            Choose another method
          </Link>
        }
      />
      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
        {payment.status === "awaiting_payment" ? (
          <MethodInstructions payment={payment} method={method} />
        ) : (
          <PaymentStatus payment={payment} />
        )}
      </div>
    </main>
  );
}
