import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { photos } from "@/lib/photos";

const residences = [
  {
    title: "Victoria Island penthouse",
    location: "Lagos waterfront",
    image: photos.penthouse,
  },
  {
    title: "Garden residence",
    location: "Ikoyi",
    image: photos.kitchen,
  },
  {
    title: "City loft",
    location: "Lekki Phase 1",
    image: photos.loft,
  },
];

const plans = [
  {
    name: "Essential",
    price: "$19",
    description: "A focused private search for one home.",
    featured: false,
    features: [
      "Personalized apartment requirements",
      "Active property search",
      "Match notifications",
    ],
  },
  {
    name: "Priority",
    price: "$37",
    description: "Faster matching with dedicated handling.",
    featured: true,
    features: [
      "Everything in Essential",
      "Priority property matching",
      "Dedicated search handling",
      "Faster match review",
    ],
  },
  {
    name: "Executive",
    price: "$75",
    description: "For complex or highly specific briefs.",
    featured: false,
    features: [
      "Everything in Priority",
      "High-priority search",
      "Dedicated client handling",
      "Advanced requirement matching",
    ],
  },
];

export default function Home() {
  return (
    <main className="bg-ivory text-ink">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src={photos.hero}
          alt="A modern luxury residence at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/80" />

        <header className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
            <BrandMark />
            <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/80 md:flex">
              <a href="#residences" className="transition hover:text-ivory">
                Residences
              </a>
              <a href="#process" className="transition hover:text-ivory">
                The search
              </a>
              <a href="#plans" className="transition hover:text-ivory">
                Membership
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="hidden px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/80 transition hover:text-ivory sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="border border-ivory/40 bg-ivory/10 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory backdrop-blur-sm transition hover:bg-ivory hover:text-ink"
              >
                Begin
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col justify-end px-6 pb-16 pt-24 lg:px-10 lg:pb-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-bronze">
            Private apartment search
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[0.95] text-ivory sm:text-7xl lg:text-8xl">
            The home you asked for, found with intention.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-ivory/80 sm:text-lg">
            Appart turns a precise brief into an active search. If the right
            residence is not listed today, the search continues until it is.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="bg-bronze px-8 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-ivory"
            >
              Start your search
            </Link>
            <a
              href="#process"
              className="border border-ivory/30 px-8 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:border-ivory"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
              Built around the brief
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Not a listing board. A search that stays with you.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Most platforms ask you to scroll. Appart asks for the rooms, the
              light, the street, the budget, then keeps looking until a
              qualifying home appears.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={photos.living}
                alt="A layered living room with natural light"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden">
              <Image
                src={photos.gallery}
                alt="A chef kitchen in a contemporary residence"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="residences" className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
                The kind of home we search for
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">
                Residences, not thumbnails.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              From waterfront penthouses to quiet garden houses, every search
              is measured against the brief you wrote.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {residences.map((residence) => (
              <article key={residence.title} className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={residence.image}
                    alt={residence.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 font-display text-2xl">{residence.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                  {residence.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-ink text-ivory">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={photos.terrace}
              alt="A residential terrace overlooking the city"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
              The search
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Four quiet steps to a verified match.
            </h2>
            <ol className="mt-12 space-y-8">
              {[
                ["01", "Write the brief", "City, rooms, light, budget, and the details that actually matter."],
                ["02", "Choose a membership", "Essential, Priority, or Executive, billed in USD."],
                ["03", "We keep looking", "Your search stays active until a qualifying residence appears."],
                ["04", "Review the match", "See the home, then authorize the next step when you are ready."],
              ].map(([number, title, body]) => (
                <li key={number} className="grid grid-cols-[4.5rem_1fr] gap-5 border-t border-ivory/10 pt-8">
                  <span className="font-display text-2xl text-bronze">{number}</span>
                  <div>
                    <p className="font-display text-2xl">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-ivory/70">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="plans" className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">
              Membership
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Choose the depth of search.
            </h2>
            <p className="mt-5 text-muted">Plans are billed in USD.</p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  plan.featured
                    ? "bg-ink px-8 py-10 text-ivory"
                    : "border border-ink/10 bg-paper px-8 py-10"
                }
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
                  {plan.name}
                </p>
                <p className="mt-6 font-display text-5xl">{plan.price}</p>
                <p className={`mt-4 text-sm leading-6 ${plan.featured ? "text-ivory/70" : "text-muted"}`}>
                  {plan.description}
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="text-bronze">—</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/sign-up"
                  className={
                    plan.featured
                      ? "mt-10 block bg-bronze px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
                      : "mt-10 block bg-ink px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-bronze hover:text-ink"
                  }
                >
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src={photos.city}
          alt="A city skyline at dusk"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-4xl leading-tight text-ivory sm:text-6xl">
            Tell us the home. We will find it.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-10 bg-bronze px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-ivory"
          >
            Open an account
          </Link>
        </div>
      </section>

      <footer className="bg-ink text-ivory/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <BrandMark />
          <p>© {new Date().getFullYear()} Appart. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/terms" className="transition hover:text-ivory">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-ivory">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
