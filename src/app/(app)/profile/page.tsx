import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import type { SubscriptionPaymentRow } from "@/lib/types";
import { ProfileForm } from "./profile-form";
import { PendingPaymentCard } from "../plans/pending-payment-card";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const [{ data: profile }, { data: openRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, plan, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("subscription_payments")
      .select("id, plan, amount_usd, reference, status")
      .eq("user_id", user.id)
      .in("status", ["awaiting_payment", "pending_review"])
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const pending = ((openRows ?? [])[0] ?? null) as Pick<
    SubscriptionPaymentRow,
    "id" | "plan" | "amount_usd" | "reference" | "status"
  > | null;

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "") ||
    "";

  return (
    <main>
      <PageHeader
        kicker="Account"
        title="Profile"
        description="How you appear on Appart, and when you joined the search."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_20rem] lg:px-10">
        <div>
          {pending ? (
            <div className="mb-10">
              <PendingPaymentCard payment={pending} />
            </div>
          ) : null}
          <section className="border border-ink/10 bg-paper p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
              Details
            </p>
            <div className="mt-8">
              <ProfileForm defaultName={displayName} />
            </div>
            <dl className="mt-12 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Email
                </dt>
                <dd className="mt-2 text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Member since
                </dt>
                <dd className="mt-2 text-sm">
                  {formatDate(profile?.created_at ?? user.created_at)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="border border-ink/10 bg-paper p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Membership
          </p>
          <p className="mt-4 font-display text-3xl">{planLabel(profile?.plan)}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            {pending
              ? "You have a payment waiting. Plan access is granted after an operator confirms the transfer."
              : "Pay by Bitcoin or Lead Bank transfer. Plan access is granted after confirmation."}
          </p>
          <a
            href="/plans"
            className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            Manage plan
          </a>
        </aside>
      </div>
    </main>
  );
}
