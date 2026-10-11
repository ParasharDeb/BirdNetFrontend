import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/site/LoginForm";
import { PageShell } from "@/components/site/PageShell";
import { landingAssets } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Blue Bird.",
};

export default function LoginPage() {
  const bird = landingAssets.heroBird;
  return (
    <PageShell current="/login">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
        <div className="relative hidden min-h-[520px] lg:block">
          <span
            aria-hidden
            className="serif-ghost absolute top-10 left-0 origin-left scale-x-[1.32] font-serif text-[150px] leading-none select-none"
          >
            WELCOME
          </span>
          {bird.src && (
            <Image
              src={bird.src}
              alt=""
              width={bird.width}
              height={bird.height}
              sizes="380px"
              className="absolute bottom-0 left-1/2 w-[380px] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_55%,transparent_95%)]"
              style={{ filter: "hue-rotate(-20deg) saturate(0.88) brightness(1.06)" }}
            />
          )}
          <p className="absolute bottom-10 left-0 max-w-[230px] text-[26px] leading-tight font-light text-white">
            Back to the
            <br />
            <span className="text-white/50">&amp;</span> birds
          </p>
        </div>
        <LoginForm />
      </div>
    </PageShell>
  );
}
