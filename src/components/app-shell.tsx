import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

export async function AppShell({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, role")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    user.email ||
    "Member";

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-ink">
      <AppHeader
        displayName={displayName}
        email={user.email ?? ""}
        plan={profile?.plan ?? null}
        isAdmin={isAdminUser({ email: user.email }, profile)}
      />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </div>
  );
}
