import type { Metadata } from "next";
import { BirdDirectory } from "@/components/birds/BirdDirectory";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { campusBirds } from "@/lib/birds";

export const metadata: Metadata = {
  title: "Birds in the campus",
  description: "The ten campus bird species Blue Bird listens for, and how well it can hear each one.",
};

export default function BirdsPage() {
  const inModel = campusBirds.filter((b) => b.detection === "birdnet").length;
  return (
    <PageShell current="/birds">
      <PageHeader eyebrow="Field guide · Assam" title={<>Birds in the campus</>} ghost="BIRDS">
        The ten species our system listens for. {inModel} of them are in BirdNET&apos;s model; the other{" "}
        {campusBirds.length - inModel} need our custom classifier — we say so on each card rather than pretend.
      </PageHeader>
      <BirdDirectory birds={campusBirds} />
    </PageShell>
  );
}
