import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Logo } from "@/components/landing/Navbar";
import { cn } from "@/lib/utils";

type Props = {
  bucket: string | null;
  count: number;
  hasMore: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

export function GalleryHeader({ bucket, count, hasMore, refreshing, onRefresh }: Props) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/20 py-1.5 pr-3.5 pl-2.5 text-sm text-[#3c4f5d] transition-colors hover:bg-white/40"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <Logo className="h-3.5 w-10 text-white drop-shadow-[0_1px_2px_rgb(60_100_130/0.3)]" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">Gallery</h1>
          <p className="mt-2 text-sm text-[#4d6473]">
            {bucket ? (
              <>
                Images from <span className="font-medium text-[#3c4f5d]">{bucket}</span>
                {count > 0 && (
                  <>
                    {" "}· {count} loaded{hasMore ? ", more available" : ""}
                  </>
                )}
              </>
            ) : (
              "Images stored in Amazon S3"
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-[linear-gradient(90deg,#0074fe,#088fd1)] px-5 text-sm font-medium text-white shadow-[0_6px_18px_rgb(0_110_230/0.25)] transition-[filter,opacity] hover:brightness-110 disabled:opacity-70 sm:self-auto"
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </header>
  );
}
