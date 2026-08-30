import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionPaymentRow } from "@/lib/types";

export async function loadOwnedPayment(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: payment } = await supabase
    .from("subscription_payments")
    .select(
      "id, user_id, plan, amount_usd, method, reference, status, payer_note, reviewed_by, reviewed_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!payment || payment.user_id !== user.id) {
    notFound();
  }

  return { user, payment: payment as SubscriptionPaymentRow };
}
