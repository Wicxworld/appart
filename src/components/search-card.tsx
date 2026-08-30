import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { bedroomLabel, formatUsd } from "@/lib/format";
import { StatusPill } from "@/components/status-pill";
import type { SearchRequestRow, SearchRunRow } from "@/lib/types";

const gallery = [photos.penthouse, photos.kitchen, photos.loft, photos.terrace];

export function SearchCard({
  search,
  run,
  index = 0,
}: {
  search: SearchRequestRow;
  run?: SearchRunRow | null;
  index?: number;
}) {
  const image = gallery[index % gallery.length];
  const budget = formatUsd(search.budget_max);

  return (
    <li className="overflow-hidden border border-ink/10 bg-paper">
      <Link href={`/searches/${search.id}`} className="group block">
        <div className="relative h-40">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl">{search.city}</h3>
            <StatusPill status={search.status} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {bedroomLabel(search.bedrooms)}
            {budget ? ` · up to ${budget}` : ""}
          </p>
          {search.notes ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6">{search.notes}</p>
          ) : null}
          {run ? (
            <div className="mt-5 border-t border-ink/10 pt-4 text-sm text-muted">
              <p>
                Latest run: {run.status} · scanned {run.listings_scanned} ·
                matches {run.matches_found}
              </p>
              {run.log ? <p className="mt-1 line-clamp-2">{run.log}</p> : null}
            </div>
          ) : (
            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-bronze">
              View brief
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
