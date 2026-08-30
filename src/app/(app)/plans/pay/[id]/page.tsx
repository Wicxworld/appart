import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatUsd } from "@/lib/format";
import { getPlan, planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import type { SubscriptionPaymentRow } from "@/lib/types";
import { PaymentPanel } from "./payment-panel";

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: payment } = await supabase
    .from("subscription_payments")
    .select(
      "id, user_id, plan, amount_usd, method, reference, status, payer_note, reviewed_by, reviewed_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!payment || payment.user_id !== user.id) {
    notFound();
  }

  const row = payment as SubscriptionPaymentRow;
  const plan = getPlan(row.plan);

  return (
    <main>
      <PageHeader
        kicker="Checkout"
        title={planLabel(row.plan)}
        description={`${formatUsd(row.amount_usd) ?? plan?.priceLabel} USD monthly. Send Bitcoin or a Lead Bank transfer using the reference below. Membership is granted only after an operator confirms.`}
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
        <PaymentPanel payment={row} />
      </div>
    </main>
  );
}
