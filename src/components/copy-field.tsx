"use client";

import { useState } from "react";

export function CopyField({
  label,
  value,
  hint,
  tone = "light",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const surface =
    tone === "dark"
      ? "border-ivory/15 bg-ink/40 text-ivory"
      : "border-ink/10 bg-ivory text-ink";

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className={`mt-2 flex items-center gap-3 border px-4 py-3 ${surface}`}>
        <code className="min-w-0 flex-1 break-all font-sans text-sm">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze transition hover:text-ink"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {hint ? <p className="mt-2 text-xs leading-5 text-muted">{hint}</p> : null}
    </div>
  );
}
