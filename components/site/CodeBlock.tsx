"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked (insecure context / permissions) — the text is still selectable
    }
  };

  return (
    <div className="group relative mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#13283a]/88 shadow-[0_8px_24px_rgb(15_40_60/0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] tracking-wide text-[#9fbdcc]">{label ?? "terminal"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] text-[#c5dce4] transition-colors hover:bg-white/10"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#e6f3f8]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
