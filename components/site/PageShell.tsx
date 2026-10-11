import { Navbar } from "@/components/landing/Navbar";

/**
 * Frame for every page other than the landing hero: same rounded frame, palette and
 * navbar, but normal document flow so content can scroll.
 */
export function PageShell({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <main className="min-h-svh">
      <div className="page-backdrop relative isolate min-h-svh overflow-hidden">
        {/* nav sits on the same 871-px stage grid as the landing page so it lines up exactly */}
        <div className="stage-scope relative mx-auto px-16 pt-16 stage:h-56 stage:w-871 stage:p-0">
          <Navbar current={current} />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 pt-10 pb-24 sm:px-8 sm:pt-14">{children}</div>
        <footer className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/40 px-5 py-8 text-sm text-[#4d6473] sm:px-8">
          <span>Blue Bird · selective bio-acoustic bird monitoring</span>
          <span>A campus prototype — YOLOv8 · ESP32 · BirdNET</span>
        </footer>
      </div>
    </main>
  );
}

/** Page title with the same translucent serif "ghost" word used behind the hero bird. */
export function PageHeader({
  eyebrow,
  title,
  ghost,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  ghost: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative">
      <span
        aria-hidden
        className="serif-ghost pointer-events-none absolute -top-6 right-0 origin-right scale-x-[1.32] font-serif text-[clamp(72px,14vw,190px)] leading-none select-none sm:-top-10"
      >
        {ghost}
      </span>
      <div className="relative">
        <p className="inline-flex items-center rounded-full border border-white/55 bg-white/20 px-3 py-1 text-xs tracking-wide text-[#3c4f5d]">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-[clamp(40px,6vw,68px)] leading-[1.02] font-light tracking-[-0.025em] text-white">
          {title}
        </h1>
        {children && <div className="mt-5 max-w-2xl text-[17px] leading-relaxed font-light text-[#2f4554]">{children}</div>}
      </div>
    </header>
  );
}

export function SectionTitle({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      {kicker && <p className="text-xs font-medium tracking-[0.14em] text-[#0a6fe0] uppercase">{kicker}</p>}
      <h2 className="mt-1.5 text-[28px] leading-tight font-light tracking-[-0.015em] text-[#24384a] sm:text-[34px]">
        {children}
      </h2>
    </div>
  );
}
