import Image from "next/image";
import { landingAssets } from "@/lib/assets";

const bird = landingAssets.heroBird;

// The reference bird is lighter and more cyan than the source art, with a soft-focus lower body.
const tone = "hue-rotate(-20deg) saturate(0.88) brightness(1.06) contrast(0.98)";

/**
 * Hero bird. Two stacked copies: a sharp one that fades out towards the bottom and a
 * blurred one that takes over, reproducing the reference's depth-of-field falloff.
 */
export function BirdImage() {
  if (!bird.src) {
    return (
      <div
        aria-hidden
        className="pointer-events-none relative z-10 mx-auto aspect-[820/1057] w-[min(380px,88vw)] rounded-t-full bg-[radial-gradient(ellipse_at_50%_35%,#4f9fe8_0%,#2a6fd0_45%,transparent_72%)] opacity-70 blur-md stage:absolute stage:top-36 stage:left-265 stage:mx-0 stage:w-320"
      />
    );
  }

  return (
    <div className="pointer-events-none relative z-10 mx-auto -mt-30 aspect-[820/1057] w-[min(380px,88vw)] select-none stage:absolute stage:top-36 stage:left-265 stage:mx-0 stage:mt-0 stage:w-320">
      <Image
        src={bird.src}
        alt=""
        aria-hidden
        width={bird.width}
        height={bird.height}
        sizes="(min-width: 768px) 46vw, 88vw"
        className="absolute inset-x-0 top-0 h-[calc(100%+var(--spacing)*70)] w-full object-fill [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_36%,black_58%,black_84%,transparent_100%),linear-gradient(to_right,transparent_0%,black_18%)]"
        style={{ filter: `${tone} blur(calc(var(--spacing) * 7))` }}
      />
      <Image
        src={bird.src}
        alt={bird.alt}
        width={bird.width}
        height={bird.height}
        sizes="(min-width: 768px) 46vw, 88vw"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-contain [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_42%,transparent_80%),linear-gradient(to_right,transparent_0%,black_14%)]"
        style={{ filter: tone }}
      />
      {/* warm rim light along the bird's right edge, as in the reference */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_32%_40%_at_82%_42%,rgb(255_190_165/0.55),transparent_70%)] mix-blend-soft-light [mask-size:100%_100%]"
        style={{ maskImage: `url(${bird.src})`, WebkitMaskImage: `url(${bird.src})` }}
      />
    </div>
  );
}
