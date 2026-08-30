import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("notification_email, notification_matches")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main>
      <PageHeader
        kicker="Account"
        title="Settings"
        description="How we reach you, and how this session is held."
      />
      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
        <div className="border border-ink/10 bg-paper p-8 lg:p-10">
          <SettingsForm
            notificationEmail={profile?.notification_email ?? true}
            notificationMatches={profile?.notification_matches ?? true}
          />
        </div>
      </div>
    </main>
  );
}
