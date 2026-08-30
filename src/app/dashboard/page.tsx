import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { photos } from "@/lib/photos";
import { planLabel } from "@/lib/plans";
import { SearchForm } from "./search-form";
import { SearchCard } from "@/components/search-card";
import type { SearchRequestRow, SearchRunRow } from "@/lib/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    user.email ||
    "there";

  const { data: searches } = await supabase
    .from("search_requests")
    .select("id, city, budget_max, bedrooms, notes, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4);

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
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={photos.living}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
            Your private search
          </p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">
            Welcome back, {displayName}.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ivory/75">
            Write the brief. Each search is stored, and a run log waits here
            until matching is live.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-ivory/60">
            Membership · {planLabel(profile?.plan)}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <section className="border border-ink/10 bg-paper p-8 lg:p-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            New brief
          </p>
          <h2 className="mt-3 font-display text-3xl">Open a search</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            City, budget, rooms, and the details that actually matter.
          </p>
          <div className="mt-10">
            <SearchForm defaultCity={city ?? ""} />
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl">Recent searches</h2>
            <Link
              href="/searches"
              className="text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
            >
              View all
            </Link>
          </div>

          {searchList.length === 0 ? (
            <p className="mt-6 border border-dashed border-ink/15 px-6 py-12 text-muted">
              No searches yet. Open one above and it will appear here with its
              run log.
            </p>
          ) : (
            <ul className="mt-8 grid gap-6 lg:grid-cols-2">
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
        </section>
      </div>
    </main>
  );
}
