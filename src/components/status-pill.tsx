export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "active" ||
    status === "matched" ||
    status === "completed" ||
    status === "paid"
      ? "text-forest bg-forest/10"
      : status === "queued" ||
          status === "running" ||
          status === "paused" ||
          status === "awaiting_payment" ||
          status === "pending_review"
        ? "text-bronze bg-bronze/10"
        : "text-muted bg-ink/5";

  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] ${tone}`}
    >
      {label}
    </span>
  );
}
