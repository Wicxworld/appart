import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { formatDateTime, formatUsd } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { methodLabel } from "@/lib/payouts";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import type { SubscriptionPaymentRow } from "@/lib/types";
import { PaymentReview } from "./payment-review";

type RecentSearch = {
  id: string;
  city: string;
  budget_max: number | null;
  bedrooms: number | null;
  status: string;
  created_at: string;
  user_id: string;
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isAdminUser({ email: user.email }, profile)) {
    notFound();
  }

  const [usersRes, searchesRes, listingsRes, recentRes, paymentsRes] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("search_requests").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase
        .from("search_requests")
        .select("id, city, budget_max, bedrooms, status, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("subscription_payments")
        .select(
          "id, user_id, plan, amount_usd, method, reference, status, payer_note, created_at",
        )
        .in("status", ["pending_review", "awaiting_payment"])
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

  const recent = (recentRes.data ?? []) as RecentSearch[];
  const payments = (paymentsRes.data ?? []) as Array<
    Pick<
      SubscriptionPaymentRow,
      | "id"
      | "user_id"
      | "plan"
      | "amount_usd"
      | "method"
      | "reference"
      | "status"
      | "payer_note"
      | "created_at"
    >
  >;

  const payerIds = [...new Set(payments.map((row) => row.user_id))];
  const { data: payers } =
    payerIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", payerIds)
      : { data: [] };

  const payerNames = new Map(
    (payers ?? []).map((row) => [row.id as string, (row.full_name as string | null) ?? "Member"]),
  );

  return (
    <main>
      <PageHeader
        kicker="Operators"
        title="Admin"
        description="A quiet view of the book: members, briefs, inventory, and manual membership payments. This page is visible only to allowlisted Appart operators."
      />
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["Members", usersRes.count ?? 0],
            ["Searches", searchesRes.count ?? 0],
            ["Listings", listingsRes.count ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="border border-ink/10 bg-paper p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
                {label}
              </p>
              <p className="mt-4 font-display text-5xl">{value}</p>
            </div>
          ))}
        </div>

        <section id="payments" className="mt-14 scroll-mt-28">
          <h2 className="font-display text-3xl">Payments</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Confirm a Bitcoin or Lead Bank transfer to grant the membership plan.
            Reject if the reference or amount does not match.
          </p>
          {payments.length === 0 ? (
            <p className="mt-6 border border-dashed border-ink/15 px-6 py-12 text-muted">
              No payments waiting.
            </p>
          ) : (
            <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-medium">Member</th>
                    <th className="px-5 py-4 font-medium">Plan</th>
                    <th className="px-5 py-4 font-medium">Method</th>
                    <th className="px-5 py-4 font-medium">Reference</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Opened</th>
                    <th className="px-5 py-4 font-medium"> </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((row) => (
                    <tr key={row.id} className="border-t border-ink/10 align-top">
                      <td className="px-5 py-4">
                        <p>{payerNames.get(row.user_id) ?? "Member"}</p>
                        {row.payer_note ? (
                          <p className="mt-1 max-w-[14rem] text-xs text-muted">
                            {row.payer_note}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        {planLabel(row.plan)}
                        <span className="block text-muted">
                          {formatUsd(row.amount_usd)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {methodLabel(row.method)}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">
                        {row.reference}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatDateTime(row.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <PaymentReview id={row.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl">Recent search requests</h2>
          {recent.length === 0 ? (
            <p className="mt-6 border border-dashed border-ink/15 px-6 py-12 text-muted">
              No briefs yet.
            </p>
          ) : (
            <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-medium">City</th>
                    <th className="px-5 py-4 font-medium">Budget</th>
                    <th className="px-5 py-4 font-medium">Beds</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Opened</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr key={row.id} className="border-t border-ink/10">
                      <td className="px-5 py-4">
                        <Link
                          href={`/searches/${row.id}`}
                          className="underline decoration-bronze/50 underline-offset-4 hover:text-bronze"
                        >
                          {row.city}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatUsd(row.budget_max) ?? "-"}
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {row.bedrooms ?? "-"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatDateTime(row.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-12 max-w-2xl text-sm leading-6 text-muted">
          Admin-only. Matching and inventory ingest are still follow-up work.
          Counts and payment review use the signed-in server client with admin
          RLS — nothing here elevates to the service role.
        </p>
      </div>
    </main>
  );
}
