"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase/client";
import { planLabel } from "@/lib/plans";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/searches", label: "Searches" },
  { href: "/plans", label: "Plans" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader({
  displayName,
  email,
  plan,
  isAdmin,
}: {
  displayName: string;
  email: string;
  plan: string | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initial = (displayName.trim()[0] || email[0] || "A").toUpperCase();

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const city = query.trim();
    if (!city) {
      router.push("/searches");
      return;
    }
    router.push(`/dashboard?city=${encodeURIComponent(city)}`);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  function navClass(href: string) {
    const active =
      pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return active ? "text-ink" : "text-muted transition hover:text-ink";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 lg:px-10">
        <BrandMark href="/dashboard" tone="dark" />

        <nav className="ml-6 hidden items-center gap-7 text-[11px] font-medium uppercase tracking-[0.22em] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(item.href)}>
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin" className={navClass("/admin")}>
              Admin
            </Link>
          ) : null}
        </nav>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden min-w-0 max-w-md flex-1 lg:block"
        >
          <label className="sr-only" htmlFor="header-search">
            Search a city
          </label>
          <div className="flex items-center border border-ink/15 bg-paper px-3">
            <span className="pr-2 text-bronze" aria-hidden>
              ⌕
            </span>
            <input
              id="header-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 border border-ink/15 bg-paper px-2 py-1.5"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-ink font-display text-sm text-ivory">
                {initial}
              </span>
              <span className="hidden max-w-[9rem] truncate text-left text-sm sm:block">
                {displayName}
              </span>
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 border border-ink/10 bg-paper py-3 shadow-sm"
              >
                <div className="border-b border-ink/10 px-4 pb-3">
                  <p className="truncate font-display text-lg">{displayName}</p>
                  <p className="truncate text-xs text-muted">{email}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bronze">
                    {planLabel(plan)}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2.5 text-sm transition hover:bg-sand/60"
                  role="menuitem"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2.5 text-sm transition hover:bg-sand/60"
                  role="menuitem"
                >
                  Settings
                </Link>
                <Link
                  href="/plans"
                  className="block px-4 py-2.5 text-sm transition hover:bg-sand/60"
                  role="menuitem"
                >
                  Plans
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm transition hover:bg-sand/60"
                    role="menuitem"
                  >
                    Admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2.5 text-left text-sm text-muted transition hover:bg-sand/60 hover:text-ink"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="border border-ink/15 px-3 py-2 text-[11px] uppercase tracking-[0.18em] md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
          >
            Menu
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="border-t border-ink/10 px-6 py-3 lg:hidden"
      >
        <label className="sr-only" htmlFor="header-search-mobile">
          Search a city
        </label>
        <div className="flex items-center border border-ink/15 bg-paper px-3">
          <span className="pr-2 text-bronze" aria-hidden>
            ⌕
          </span>
          <input
            id="header-search-mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a city"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
          />
        </div>
      </form>

      {mobileOpen ? (
        <nav className="border-t border-ink/10 bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-[11px] font-medium uppercase tracking-[0.22em]">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(item.href)}>
                {item.label}
              </Link>
            ))}
            <Link href="/profile" className={navClass("/profile")}>
              Profile
            </Link>
            {isAdmin ? (
              <Link href="/admin" className={navClass("/admin")}>
                Admin
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
