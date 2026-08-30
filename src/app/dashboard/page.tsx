import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SearchForm } from "./search-form";
import { SignOutButton } from "./sign-out-button";

type SearchRequest = {
  id: string;
  city: string;
  budget_max: number | null;
  bedrooms: number | null;
  notes: string | null;
  status: string;
  created_at: string;
};

type SearchRun = {
  id: string;
  search_request_id: string;
  status: string;
  listings_scanned: number;
  matches_found: number;
  log: string | null;
  started_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
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
    .order("created_at", { ascending: false });

  const searchList = (searches ?? []) as SearchRequest[];
  const searchIds = searchList.map((search) => search.id);

  let runsBySearch = new Map<string, SearchRun>();

  if (searchIds.length > 0) {
    const { data: runs } = await supabase
      .from("search_runs")
      .select(
        "id, search_request_id, status, listings_scanned, matches_found, log, started_at",
      )
      .in("search_request_id", searchIds)
      .order("started_at", { ascending: false });

    for (const run of (runs ?? []) as SearchRun[]) {
      if (!runsBySearch.has(run.search_request_id)) {
        runsBySearch.set(run.search_request_id, run);
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            appart<span className="text-blue-400">.</span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Your search
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back, {displayName}.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Tell Appart what you need. Each search is stored, and a run log is
          created so results can come back here once matching is live.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-xl font-semibold">Start a new search</h2>
          <p className="mt-2 text-sm text-slate-400">
            This saves an active search against your account.
          </p>
          <div className="mt-6">
            <SearchForm />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Active and recent searches</h2>

          {searchList.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-slate-400">
              No searches yet. Start one above and it will show up here with its
              run log.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {searchList.map((search) => {
                const run = runsBySearch.get(search.id);
                return (
                  <li
                    key={search.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">{search.city}</h3>
                      <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {search.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      {search.bedrooms != null
                        ? `${search.bedrooms} bedroom${search.bedrooms === 1 ? "" : "s"}`
                        : "Any bedrooms"}
                      {search.budget_max != null
                        ? ` · up to ₦${Number(search.budget_max).toLocaleString("en-NG")}`
                        : ""}
                    </p>
                    {search.notes && (
                      <p className="mt-2 text-sm text-slate-300">{search.notes}</p>
                    )}
                    {run && (
                      <div className="mt-4 rounded-xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                        <p className="font-medium text-slate-200">
                          Latest run: {run.status} · scanned {run.listings_scanned} ·
                          matches {run.matches_found}
                        </p>
                        {run.log && (
                          <p className="mt-1 text-slate-400">{run.log}</p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
