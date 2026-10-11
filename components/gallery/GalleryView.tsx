"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage, ImagesErrorResponse, ImagesResponse } from "@/lib/gallery-types";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryPagination } from "./GalleryPagination";
import { ImageGrid } from "./ImageGrid";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { EmptyState, ErrorState, SkeletonGrid } from "./GalleryStates";

const PAGE_SIZE = 24;

export type GalleryError = { code: string; message: string };

async function fetchPage(token: string | null, signal: AbortSignal): Promise<ImagesResponse> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (token) params.set("token", token);
  const res = await fetch(`/api/images?${params}`, { cache: "no-store", signal });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (body as ImagesErrorResponse | null)?.error;
    throw Object.assign(new Error(err?.message ?? `Request failed (${res.status})`), {
      code: err?.code ?? "AWS_ERROR",
    });
  }
  return body as ImagesResponse;
}

function toGalleryError(err: unknown): GalleryError {
  if (err instanceof Error) {
    return { code: (err as Error & { code?: string }).code ?? "NETWORK", message: err.message };
  }
  return { code: "NETWORK", message: "Something went wrong." };
}

export function GalleryView() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [bucket, setBucket] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<GalleryError | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<GalleryError | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const controller = useRef<AbortController | null>(null);

  // Fetches one page and applies it in promise callbacks, so it is safe to start from an effect.
  const run = useCallback((token: string | null) => {
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    const append = token !== null;

    fetchPage(token, ac.signal).then(
      (page) => {
        setImages((prev) => (append ? [...prev, ...page.images] : page.images));
        setNextToken(page.nextToken);
        setBucket(page.bucket);
        setStatus("ready");
        setLoadingMore(false);
      },
      (err: unknown) => {
        if (ac.signal.aborted) return;
        setLoadingMore(false);
        if (append) setLoadMoreError(toGalleryError(err));
        else {
          setError(toGalleryError(err));
          setStatus("error");
        }
      },
    );
    return ac;
  }, []);

  useEffect(() => {
    const ac = run(null);
    return () => ac.abort();
  }, [run]);

  const refresh = () => {
    setStatus("loading");
    setError(null);
    setLoadingMore(false);
    setLoadMoreError(null);
    setSelected(null);
    run(null);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setLoadMoreError(null);
    run(nextToken);
  };

  const refreshing = status === "loading" && images.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-8 sm:pt-8">
      <GalleryHeader
        bucket={bucket}
        count={images.length}
        hasMore={nextToken !== null}
        refreshing={status === "loading"}
        onRefresh={refresh}
      />

      <section aria-live="polite" aria-busy={status === "loading"} className="mt-8">
        {status === "loading" && !refreshing && <SkeletonGrid count={12} />}
        {status === "error" && error && <ErrorState error={error} onRetry={refresh} />}
        {(status === "ready" || refreshing) &&
          (images.length === 0 ? (
            <EmptyState onRefresh={refresh} />
          ) : (
            <>
              <ImageGrid images={images} onSelect={setSelected} dimmed={refreshing} />
              <GalleryPagination
                hasMore={nextToken !== null}
                loading={loadingMore}
                error={loadMoreError}
                onLoadMore={loadMore}
              />
            </>
          ))}
      </section>

      <ImagePreviewModal
        images={images}
        index={selected}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </div>
  );
}
