import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { planLabel } from "@/lib/plans";
import { payouts, paymentStatusLabel } from "@/lib/payouts";
import { PageHeader } from "@/components/page-header";
import { CopyField } from "@/components/copy-field";
import type { SubscriptionPaymentRow } from "@/lib/types";
import { PlanPicker } from "./plan-picker";
import { PendingPaymentCard } from "./pending-payment-card";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const [{ data: profile }, { data: openRows }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase
      .from("subscription_payments")
      .select(
        "id, user_id, plan, amount_usd, method, reference, status, payer_note, reviewed_by, reviewed_at, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .in("status", ["awaiting_payment", "pending_review"])
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const pending = ((openRows ?? [])[0] ?? null) as SubscriptionPaymentRow | null;

  return (
    <main>
      <PageHeader
        kicker="Membership"
        title="Plans"
        description={`Current membership: ${planLabel(profile?.plan)}. Choose a plan, then pay by Bitcoin or Lead Bank transfer. Membership stays unpaid until an operator confirms the payment.`}
      />
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {pending ? <PendingPaymentCard payment={pending} /> : null}
        <PlanPicker
          currentPlan={profile?.plan ?? null}
          pendingPayment={
            pending
              ? { id: pending.id, plan: pending.plan, status: pending.status }
              : null
          }
        />

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="border border-ink/10 bg-paper p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
              Bitcoin
            </p>
            <p className="mt-3 font-display text-2xl">{payouts.btc.network}</p>
            <div className="mt-6">
              <CopyField label="BTC address" value={payouts.btc.address} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {payouts.btc.warning}
            </p>
          </div>
          <div className="border border-ink/10 bg-paper p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
              Bank transfer
            </p>
            <p className="mt-3 font-display text-2xl">{payouts.bank.bankName}</p>
            <div className="mt-6 space-y-5">
              <CopyField label="Account name" value={payouts.bank.accountName} />
              <CopyField
                label="Account number"
                value={payouts.bank.accountNumber}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Include the unique APPART reference from checkout so we can match
              your transfer. Status: {pending ? paymentStatusLabel(pending.status) : "no open payment"}.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
