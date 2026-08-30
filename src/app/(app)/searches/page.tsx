import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { SearchCard } from "@/components/search-card";
import type { SearchRequestRow, SearchRunRow } from "@/lib/types";

export default async function SearchesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const { q, city } = await searchParams;
  const query = (q || city || "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  let request = supabase
    .from("search_requests")
    .select("id, city, budget_max, bedrooms, notes, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (query) {
    request = request.ilike("city", `%${query}%`);
  }

  const { data: searches } = await request;
  const searchList = (searches ?? []) as SearchRequestRow[];
  const searchIds = searchList.map((search) => search.id);
  const runsBySearch = new Map<string, SearchRunRow>();

  if (searchIds.length > 0) {
    const { data: runs } = await supabase
      .from("search_runs")
      .select(
        "id, search_request_id, status, listings_scanned, matches_found, log, started_at, finished_at",
      )
      .in("search_request_id", searchIds)
      .order("started_at", { ascending: false });

    for (const run of (runs ?? []) as SearchRunRow[]) {
      if (!runsBySearch.has(run.search_request_id)) {
        runsBySearch.set(run.search_request_id, run);
      }
    }
  }

  return (
    <main>
      <PageHeader
        kicker="Your briefs"
        title="Searches"
        description={
          query
            ? `Showing searches matching "${query}".`
            : "Every brief you have opened, with the latest run status."
        }
        action={
          <Link
            href="/dashboard"
            className="bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-bronze hover:text-ink"
          >
            New search
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {searchList.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-6 py-16 text-center text-muted">
            {query
              ? "No searches match that city yet. Open a new brief from the dashboard."
              : "You have not opened a search yet. Start from the dashboard."}
          </p>
        ) : (
          <ul className="grid gap-6 lg:grid-cols-2">
            {searchList.map((search, index) => (
              <SearchCard
                key={search.id}
                search={search}
                run={runsBySearch.get(search.id)}
                index={index}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
