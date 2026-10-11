import Image from "next/image";
import { ArrowUpRight, LockKeyhole, Sparkles } from "lucide-react";
import { landingAssets } from "@/lib/assets";
import { cn } from "@/lib/utils";

function ArrowBadge({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute flex h-30 w-30 items-center justify-center rounded-full stage:h-22 stage:w-22",
        light
          ? "bg-white text-[#3c4f5d] shadow-[0_calc(var(--spacing)*3)_calc(var(--spacing)*8)_rgb(40_80_110/0.16)]"
          : "border border-white/25 bg-white/18 text-white",
        className,
      )}
    >
      <ArrowUpRight className="h-13 w-13 stage:h-8.5 stage:w-8.5" strokeWidth={2} />
    </span>
  );
}

export function SecurityCard() {
  const lock = landingAssets.securityLock;
  return (
    <article className="glass relative min-h-130 r-22 stage:absolute stage:z-20 stage:min-h-0 stage:top-359 stage:left-325 stage:h-105 stage:w-181 stage:r-18">
      {lock.src ? (
        <Image
          src={lock.src}
          alt={lock.alt}
          width={lock.width}
          height={lock.height}
          className="absolute top-14 left-18 h-100 w-auto [mask-image:radial-gradient(ellipse_48%_50%_at_50%_50%,black_55%,transparent_100%)] stage:top-8 stage:left-14 stage:h-81"
        />
      ) : (
        <LockKeyhole aria-hidden className="absolute top-30 left-26 h-64 w-64 text-white/80 stage:top-22 stage:left-18 stage:h-56 stage:w-46" strokeWidth={1} />
      )}
      <div className="absolute top-30 left-100 stage:top-27 stage:left-80">
        <span className="inline-flex h-20 items-center rounded-full border border-white/50 bg-white/15 px-9 fs-10 text-white/90 stage:h-14 stage:px-6 stage:fs-5.5">
          Perfect Security
        </span>
        <h3 className="mt-8 fs-17 font-light text-white lh-21 stage:mt-6 stage:fs-12.5 stage:lh-15.5">
          AI ensures total
          <br />
          protection
        </h3>
      </div>
      <ArrowBadge className="top-8 right-8 stage:top-5 stage:right-6" />
    </article>
  );
}

export function AIAgentCard() {
  const orb = landingAssets.aiOrb;
  return (
    <article className="relative min-h-190 stage:absolute stage:min-h-0 stage:z-20 stage:top-317 stage:left-517 stage:h-146 stage:w-136">
      <div aria-hidden className="absolute inset-0 rounded-[22px] border border-white/80 bg-[linear-gradient(170deg,rgb(255_255_255/0.95),rgb(219_237_245/0.85))] shadow-[0_8px_18px_rgb(40_90_130/0.16)] stage:hidden" />
      {/* notched card silhouette: narrow tab on top-left, full width below */}
      <svg
        aria-hidden
        viewBox="0 0 136 146"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden h-full w-full overflow-visible stage:block drop-shadow-[0_calc(var(--spacing)*8)_calc(var(--spacing)*18)_rgb(40_90_130/0.16)]"
      >
        <defs>
          <linearGradient id="ai-card-fill" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.97" />
            <stop offset="0.7" stopColor="#f3fafd" stopOpacity="0.9" />
            <stop offset="1" stopColor="#dbedf5" stopOpacity="0.82" />
          </linearGradient>
        </defs>
        <path
          d="M16 0H53Q69 0 69 16V27Q69 40 83 40H120Q136 40 136 56V130Q136 146 120 146H16Q0 146 0 130V16Q0 0 16 0Z"
          fill="url(#ai-card-fill)"
          stroke="white"
          strokeOpacity="0.8"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {orb.src ? (
        <Image
          src={orb.src}
          alt={orb.alt}
          width={orb.width}
          height={orb.height}
          className="absolute top-14 left-18 h-52 w-52 drop-shadow-[0_calc(var(--spacing)*4)_calc(var(--spacing)*8)_rgb(20_100_220/0.3)] stage:top-13 stage:left-15 stage:h-40 stage:w-40"
        />
      ) : (
        <span
          aria-hidden
          className="absolute top-14 left-18 flex h-52 w-52 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#9fe3ff,#1f7ef0_55%,#0a3fb0)] text-white stage:top-13 stage:left-15 stage:h-40 stage:w-40"
        >
          <Sparkles className="h-1/2 w-1/2" strokeWidth={1.5} />
        </span>
      )}
      <div className="absolute top-84 left-18 stage:top-63 stage:left-16">
        <h3 className="fs-17 font-light text-[#3d4b58] lh-21 stage:fs-12.5 stage:lh-15">
          Integrated AI
          <br />
          Agent
        </h3>
        <p className="mt-12 max-w-200 fs-11 font-light text-[#7a8894] lh-15 stage:mt-9 stage:max-w-80 stage:fs-6.5 stage:lh-9.5">
          Integrated AI agent for personalized client experiences.
        </p>
      </div>
      <ArrowBadge light className="top-60 right-10 stage:top-47 stage:right-5" />
    </article>
  );
}

export function StatisticsCard() {
  return (
    <article className="glass relative min-h-130 r-22 sm:col-span-2 stage:absolute stage:z-20 stage:min-h-0 stage:top-360 stage:left-664 stage:h-104 stage:w-180 stage:r-18">
      <p className="absolute top-20 left-18 flex items-baseline font-extralight text-white stage:top-17 stage:left-13">
        <span className="fs-64 leading-none font-thin tracking-[-0.03em] stage:fs-52">42</span>
        <span className="ml-2 fs-28 leading-none font-light stage:fs-25">%</span>
      </p>
      <p className="absolute right-16 bottom-18 max-w-160 fs-10 font-light text-white/85 lh-13 stage:right-auto stage:bottom-auto stage:top-71 stage:left-46 stage:max-w-none stage:fs-6.5 stage:lh-8.5">
        Join us in redefining the future of
        <br />
        security with innovative solutions
      </p>
      <ArrowBadge className="top-8 right-8 stage:top-4.5 stage:right-5" />
    </article>
  );
}

export function ActiveUsers() {
  return (
    <div className="relative flex h-36 items-center sm:col-span-2 stage:absolute stage:z-20 stage:top-295 stage:left-659 stage:h-29 stage:w-186">
      <div className="relative z-10 flex">
        {landingAssets.avatars.map((avatar, i) =>
          avatar.src ? (
            <Image
              key={avatar.src}
              src={avatar.src}
              alt={avatar.alt}
              width={avatar.width}
              height={avatar.height}
              className="h-36 w-36 rounded-full object-cover ring-1 ring-white/50 not-first:-ml-12 stage:h-29 stage:w-29 stage:not-first:-ml-10"
              style={{ zIndex: i }}
            />
          ) : (
            <span
              key={i}
              aria-hidden
              className="h-36 w-36 rounded-full bg-gradient-to-br from-[#e3eef4] to-[#9db9c8] ring-1 ring-white/50 not-first:-ml-12 stage:h-29 stage:w-29 stage:not-first:-ml-10"
            />
          ),
        )}
      </div>
      <div className="-ml-20 flex h-26 items-center gap-10 rounded-full border border-white/50 bg-white/10 pr-12 pl-30 stage:absolute stage:top-5 stage:left-66 stage:ml-0 stage:h-20 stage:w-120 stage:gap-0 stage:pr-0 stage:pl-0">
        <span className="fs-10 text-white/70 stage:absolute stage:left-25 stage:fs-7.5">Active Users</span>
        <span className="fs-15 font-medium text-white stage:absolute stage:left-77 stage:fs-12">+323</span>
      </div>
    </div>
  );
}
