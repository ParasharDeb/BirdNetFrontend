"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, AudioLines, KeyRound, RefreshCw } from "lucide-react";
import { GalleryPagination } from "@/components/gallery/GalleryPagination";
import { RetryButton, StatePanel } from "@/components/gallery/GalleryStates";
import type { GalleryError } from "@/components/gallery/GalleryView";
import type { DetectionRun, DetectionsErrorResponse, DetectionsResponse } from "@/lib/detection-types";
import { cn } from "@/lib/utils";
import { DetectionCard } from "./DetectionCard";

const PAGE_SIZE = 12;

async function fetchPage(cursor: number, signal: AbortSignal): Promise<DetectionsResponse> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE), cursor: String(cursor) });
  const res = await fetch(`/api/detections?${params}`, { cache: "no-store", signal });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (body as DetectionsErrorResponse | null)?.error;
    throw Object.assign(new Error(err?.message ?? `Request failed (${res.status})`), {
      code: err?.code ?? "AWS_ERROR",
    });
  }
  return body as DetectionsResponse;
}

function toError(err: unknown): GalleryError {
  if (err instanceof Error) {
    return { code: (err as Error & { code?: string }).code ?? "NETWORK", message: err.message };
  }
  return { code: "NETWORK", message: "Something went wrong." };
}

function SkeletonList({ count }: { count: number }) {
  return (
    <ul aria-label="Loading detections" className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="rounded-2xl border border-white/40 bg-white/20 p-4">
          <div className="flex gap-4">
            <div className="size-20 animate-pulse rounded-xl bg-white/35 sm:size-24" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/45" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/35" />
            </div>
          </div>
          <div className="mt-4 h-10 animate-pulse rounded-full bg-white/35" />
        </li>
      ))}
    </ul>
  );
}

export function DetectionsView() {
  const [runs, setRuns] = useState<DetectionRun[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [bucket, setBucket] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<GalleryError | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<GalleryError | null>(null);
  const controller = useRef<AbortController | null>(null);

  // Fetches one page and applies it in promise callbacks, so it is safe to start from an effect.
  const run = useCallback((cursor: number) => {
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    const append = cursor > 0;

    fetchPage(cursor, ac.signal).then(
      (page) => {
        setRuns((prev) => (append ? [...prev, ...page.detections] : page.detections));
        setNextCursor(page.nextCursor);
        setTotal(page.total);
        setBucket(page.bucket);
        setStatus("ready");
        setLoadingMore(false);
      },
      (err: unknown) => {
        if (ac.signal.aborted) return;
        setLoadingMore(false);
        if (append) setLoadMoreError(toError(err));
        else {
          setError(toError(err));
          setStatus("error");
        }
      },
    );
    return ac;
  }, []);

  useEffect(() => {
    const ac = run(0);
    return () => ac.abort();
  }, [run]);

  const refresh = () => {
    setStatus("loading");
    setError(null);
    setLoadingMore(false);
    setLoadMoreError(null);
    run(0);
  };

  const loadMore = () => {
    if (nextCursor === null) return;
    setLoadingMore(true);
    setLoadMoreError(null);
    run(nextCursor);
  };

  const refreshing = status === "loading" && runs.length > 0;
  const notConfigured = error?.code === "NOT_CONFIGURED";

  return (
    <div className="mt-10">
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#4d6473]">
              {bucket ? (
                <>
                  BirdNET runs from <span className="font-medium text-[#3c4f5d]">{bucket}</span>
                  {total > 0 && <> · {total} total</>}
                </>
              ) : (
                "BirdNET results and audio clips stored in Amazon S3"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={status === "loading"}
            className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-[linear-gradient(90deg,#0074fe,#088fd1)] px-5 text-sm font-medium text-white shadow-[0_6px_18px_rgb(0_110_230/0.25)] transition-[filter,opacity] hover:brightness-110 disabled:opacity-70 sm:self-auto"
          >
            <RefreshCw className={cn("size-4", status === "loading" && "animate-spin")} />
            {status === "loading" ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      <section aria-live="polite" aria-busy={status === "loading"} className="mt-6">
        {status === "loading" && !refreshing && <SkeletonList count={4} />}
        {status === "error" && error && (
          <StatePanel
            icon={notConfigured ? <KeyRound className="size-5" /> : <AlertTriangle className="size-5" />}
            title={notConfigured ? "Detections not connected" : "Couldn't load detections"}
            action={<RetryButton onClick={refresh} label="Try again" />}
          >
            <p role="alert">{error.message}</p>
          </StatePanel>
        )}
        {(status === "ready" || refreshing) &&
          (runs.length === 0 ? (
            <StatePanel
              icon={<AudioLines className="size-5" />}
              title="No detections yet"
              action={<RetryButton onClick={refresh} label="Refresh" />}
            >
              When YOLO spots a bird, the ESP32 asks BirdNET for a clip and each run is uploaded here.
            </StatePanel>
          ) : (
            <>
              <ul className={cn("grid gap-4 lg:grid-cols-2", refreshing && "opacity-60")}>
                {runs.map((r) => (
                  <li key={r.id}>
                    <DetectionCard run={r} />
                  </li>
                ))}
              </ul>
              <GalleryPagination
                hasMore={nextCursor !== null}
                loading={loadingMore}
                error={loadMoreError}
                onLoadMore={loadMore}
              />
            </>
          ))}
      </section>
    </div>
  );
}
