import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
            {kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}
