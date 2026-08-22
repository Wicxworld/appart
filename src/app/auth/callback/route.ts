import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=missing_code", requestUrl.origin),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=authentication_failed", requestUrl.origin),
    );
  }

  const safeNext = next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";

  return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
}