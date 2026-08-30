import Link from "next/link";

export function BrandMark({
  href = "/",
  tone = "light",
}: {
  href?: string;
  tone?: "light" | "dark";
}) {
  const color = tone === "light" ? "text-ivory" : "text-ink";

  return (
    <Link
      href={href}
      className={`${color} font-display text-[1.7rem] leading-none tracking-tight`}
    >
      appart<span className="text-bronze">.</span>
    </Link>
  );
}
