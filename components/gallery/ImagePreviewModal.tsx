"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery-types";
import { formatBytes } from "@/lib/utils";

type Props = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function ImagePreviewModal({ images, index, onClose, onNavigate }: Props) {
  const image = index !== null ? images[index] : undefined;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = image !== undefined;

  // Opening: lock scroll, move focus in, and restore both on close.
  useEffect(() => {
    if (!open) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      returnFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && index < images.length - 1) onNavigate(index + 1);
      else if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      else if (e.key === "Tab" && dialogRef.current) {
        // keep focus inside the dialog
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {image && index !== null && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2230]/70 p-3 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={image.filename}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-[#e9f3f7] shadow-2xl"
          >
            <div className="relative h-[min(72svh,760px)] w-full bg-[#cfe0e8]">
              <Image
                key={image.key}
                src={image.url}
                alt={image.filename}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onNavigate(index - 1)}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#2b3540] shadow hover:bg-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => onNavigate(index + 1)}
                  aria-label="Next image"
                  className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#2b3540] shadow hover:bg-white"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#2b3540]">{image.filename}</p>
                <p className="truncate text-xs text-[#6f8796]">
                  {formatBytes(image.size)}
                  {image.lastModified && ` · ${new Date(image.lastModified).toLocaleString()}`}
                  {` · ${index + 1} of ${images.length}`}
                </p>
              </div>
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#3c4f5d]/15 px-3 text-xs text-[#3c4f5d] hover:bg-white"
              >
                <ExternalLink className="size-3.5" />
                Original
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="flex size-9 items-center justify-center rounded-full bg-[#3c4f5d] text-white hover:bg-[#2b3540]"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
