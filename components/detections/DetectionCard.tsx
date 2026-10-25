"use client";

import { useState } from "react";
import Image from "next/image";
import { AudioLines, ChevronDown, Download } from "lucide-react";
import { campusBirds } from "@/lib/birds";
import type { DetectionRun } from "@/lib/detection-types";
import { cn } from "@/lib/utils";

function formatTime(iso: string | null): string {
  if (!iso) return "Unknown time";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function confidenceTone(confidence: number): string {
  if (confidence >= 0.8) return "bg-[#dff5e8] text-[#1f7a4a]";
  if (confidence >= 0.5) return "bg-[#fff3d6] text-[#94650b]";
  return "bg-[#fde4e1] text-[#a3392b]";
}

export function DetectionCard({ run }: { run: DetectionRun }) {
  const [showRows, setShowRows] = useState(false);
  const bird = run.scientific ? campusBirds.find((b) => b.scientific === run.scientific) : undefined;

  return (
    <article className="overflow-hidden rounded-2xl border border-white/50 bg-white/25 shadow-[0_8px_24px_rgb(40_80_110/0.1)] backdrop-blur-md">
      <div className="flex gap-4 p-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#d7e7ee] sm:size-24">
          {bird ? (
            <Image
              src={bird.image.src}
              alt={bird.name}
              fill
              sizes="96px"
              className="object-cover"
              style={{ objectPosition: bird.image.position }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#6f8796]">
              <AudioLines className="size-7" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-medium text-[#2b3540]">
                {run.species ?? "No bird identified"}
              </h2>
              {run.scientific && <p className="truncate text-sm text-[#4d6473] italic">{run.scientific}</p>}
            </div>
            {run.species && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums",
                  confidenceTone(run.confidence),
                )}
              >
                {Math.round(run.confidence * 100)}%
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-[#6f8796]">
            {run.clip !== null ? `Clip ${run.clip}` : run.id} · {formatTime(run.analyzedAt)}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        {run.audio ? (
          <audio controls preload="none" className="h-10 w-full" aria-label={`Audio clip ${run.audio.filename}`}>
            <source src={run.audio.url} type={run.audio.contentType} />
          </audio>
        ) : (
          <p className="text-sm text-[#6f8796]">No audio uploaded for this run.</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowRows((v) => !v)}
            disabled={run.rows.length === 0}
            aria-expanded={showRows}
            className="inline-flex items-center gap-1.5 text-sm text-[#0a7de9] hover:underline disabled:text-[#6f8796] disabled:no-underline"
          >
            <ChevronDown className={cn("size-4 transition-transform", showRows && "rotate-180")} />
            {run.rows.length === 0
              ? "No CSV detections"
              : `${showRows ? "Hide" : "Show"} ${run.rows.length} CSV row${run.rows.length === 1 ? "" : "s"}`}
          </button>
          {run.csv && (
            <a
              href={run.csv.url}
              download={run.csv.filename}
              className="inline-flex items-center gap-1.5 text-sm text-[#3c4f5d] hover:text-[#0a7de9]"
            >
              <Download className="size-4" />
              CSV
            </a>
          )}
        </div>

        {showRows && run.rows.length > 0 && (
          <div className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/50 bg-white/40">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white/80 text-xs text-[#4d6473] backdrop-blur">
                <tr>
                  <th className="px-3 py-2 font-medium">Time (s)</th>
                  <th className="px-3 py-2 font-medium">Species</th>
                  <th className="px-3 py-2 text-right font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody className="text-[#2b3540]">
                {run.rows.map((row, i) => (
                  <tr key={i} className="border-t border-white/60">
                    <td className="px-3 py-1.5 whitespace-nowrap tabular-nums">
                      {row.start.toFixed(1)}–{row.end.toFixed(1)}
                    </td>
                    <td className="px-3 py-1.5">{row.common}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{row.confidence.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}
