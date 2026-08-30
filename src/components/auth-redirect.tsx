"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const tokenHash = url.searchParams.get("token_hash");

    if (code || tokenHash) {
      if (
        url.pathname.startsWith("/auth/callback") ||
        url.pathname.startsWith("/auth/confirm")
      ) {
        return;
      }

      const dest = new URL(
        tokenHash ? "/auth/confirm" : "/auth/callback",
        window.location.origin,
      );
      url.searchParams.forEach((value, key) => {
        dest.searchParams.set(key, value);
      });
      if (!dest.searchParams.get("next")) {
        dest.searchParams.set("next", "/dashboard");
      }
      window.location.replace(dest.toString());
      return;
    }

    if (!url.hash.includes("access_token")) {
      return;
    }

    const params = new URLSearchParams(url.hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        window.history.replaceState({}, "", url.pathname);
        router.replace(error ? "/auth/sign-in?error=authentication_failed" : "/dashboard");
        router.refresh();
      });
  }, [router]);

  return null;
}
