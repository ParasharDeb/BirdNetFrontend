import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/GalleryView";

export const metadata: Metadata = {
  title: "Gallery — Blue Bird",
  description: "Images stored in the Blue Bird S3 bucket.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#c5dce4_0%,#b8d1dc_55%,#a3c0ce_100%)]">
      <GalleryView />
    </main>
  );
}
