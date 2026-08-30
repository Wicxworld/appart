"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { isPlanId } from "@/lib/plans";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "You need to sign in first." as const };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isAdminUser({ email: user.email }, profile)) {
    return { supabase, user: null, error: "Not allowed." as const };
  }

  return { supabase, user, error: null };
}

function revalidateMembership() {
  revalidatePath("/admin");
  revalidatePath("/plans", "layout");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function confirmSubscriptionPayment(paymentId: string) {
  const { supabase, user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Not allowed." };
  }

  const { data: payment, error: loadError } = await supabase
    .from("subscription_payments")
    .select("id, user_id, plan, status")
    .eq("id", paymentId)
    .maybeSingle();

  if (loadError) {
    return { error: loadError.message };
  }

  if (!payment) {
    return { error: "Payment not found." };
  }

  if (payment.status === "paid") {
    return { error: null };
  }

  if (payment.status === "cancelled" || payment.status === "rejected") {
    return { error: "This payment can no longer be confirmed." };
  }

  if (!isPlanId(payment.plan)) {
    return { error: "This payment has an invalid plan." };
  }

  const { error: payError } = await supabase
    .from("subscription_payments")
    .update({
      status: "paid",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  if (payError) {
    return { error: payError.message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ plan: payment.plan })
    .eq("id", payment.user_id);

  if (profileError) {
    return { error: profileError.message };
  }

  revalidateMembership();
  return { error: null };
}

export async function rejectSubscriptionPayment(paymentId: string) {
  const { supabase, user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Not allowed." };
  }

  const { data: payment, error: loadError } = await supabase
    .from("subscription_payments")
    .select("id, status")
    .eq("id", paymentId)
    .maybeSingle();

  if (loadError) {
    return { error: loadError.message };
  }

  if (!payment) {
    return { error: "Payment not found." };
  }

  if (payment.status === "paid") {
    return { error: "A confirmed payment cannot be rejected." };
  }

  if (payment.status === "rejected") {
    return { error: null };
  }

  const { error } = await supabase
    .from("subscription_payments")
    .update({
      status: "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  if (error) {
    return { error: error.message };
  }

  revalidateMembership();
  return { error: null };
}
