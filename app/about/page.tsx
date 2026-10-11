import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, AudioLines, Camera, Eye, ScanSearch } from "lucide-react";
import { PageHeader, PageShell, SectionTitle } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "About us",
  description: "Blue Bird is a vision-triggered campus bird-monitoring prototype: see a bird, then listen, identify and capture.",
};

const principle = [
  {
    icon: Eye,
    title: "Detect visually",
    body: "A laptop webcam runs YOLOv8 and only asks one question: is there a bird in the frame?",
  },
  {
    icon: AudioLines,
    title: "Listen selectively",
    body: "Only then does an ESP32 record a short clip from its INMP441 microphone. No bird, no recording.",
  },
  {
    icon: ScanSearch,
    title: "Identify acoustically",
    body: "The clip goes over Wi-Fi to a FastAPI server, where BirdNET names the species from its call.",
  },
  {
    icon: Camera,
    title: "Capture selectively",
    body: "If it is one of our ten target species, the system keeps the photo. Everything else is let go.",
  },
];

const scope = [
  ["A working prototype", "Built to prove the full pipeline end to end on a desk, not yet a weatherproof field station."],
  ["Honest about accuracy", "We don't quote accuracy or latency we haven't measured. The numbers on this site are labelled with where they came from."],
  ["Modular on purpose", "Vision, firmware and the BirdNET server can each be developed and tested on their own."],
  ["Kept simple", "No external ADC, no MOSFET mic switching, no extra camera module — the mic stays powered and software decides when to listen."],
];

export default function AboutPage() {
  return (
    <PageShell current="/about">
      <PageHeader eyebrow="About us" title={<>Listening to campus birds — only when it matters</>} ghost="ABOUT">
        Blue Bird is a small campus project from Assam. It pairs a camera, a cheap microphone and BirdNET so we can
        identify and photograph the birds around us without recording all day.
      </PageHeader>

      <section className="mt-16">
        <SectionTitle kicker="The idea">Four steps, in this order</SectionTitle>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principle.map((step, i) => (
            <li key={step.title} className="glass-panel relative rounded-[24px] p-5">
              <span className="absolute top-4 right-5 text-[40px] leading-none font-extralight text-white/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex size-11 items-center justify-center rounded-full bg-white/60 text-[#0a6fe0]">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-light text-[#24384a]">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#2f4554]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <SectionTitle kicker="Why selective">Most audio is just noise</SectionTitle>
          <div className="space-y-4 text-[16px] leading-relaxed text-[#2f4554]">
            <p>
              Recording around the clock means hours of wind, traffic and voices to store, upload and analyse — and a
              classifier that will still try to name a bird in pure noise. BirdNET has no &ldquo;none of the
              above&rdquo; answer, so the less empty audio we feed it, the fewer false alarms we get.
            </p>
            <p>
              Letting the camera decide when to listen keeps the microphone&apos;s work to a few seconds per sighting,
              and lets two different models do what each is good at: YOLOv8 for <em>is it a bird</em>, BirdNET for{" "}
              <em>which bird</em>.
            </p>
          </div>
        </div>
        <div className="glass-panel rounded-[26px] p-6">
          <p className="text-xs font-medium tracking-[0.14em] text-[#0a6fe0] uppercase">In one sentence</p>
          <p className="mt-3 text-[19px] leading-relaxed font-light text-[#24384a]">
            A vision-triggered IoT system that uses YOLOv8 to detect birds, selectively records their sounds with an
            ESP32 and INMP441, identifies the species with BirdNET through a FastAPI server, and captures an image when
            the species is on our target list.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle kicker="Scope">What this project is — and isn&apos;t yet</SectionTitle>
        <ul className="grid gap-4 sm:grid-cols-2">
          {scope.map(([title, body]) => (
            <li key={title} className="rounded-[22px] border border-white/45 bg-white/20 p-5">
              <h3 className="text-lg font-light text-[#24384a]">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#2f4554]">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[#2f4554]">
          Once the core pipeline is reliable, the natural next steps are a standalone outdoor unit with battery or
          solar power, location tagging, an observation database and a dashboard of species over time.
        </p>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/birds", title: "Meet the birds", body: "The ten species we listen for." },
          { href: "/how-we-built-it", title: "How we built it", body: "Hardware, models and the decisions behind them." },
          { href: "/setup", title: "Set it up", body: "Build your own, step by step." },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="glass-panel group flex items-start justify-between gap-4 rounded-[24px] p-5 transition-transform hover:-translate-y-0.5"
          >
            <span>
              <span className="block text-lg font-light text-[#24384a]">{link.title}</span>
              <span className="mt-1 block text-sm text-[#4d6473]">{link.body}</span>
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#3c4f5d] shadow transition-transform group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
