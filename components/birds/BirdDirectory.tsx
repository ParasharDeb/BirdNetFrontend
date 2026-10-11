"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, CircleAlert, CircleCheck } from "lucide-react";
import type { CampusBird, Detection } from "@/lib/birds";
import { cn } from "@/lib/utils";

const filters: { key: "all" | Detection; label: string }[] = [
  { key: "all", label: "All birds" },
  { key: "birdnet", label: "BirdNET can hear" },
  { key: "custom-model-needed", label: "Needs custom model" },
];

const statusTone: Record<CampusBird["status"], string> = {
  "Least Concern": "bg-white/55 text-[#3c4f5d]",
  "Near Threatened": "bg-[#fff1d6]/85 text-[#7a4b00]",
  Endangered: "bg-[#ffe1de]/90 text-[#9b2c22]",
  Domestic: "bg-white/55 text-[#3c4f5d]",
};

export function BirdDirectory({ birds }: { birds: CampusBird[] }) {
  const [filter, setFilter] = useState<"all" | Detection>("all");
  const shown = filter === "all" ? birds : birds.filter((b) => b.detection === filter);

  return (
    <section className="mt-12">
      <div role="group" aria-label="Filter birds" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.key === "all" ? birds.length : birds.filter((b) => b.detection === f.key).length;
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                active
                  ? "border-transparent bg-[linear-gradient(90deg,#0074fe,#088fd1)] text-white shadow-[0_6px_18px_rgb(0_110_230/0.25)]"
                  : "border-white/55 bg-white/25 text-[#3c4f5d] backdrop-blur hover:bg-white/45",
              )}
            >
              {f.label}
              <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-white/25" : "bg-white/60")}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((bird, i) => (
            <motion.li
              key={bird.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
            >
              <BirdCard bird={bird} eager={i < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

function BirdCard({ bird, eager }: { bird: CampusBird; eager: boolean }) {
  const canHear = bird.detection === "birdnet";
  return (
    <article
      id={bird.slug}
      data-cursor="hover"
      className="glass-panel group flex h-full flex-col overflow-hidden rounded-[26px] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgb(40_80_110/0.18)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={bird.image.src}
          alt={`${bird.name} (${bird.scientific})`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ objectPosition: bird.image.position ?? "50% 50%" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0f2a3c]/35 to-transparent" />
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md",
            statusTone[bird.status],
          )}
        >
          {bird.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[22px] leading-tight font-light tracking-[-0.01em] text-[#24384a]">{bird.name}</h3>
          {bird.localName && <span className="shrink-0 text-xs text-[#4d6473]">{bird.localName}</span>}
        </div>
        <p className="mt-0.5 text-sm text-[#4d6473] italic">{bird.scientific}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#2f4554]">{bird.description}</p>

        <p className="mt-4 flex gap-2 rounded-2xl bg-white/35 p-3 text-sm leading-snug text-[#2f4554]">
          <AudioLines className="mt-0.5 size-4 shrink-0 text-[#0a6fe0]" />
          <span>
            <span className="font-medium">Listen for: </span>
            {bird.listenFor}
          </span>
        </p>

        <p
          className={cn(
            "mt-3 flex gap-2 text-[13px] leading-snug",
            canHear ? "text-[#1f5d43]" : "text-[#8a3b14]",
          )}
        >
          {canHear ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
          )}
          {bird.detectionNote}
        </p>

        <p className="mt-auto pt-4 text-[11px] text-[#5b7383]">
          Photo:{" "}
          <a
            href={bird.credit.source}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/70 underline-offset-2 hover:text-[#24384a]"
          >
            {bird.credit.author}
          </a>
          , {bird.credit.license}, via Wikimedia Commons
        </p>
      </div>
    </article>
  );
}
