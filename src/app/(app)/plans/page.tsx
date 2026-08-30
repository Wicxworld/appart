import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { planLabel } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { PlanPicker } from "./plan-picker";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main>
      <PageHeader
        kicker="Membership"
        title="Plans"
        description={`Current membership: ${planLabel(profile?.plan)}. Selecting a plan records it on your profile. Stripe checkout is not live yet.`}
      />
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <PlanPicker currentPlan={profile?.plan ?? null} />
        <p className="mt-12 max-w-2xl text-sm leading-6 text-muted">
          Payment is not collected yet. Your selection tells matching which
          depth of search to honor once checkout and the worker are connected.
        </p>
      </div>
    </main>
  );
}
