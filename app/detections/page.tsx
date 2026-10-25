import type { Metadata } from "next";
import { DetectionsView } from "@/components/detections/DetectionsView";
import { PageHeader, PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Detections",
  description: "BirdNET results and audio clips stored in the Blue Bird S3 bucket.",
};

export default function DetectionsPage() {
  return (
    <PageShell current="/detections">
      <PageHeader eyebrow="Live from BirdNET" title={<>Detections</>} ghost="HEARD">
        Every time YOLO spots a bird, the ESP32 asks BirdNET to analyse a clip. Each run lands here with its audio
        and the full results CSV.
      </PageHeader>
      <DetectionsView />
    </PageShell>
  );
}
