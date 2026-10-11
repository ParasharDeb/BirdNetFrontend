import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function HeroContent() {
  return (
    <div className="relative z-20 -mt-120 stage:absolute stage:top-286 stage:left-27 stage:mt-0">
      <h1 className="fs-44 font-light tracking-[-0.02em] text-white lh-48 stage:fs-27 stage:lh-28">
        Innovation
        <br />
        <span className="ml-30 text-white/45 stage:ml-28">&amp;</span>
        <span className="ml-12 stage:ml-8">security</span>
      </h1>

      <p className="mt-16 max-w-260 fs-14 font-light text-white/85 lh-20 stage:mt-14 stage:ml-27 stage:max-w-none stage:fs-6.5 stage:lh-9.5">
        We are at the forefront of merging
        <br />
        cutting-edge technology
      </p>

      <div className="mt-28 flex items-center gap-10 stage:mt-26 stage:ml-27 stage:gap-7">
        <Link
          href="/how-we-built-it"
          className="group flex h-52 items-center gap-24 rounded-full bg-[linear-gradient(90deg,#0074fe_0%,#0383e5_55%,#088fd1_100%)] pr-8 pl-20 fs-15 text-white shadow-[0_6px_18px_rgb(0_110_230/0.28)] transition-[filter] hover:brightness-110 stage:h-32 stage:w-109 stage:justify-between stage:gap-0 stage:pr-6 stage:pl-11 stage:fs-8.5 stage:shadow-[0_calc(var(--spacing)*4)_calc(var(--spacing)*12)_rgb(0_110_230/0.25)]"
        >
          Our Solutions
          <span className="flex h-36 w-36 items-center justify-center rounded-full bg-[#fdfffc] text-[#0a7de9] transition-transform group-hover:translate-x-2 stage:h-21 stage:w-21">
            <ChevronRight className="h-16 w-16 stage:h-10 stage:w-10" strokeWidth={2.2} />
          </span>
        </Link>
        <Link
          href="/about"
          className="flex h-52 items-center rounded-full bg-[#fffdfb] px-24 fs-15 text-[#2b3540] shadow-[0_4px_14px_rgb(40_80_110/0.1)] transition-colors hover:bg-white stage:h-31 stage:w-68 stage:justify-center stage:px-0 stage:fs-8.5"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
