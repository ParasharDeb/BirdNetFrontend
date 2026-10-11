import { Loader2 } from "lucide-react";
import type { GalleryError } from "./GalleryView";

type Props = {
  hasMore: boolean;
  loading: boolean;
  error: GalleryError | null;
  onLoadMore: () => void;
};

export function GalleryPagination({ hasMore, loading, error, onLoadMore }: Props) {
  if (!hasMore) {
    return <p className="mt-10 text-center text-sm text-[#4d6473]">You&apos;ve reached the end.</p>;
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {error && (
        <p role="alert" className="text-sm text-[#a03a3a]">
          {error.message}
        </p>
      )}
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loading}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#2b3540] shadow-[0_4px_14px_rgb(40_80_110/0.12)] transition-colors hover:bg-[#f4fbff] disabled:opacity-70"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Loading…" : error ? "Try again" : "Load more"}
      </button>
    </div>
  );
}
