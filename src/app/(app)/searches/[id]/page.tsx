import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { photos } from "@/lib/photos";
import { bedroomLabel, formatDateTime, formatUsd } from "@/lib/format";
import { StatusPill } from "@/components/status-pill";
import type { SearchRequestRow, SearchRunRow } from "@/lib/types";

const placeholders = [
  {
    title: "Awaiting a qualifying residence",
    copy: "When the matching worker is live, homes that meet this brief will appear here.",
    image: photos.penthouse,
  },
  {
    title: "Inventory is still being gathered",
    copy: "Published listings that fit city, rooms, and budget will be ranked against the notes.",
    image: photos.loft,
  },
  {
    title: "You will review before anything moves",
    copy: "A match is a recommendation, not a commitment. You authorize the next step.",
    image: photos.terrace,
  },
];

export default async function SearchDetailPage({
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

  const { data: search } = await supabase
    .from("search_requests")
    .select("id, city, budget_max, bedrooms, notes, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!search) {
    notFound();
  }

  const brief = search as SearchRequestRow;

  const { data: runs } = await supabase
    .from("search_runs")
    .select(
      "id, search_request_id, status, listings_scanned, matches_found, log, started_at, finished_at",
    )
    .eq("search_request_id", id)
    .order("started_at", { ascending: false });

  const runList = (runs ?? []) as SearchRunRow[];
  const latest = runList[0];
  const budget = formatUsd(brief.budget_max);

  return (
    <main>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={photos.gallery}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <Link
            href="/searches"
            className="text-[11px] uppercase tracking-[0.22em] text-ivory/70 transition hover:text-ivory"
          >
            Back to all searches
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <StatusPill status={brief.status} />
            {latest ? <StatusPill status={latest.status} /> : null}
          </div>
          <h1 className="mt-5 font-display text-4xl text-ivory sm:text-6xl">
            {brief.city}
          </h1>
          <p className="mt-4 text-sm text-ivory/75">
            Opened {formatDateTime(brief.created_at)}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="border border-ink/10 bg-paper p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            The brief
          </p>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                City
              </dt>
              <dd className="mt-1 font-display text-2xl">{brief.city}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Bedrooms
              </dt>
              <dd className="mt-1">{bedroomLabel(brief.bedrooms)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Budget
              </dt>
              <dd className="mt-1">{budget ? `Up to ${budget} / month` : "Open"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Notes
              </dt>
              <dd className="mt-2 text-sm leading-6">
                {brief.notes || "No additional notes on this brief."}
              </dd>
            </div>
          </dl>
        </section>

        <section className="border border-ink/10 bg-paper p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Run status
          </p>
          {runList.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No matching run has been recorded yet.
            </p>
          ) : (
            <ol className="mt-8 space-y-6">
              {runList.map((run) => (
                <li key={run.id} className="border-t border-ink/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <StatusPill status={run.status} />
                    <span className="text-xs text-muted">
                      {formatDateTime(run.started_at)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    Scanned {run.listings_scanned} / matches {run.matches_found}
                  </p>
                  {run.log ? (
                    <p className="mt-2 text-sm leading-6">{run.log}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <h2 className="font-display text-3xl">Matches</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Matching is not live yet. Qualifying residences will be listed here
          once the worker is connected to inventory.
        </p>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {placeholders.map((item) => (
            <li key={item.title} className="border border-ink/10 bg-paper">
              <div className="relative h-40">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-xl">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
