"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery-types";
import { formatBytes } from "@/lib/utils";

type Props = {
  image: GalleryImage;
  priority?: boolean;
  onOpen: () => void;
};

export function ImageCard({ image, priority = false, onOpen }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-2xl border border-white/50 bg-white/25 text-left shadow-[0_8px_24px_rgb(40_80_110/0.1)] backdrop-blur-md transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgb(40_80_110/0.16)] focus-visible:ring-2 focus-visible:ring-[#0074fe] focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden bg-[#d7e7ee]">
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6f8796]">
            <ImageOff className="size-6" />
            <span className="text-xs">Preview unavailable</span>
          </div>
        ) : (
          <Image
            src={image.url}
            alt={image.filename}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            loading={priority ? "eager" : "lazy"}
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 px-3 py-2.5">
        <span className="truncate text-sm text-[#3c4f5d]" title={image.key}>
          {image.filename}
        </span>
        <span className="shrink-0 text-xs text-[#6f8796]">{formatBytes(image.size)}</span>
      </div>
    </button>
  );
}
