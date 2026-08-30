import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { formatDateTime, formatUsd } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";

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

  const [usersRes, searchesRes, listingsRes, recentRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("search_requests").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase
      .from("search_requests")
      .select("id, city, budget_max, bedrooms, status, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const recent = (recentRes.data ?? []) as RecentSearch[];

  return (
    <main>
      <PageHeader
        kicker="Operators"
        title="Admin"
        description="A quiet view of the book: members, briefs, and inventory. This page is visible only to allowlisted Appart operators."
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
          Admin-only. Matching, inventory ingest, and Stripe are still follow-up
          work. Counts use the signed-in server client with admin RLS - nothing
          here elevates to the service role.
        </p>
      </div>
    </main>
  );
}
