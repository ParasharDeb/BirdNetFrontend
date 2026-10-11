/**
 * Central image registry for the landing page.
 *
 * Every image the landing page renders is referenced here, so swapping artwork is a
 * one-line change. `src` may be a path under /public or an absolute URL (absolute URLs
 * must also be allowed in `images.remotePatterns` in next.config.ts).
 * Set `src` to null to fall back to the built-in CSS treatment for that slot.
 *
 * Provenance (2026-10-11):
 *  - heroBird, aiOrb, avatars[0..2]: generated with Higgsfield (gpt_image_2_5) for this
 *    project; backgrounds removed locally. Job ids are kept for traceability.
 *  - securityLock, avatars[3]: cropped from the reference screenshot (public/image.png)
 *    because Higgsfield's daily generation limit was reached. Low resolution — replace
 *    with a proper transparent PNG when available.
 */

export type ImageAsset = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  source: "higgsfield" | "reference-crop";
  higgsfieldJobId?: string;
};

export const landingAssets = {
  heroBird: {
    src: "/images/hero-bird.png",
    alt: "Vivid blue bird portrait",
    width: 820,
    height: 1057,
    source: "higgsfield",
    higgsfieldJobId: "183df49d-87b8-463a-887b-55a7d8479efc",
  },
  aiOrb: {
    src: "/images/ai-orb.png",
    alt: "Glossy blue AI orb",
    width: 256,
    height: 256,
    source: "higgsfield",
    higgsfieldJobId: "0655ec2e-cc2a-44f1-8343-84f9113be0f7",
  },
  securityLock: {
    src: "/images/security-lock.png",
    alt: "Glass padlock with shield",
    width: 106,
    height: 162,
    source: "reference-crop",
  },
  avatars: [
    {
      src: "/images/avatar-1.png",
      alt: "",
      width: 128,
      height: 128,
      source: "higgsfield",
      higgsfieldJobId: "e1b7c329-ecb7-4094-aa53-117175bf6dc8",
    },
    {
      src: "/images/avatar-2.png",
      alt: "",
      width: 128,
      height: 128,
      source: "higgsfield",
      higgsfieldJobId: "9defaf99-0455-4364-9643-51b0dc63e55d",
    },
    {
      src: "/images/avatar-3.png",
      alt: "",
      width: 128,
      height: 128,
      source: "higgsfield",
      higgsfieldJobId: "ab076f6c-a7ee-46a5-a501-7803394b1357",
    },
    {
      src: "/images/avatar-4.png",
      alt: "",
      width: 58,
      height: 58,
      source: "reference-crop",
    },
  ],
} satisfies Record<string, ImageAsset | ImageAsset[]>;
