import { BirdImage } from "./BirdImage";
import { HeroContent } from "./HeroContent";
import { ActiveUsers, AIAgentCard, SecurityCard, StatisticsCard } from "./InfoCards";
import { Navbar } from "./Navbar";

function BackgroundTypography() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-78 z-0 flex justify-between px-4 font-serif leading-none font-normal whitespace-nowrap select-none stage:inset-x-0 stage:top-0 stage:block stage:px-0"
    >
      <span className="serif-ghost inline-block origin-left scale-x-[1.32] fs-62 stage:absolute stage:top-95 stage:-left-10 stage:fs-170">
        BLUE
      </span>
      <span className="serif-ghost inline-block origin-right scale-x-[1.32] fs-62 stage:absolute stage:top-95 stage:right-2 stage:fs-170">
        BIRD
      </span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero-backdrop relative isolate min-h-svh overflow-hidden stage:r-16">
      {/* Stage: 871 design px wide, at least 489 tall; taller viewports add room under the nav. */}
      <div className="relative mx-auto flex min-h-svh flex-col px-16 pt-16 pb-40 stage:block stage:h-[max(calc(var(--spacing)*489),100svh)] stage:min-h-0 stage:w-871 stage:p-0">
        <Navbar current="/" />
        {/* Scene: the reference composition, anchored to the bottom of the stage. */}
        <div className="contents stage:absolute stage:inset-x-0 stage:bottom-0 stage:block stage:h-489">
          <BackgroundTypography />
          <BirdImage />
          <HeroContent />
          <div className="relative z-20 mt-36 grid gap-12 sm:grid-cols-2 stage:static stage:mt-0 stage:block">
            <ActiveUsers />
            <SecurityCard />
            <AIAgentCard />
            <StatisticsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
