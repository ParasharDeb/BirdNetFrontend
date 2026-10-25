import { AlertTriangle, ImageIcon, KeyRound, RefreshCw } from "lucide-react";
import type { GalleryError } from "./GalleryView";

export function SkeletonGrid({ count }: { count: number }) {
  return (
    <ul aria-label="Loading images" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-2xl border border-white/40 bg-white/20">
          <div className="aspect-square animate-pulse bg-white/35" />
          <div className="flex items-center justify-between gap-3 px-3 py-3">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/45" />
            <div className="h-3 w-10 animate-pulse rounded-full bg-white/35" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StatePanel({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/50 bg-white/25 px-6 py-12 text-center shadow-[0_8px_24px_rgb(40_80_110/0.08)] backdrop-blur-md">
      <span className="flex size-12 items-center justify-center rounded-full bg-white/60 text-[#0a7de9]">{icon}</span>
      <h2 className="mt-4 text-lg font-medium text-[#2b3540]">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-[#4d6473]">{children}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function RetryButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#2b3540] shadow-[0_4px_14px_rgb(40_80_110/0.12)] hover:bg-[#f4fbff]"
    >
      <RefreshCw className="size-4" />
      {label}
    </button>
  );
}

export function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <StatePanel
      icon={<ImageIcon className="size-5" />}
      title="No images yet"
      action={<RetryButton onClick={onRefresh} label="Refresh" />}
    >
      Upload JPG, PNG, WebP, GIF or AVIF files to the bucket, then refresh to see them here.
    </StatePanel>
  );
}

export function ErrorState({ error, onRetry }: { error: GalleryError; onRetry: () => void }) {
  const notConfigured = error.code === "NOT_CONFIGURED";
  return (
    <StatePanel
      icon={notConfigured ? <KeyRound className="size-5" /> : <AlertTriangle className="size-5" />}
      title={notConfigured ? "Gallery not connected" : "Couldn't load images"}
      action={<RetryButton onClick={onRetry} label="Try again" />}
    >
      <p role="alert">{error.message}</p>
      {notConfigured && (
        <p className="mt-2">
          See <code className="rounded bg-white/60 px-1">.env.example</code> for all variables.
        </p>
      )}
    </StatePanel>
  );
}
