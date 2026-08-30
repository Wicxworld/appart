import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "") ||
    "";

  return (
    <main>
      <PageHeader
        kicker="Account"
        title="Profile"
        description="How you appear on Appart, and when you joined the search."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_20rem] lg:px-10">
        <section className="border border-ink/10 bg-paper p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Details
          </p>
          <div className="mt-8">
            <ProfileForm defaultName={displayName} />
          </div>
          <dl className="mt-12 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Email
              </dt>
              <dd className="mt-2 text-sm">{user.email}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                Member since
              </dt>
              <dd className="mt-2 text-sm">
                {formatDate(profile?.created_at ?? user.created_at)}
              </dd>
            </div>
          </dl>
        </section>
        <aside className="border border-ink/10 bg-paper p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">
            Membership
          </p>
          <p className="mt-4 font-display text-3xl">{planLabel(profile?.plan)}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Plan selection is recorded on your profile. Checkout will follow.
          </p>
          <a
            href="/plans"
            className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-bronze transition hover:text-ink"
          >
            Manage plan
          </a>
        </aside>
      </div>
    </main>
  );
}
