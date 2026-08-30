import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://hjhvoiukokjfxbxosypc.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      "sb_publishable_00GGQPDlq-RdAAqZI-6-Dw_n0-ZbDlY",
  },
};

export default nextConfig;
