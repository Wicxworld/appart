import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BrandMark } from "@/components/brand-mark";
import { photos } from "@/lib/photos";
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

  const runsBySearch = new Map<string, SearchRun>();

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
    <main className="min-h-screen bg-ivory text-ink">
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
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <BrandMark />
          <SignOutButton />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-10 lg:pb-20">
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
            <SearchForm />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl">Active and recent searches</h2>

          {searchList.length === 0 ? (
            <p className="mt-6 border border-dashed border-ink/15 px-6 py-12 text-muted">
              No searches yet. Open one above and it will appear here with its
              run log.
            </p>
          ) : (
            <ul className="mt-8 grid gap-6 lg:grid-cols-2">
              {searchList.map((search, index) => {
                const run = runsBySearch.get(search.id);
                const image =
                  [photos.penthouse, photos.kitchen, photos.loft, photos.terrace][
                    index % 4
                  ];
                return (
                  <li key={search.id} className="overflow-hidden border border-ink/10 bg-paper">
                    <div className="relative h-40">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl">{search.city}</h3>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-bronze">
                          {search.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted">
                        {search.bedrooms != null
                          ? `${search.bedrooms} bedroom${search.bedrooms === 1 ? "" : "s"}`
                          : "Any bedrooms"}
                        {search.budget_max != null
                          ? ` · up to $${Number(search.budget_max).toLocaleString("en-US")}`
                          : ""}
                      </p>
                      {search.notes && (
                        <p className="mt-3 text-sm leading-6">{search.notes}</p>
                      )}
                      {run && (
                        <div className="mt-5 border-t border-ink/10 pt-4 text-sm text-muted">
                          <p>
                            Latest run: {run.status} · scanned{" "}
                            {run.listings_scanned} · matches {run.matches_found}
                          </p>
                          {run.log && <p className="mt-1">{run.log}</p>}
                        </div>
                      )}
                    </div>
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
