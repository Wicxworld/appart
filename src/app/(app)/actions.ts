"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPlan, isPlanId, planLabel } from "@/lib/plans";
import { formatUsd } from "@/lib/format";
import {
  createPaymentReference,
  isPaymentMethod,
  methodLabel,
} from "@/lib/payouts";
import { sendPaymentMarkedEmail } from "@/lib/email";
import type { SubscriptionPaymentRow } from "@/lib/types";

const OPEN_STATUSES = ["awaiting_payment", "pending_review"] as const;

function revalidateMembership() {
  revalidatePath("/plans", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/admin");
}

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

export async function startPlanPayment(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first.", id: null };
  }

  if (!isPlanId(planId)) {
    return { error: "Choose Essential, Priority, or Executive.", id: null };
  }

  const plan = getPlan(planId);
  if (!plan) {
    return { error: "Choose Essential, Priority, or Executive.", id: null };
  }

  const { data: openRows, error: openError } = await supabase
    .from("subscription_payments")
    .select("id, plan, status")
    .eq("user_id", user.id)
    .in("status", [...OPEN_STATUSES]);

  if (openError) {
    return { error: openError.message, id: null };
  }

  const open = (openRows ?? []) as Pick<
    SubscriptionPaymentRow,
    "id" | "plan" | "status"
  >[];

  const matching = open.find((row) => row.plan === planId);
  if (matching) {
    return { error: null, id: matching.id };
  }

  const pendingReview = open.find((row) => row.status === "pending_review");
  if (pendingReview) {
    return {
      error:
        "You already have a payment waiting for review. Wait for confirmation or open that payment to check the status.",
      id: pendingReview.id,
    };
  }

  const awaiting = open.filter((row) => row.status === "awaiting_payment");
  if (awaiting.length > 0) {
    const { error: cancelError } = await supabase
      .from("subscription_payments")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "awaiting_payment");

    if (cancelError) {
      return { error: cancelError.message, id: null };
    }
  }

  let lastError = "Could not create the payment.";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { data, error } = await supabase
      .from("subscription_payments")
      .insert({
        user_id: user.id,
        plan: planId,
        amount_usd: plan.price,
        method: "btc",
        reference: createPaymentReference(),
        status: "awaiting_payment",
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      revalidateMembership();
      return { error: null, id: data.id as string };
    }

    lastError = error?.message ?? lastError;
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return { error: lastError, id: null };
    }
  }

  return { error: lastError, id: null };
}

export async function markPaymentSent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first.", warning: null };
  }

  const paymentId = String(formData.get("payment_id") ?? "").trim();
  const method = String(formData.get("method") ?? "").trim();
  const payerNote = String(formData.get("payer_note") ?? "").trim();

  if (!paymentId) {
    return { error: "Payment is missing.", warning: null };
  }

  if (!isPaymentMethod(method)) {
    return { error: "Choose Bitcoin or a Lead Bank transfer.", warning: null };
  }

  const { data: payment, error: loadError } = await supabase
    .from("subscription_payments")
    .select("id, status, user_id, plan, amount_usd, reference")
    .eq("id", paymentId)
    .maybeSingle();

  if (loadError) {
    return { error: loadError.message, warning: null };
  }

  if (!payment || payment.user_id !== user.id) {
    return { error: "Payment not found.", warning: null };
  }

  if (payment.status === "pending_review") {
    return { error: null, warning: null };
  }

  if (payment.status !== "awaiting_payment") {
    return {
      error: "This payment can no longer be marked as sent.",
      warning: null,
    };
  }

  const { error } = await supabase
    .from("subscription_payments")
    .update({
      method,
      payer_note: payerNote || null,
      status: "pending_review",
    })
    .eq("id", paymentId)
    .eq("user_id", user.id)
    .eq("status", "awaiting_payment");

  if (error) {
    return { error: error.message, warning: null };
  }

  revalidateMembership();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const memberName =
    (typeof profile?.full_name === "string" && profile.full_name.trim()) ||
    user.email ||
    "Member";
  const memberPhone =
    typeof profile?.phone === "string" && profile.phone.trim()
      ? profile.phone.trim()
      : null;

  const notify = await sendPaymentMarkedEmail({
    memberEmail: user.email ?? "unknown",
    memberName,
    memberPhone,
    memberId: user.id,
    plan: planLabel(payment.plan),
    amountUsd: formatUsd(payment.amount_usd) ?? `$${payment.amount_usd}`,
    method: methodLabel(method),
    reference: payment.reference,
  });

  return { error: null, warning: notify.warning ?? null };
}
