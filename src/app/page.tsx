import Link from "next/link";

const features = [
  {
    title: "Tailored apartment search",
    description:
      "Tell Appart exactly what you need. We search for properties that match your requirements.",
  },
  {
    title: "Active property monitoring",
    description:
      "If the right property is not available yet, your search remains active until a matching property is found.",
  },
  {
    title: "Secure delegation",
    description:
      "When a verified match becomes available, you can review the property and authorize the next step.",
  },
];

const plans = [
  {
    name: "Essential",
    price: "$19",
    description: "For clients starting a focused apartment search.",
    features: [
      "Personalized apartment requirements",
      "Active property search",
      "Property match notifications",
    ],
  },
  {
    name: "Priority",
    price: "$37",
    description: "For clients who want a more active search experience.",
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
    description: "For complex or highly specific apartment requirements.",
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
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            appart<span className="text-blue-400">.</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#plans" className="transition hover:text-white">
              Plans
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Your apartment. Your requirements.
            </p>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Find a home that actually matches what you asked for.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              Appart turns your apartment requirements into an active,
              personalized property search. If the right property is not
              available today, the search continues until a qualifying match
              is found.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-blue-500 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Start your search
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-white/15 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Built around your requirements
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A search that stays active.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                How Appart works
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From requirements to a verified property match.
              </h2>

              <p className="mt-6 leading-7 text-slate-400">
                Create your profile, define exactly what you are looking for,
                choose a subscription, and let Appart manage the active search.
              </p>
            </div>

            <div className="space-y-4">
              {[
                ["01", "Define your requirements"],
                ["02", "Choose your subscription"],
                ["03", "Appart searches for matching properties"],
                ["04", "Review qualifying matches"],
              ].map(([number, title]) => (
                <div
                  key={number}
                  className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <span className="text-sm font-bold text-blue-400">
                    {number}
                  </span>

                  <span className="font-medium">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Subscription plans
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose the level of search you need.
            </h2>

            <p className="mt-5 text-slate-400">
              Plans are billed in USD.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-slate-950 p-7"
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>

                <p className="mt-5 text-3xl font-bold">{plan.price}</p>

                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="text-blue-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/sign-up"
                  className="mt-8 block rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Appart. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>

            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
