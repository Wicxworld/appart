"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isPlanId } from "@/lib/plans";

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first." };
  }

  const full_name = String(formData.get("full_name") ?? "").trim();
  if (!full_name) {
    return { error: "Display name is required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { error: null };
}

export async function updateNotificationPrefs(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first." };
  }

  const notification_email = formData.get("notification_email") === "on";
  const notification_matches = formData.get("notification_matches") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({ notification_email, notification_matches })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { error: null };
}

export async function selectPlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first." };
  }

  if (!isPlanId(planId)) {
    return { error: "Choose Essential, Priority, or Executive." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ plan: planId })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/plans");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { error: null };
}
