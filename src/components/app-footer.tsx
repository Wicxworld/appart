import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <BrandMark href="/dashboard" tone="dark" />
        <p>A private search, kept on the brief.</p>
        <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em]">
          <Link href="/plans" className="transition hover:text-ink">
            Plans
          </Link>
          <Link href="/settings" className="transition hover:text-ink">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
