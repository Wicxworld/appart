"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSearchRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first.", id: null };
  }

  const city = String(formData.get("city") ?? "").trim();
  const budgetRaw = String(formData.get("budget_max") ?? "").trim();
  const bedroomsRaw = String(formData.get("bedrooms") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!city) {
    return { error: "City is required.", id: null };
  }

  const budget_max = budgetRaw ? Number(budgetRaw) : null;
  const bedrooms = bedroomsRaw ? Number(bedroomsRaw) : null;

  if (budget_max !== null && Number.isNaN(budget_max)) {
    return { error: "Budget must be a number.", id: null };
  }

  if (bedrooms !== null && Number.isNaN(bedrooms)) {
    return { error: "Bedrooms must be a number.", id: null };
  }

  const { data, error } = await supabase
    .from("search_requests")
    .insert({
      user_id: user.id,
      city,
      budget_max,
      bedrooms,
      notes: notes || null,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message, id: null };
  }

  revalidatePath("/dashboard");
  revalidatePath("/searches");
  return { error: null, id: data?.id ?? null };
}
