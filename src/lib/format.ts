export function formatUsd(amount: number | string | null | undefined) {
  if (amount == null || amount === "") return null;
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

export function bedroomLabel(bedrooms: number | null | undefined) {
  if (bedrooms == null) return "Any bedrooms";
  return `${bedrooms} bedroom${bedrooms === 1 ? "" : "s"}`;
}
