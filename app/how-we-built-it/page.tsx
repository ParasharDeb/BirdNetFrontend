import type { Metadata } from "next";
import { Brain, Camera, CircleDashed, CircleCheck, Cpu, Mic, Server, Webcam, Wifi } from "lucide-react";
import { PageHeader, PageShell, SectionTitle } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "How we built it",
  description: "The hardware, models and design decisions behind Blue Bird's vision-triggered bird monitoring.",
};

const pipeline = [
  { icon: Webcam, where: "Laptop", title: "Watch", body: "The webcam feeds YOLOv8, filtered to COCO's single “bird” class." },
  { icon: Cpu, where: "Laptop → ESP32", title: "Trigger", body: "A sighting calls the ESP32's /trigger endpoint over the local network." },
  { icon: Mic, where: "ESP32 + INMP441", title: "Record", body: "5 s of 48 kHz audio over I2S, DC-filtered and turned into 16-bit WAV on the fly." },
  { icon: Wifi, where: "ESP32 → server", title: "Upload", body: "The clip streams straight into a multipart POST to /analyze — no SD card needed." },
  { icon: Brain, where: "FastAPI", title: "Identify", body: "BirdNET scores 3 s windows and the server filters them down to our ten targets." },
  { icon: Server, where: "FastAPI → ESP32", title: "Decide", body: "A target scoring ≥ 0.70 is “confirmed”; the ESP32 answers CAPTURE, otherwise IGNORE." },
  { icon: Camera, where: "Laptop", title: "Capture", body: "On CAPTURE the laptop saves the frame. Everything else is discarded." },
];

const stats = [
  { value: "9–14", unit: "fps", label: "YOLOv8n detections on a Ryzen 5 5500U CPU at 480 px, no GPU" },
  { value: "~25×", unit: "real-time", label: "BirdNET on the same laptop once warm: ~2–3 s per minute of audio" },
  { value: "5", unit: "s @ 48 kHz", label: "per clip — longer than BirdNET's 3 s window so calls aren't cut in half" },
  { value: "0.70", unit: "threshold", label: "score at which a target bird counts as confirmed" },
];

const decisions = [
  {
    title: "Drop stale frames, don't queue them",
    body: "The camera runs at 30 fps but YOLO manages ~10 on CPU. A one-slot mailbox always hands the detector the newest frame, so the preview stays smooth and latency stays flat instead of growing.",
  },
  {
    title: "Overlap the listening windows",
    body: "BirdNET judges 3-second windows. The ESP32 asks for 2 s of overlap, so a window starts every second and a call that straddles a boundary is still heard whole.",
  },
  {
    title: "A small classifier on BirdNET's embeddings (next)",
    body: "Stock BirdNET picks among 6,522 species, and our test recordings of Black Kite and Black Drongo peaked at just 0.43 and 0.51 — below the 0.70 bar. The training pipeline for a classifier that only chooses between our targets and “background” is written; training it should lift clear calls well above that, and can teach it species BirdNET lacks.",
  },
  {
    title: "Pick hard negatives on purpose",
    body: "Background training audio includes look-alikes such as Ashy Drongo, Shikra, Tree Sparrow and Rose-ringed Parakeet, plus wind and noise. Positives are copied with added noise to mimic a cheap mic outdoors.",
  },
  {
    title: "Keep the range filter from hiding our birds",
    body: "BirdNET's location filter is built from wild sightings and would drop domestic geese and even peafowl in Assam. Our targets always stay eligible; every other species is still filtered.",
  },
  {
    title: "Say “can't detect”, not nothing",
    body: "Greater Adjutant and White-winged Duck aren't in BirdNET. The API still lists them with available_in_model: false, so an app shows the truth instead of a silent “not heard”.",
  },
];

const status = [
  { done: true, text: "YOLOv8 bird detection running live on the laptop webcam" },
  { done: true, text: "ESP32 records from the INMP441 and streams the clip to the server" },
  { done: true, text: "FastAPI + BirdNET server with target filtering and the range-filter fix" },
  { done: false, text: "Custom target classifier — the training pipeline is written, the model isn't trained yet" },
  { done: true, text: "ESP32 replies CAPTURE / IGNORE from the server's decision" },
  { done: false, text: "Detector calling /trigger automatically — today we trigger it by hand" },
  { done: false, text: "Automatic photo on CAPTURE — today frames are saved with the s key" },
];

export default function HowWeBuiltItPage() {
  return (
    <PageShell current="/how-we-built-it">
      <PageHeader eyebrow="How we built it" title={<>See, then listen, then decide</>} ghost="BUILD">
        Three small programs on three devices — a vision app on the laptop, firmware on an ESP32, and a BirdNET server
        — each doing one job and testable on its own.
      </PageHeader>

      <section className="mt-16">
        <SectionTitle kicker="The pipeline">From a flicker of wings to a saved photo</SectionTitle>
        <ol className="relative grid gap-3 md:grid-cols-7 md:gap-2">
          {pipeline.map((step, i) => (
            <li key={step.title} className="glass-panel relative flex gap-4 rounded-[22px] p-4 md:flex-col md:gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-[#0a6fe0]">
                <step.icon className="size-5" />
              </span>
              <span>
                <span className="block text-[11px] tracking-wide text-[#4d6473] uppercase">
                  {i + 1} · {step.where}
                </span>
                <span className="mt-0.5 block text-lg font-light text-[#24384a]">{step.title}</span>
                <span className="mt-1 block text-[13.5px] leading-snug text-[#2f4554]">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionTitle kicker="Measured on our dev laptop">A few real numbers</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-panel rounded-[24px] p-5">
              <p className="flex items-baseline gap-2 text-white">
                <span className="text-[48px] leading-none font-thin tracking-[-0.03em]">{s.value}</span>
                <span className="text-sm text-white/90">{s.unit}</span>
              </p>
              <p className="mt-3 text-sm leading-snug text-[#2f4554]">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#4d6473]">
          Throughput varies with thermal throttling; on battery the laptop sits at the low end. Accuracy will be measured
          in the field before we quote it.
        </p>
      </section>

      <section className="mt-16">
        <SectionTitle kicker="Design decisions">What we chose, and why</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {decisions.map((d) => (
            <article key={d.title} className="rounded-[22px] border border-white/45 bg-white/20 p-5">
              <h3 className="text-lg font-light text-[#24384a]">{d.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#2f4554]">{d.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle kicker="Stack">What it runs on</SectionTitle>
          <dl className="glass-panel divide-y divide-white/40 rounded-[24px] px-5">
            {[
              ["Vision", "Python, OpenCV, Ultralytics YOLOv8n (CPU-only PyTorch)"],
              ["Firmware", "ESP32 (Arduino core, ESP_I2S + WebServer), INMP441 I2S MEMS mic"],
              ["Server", "FastAPI, birdnetlib (BirdNET v2.4), TensorFlow, librosa"],
              ["Classifier", "Trained on BirdNET embeddings from xeno-canto recordings"],
              ["Website", "Next.js, Tailwind CSS, Framer Motion, S3 for the image gallery"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-3.5 text-[15px]">
                <dt className="text-[#4d6473]">{k}</dt>
                <dd className="text-[#24384a]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SectionTitle kicker="Status">Where we are today</SectionTitle>
          <ul className="glass-panel space-y-3 rounded-[24px] p-5">
            {status.map((s) => (
              <li key={s.text} className="flex gap-3 text-[15px] leading-snug text-[#24384a]">
                {s.done ? (
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-[#1f8a5b]" />
                ) : (
                  <CircleDashed className="mt-0.5 size-5 shrink-0 text-[#b26a1a]" />
                )}
                {s.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
