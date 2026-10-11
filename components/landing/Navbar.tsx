import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

export const navLinks = [
  { label: "home", href: "/" },
  { label: "about us", href: "/about" },
  { label: "birds in the campus", href: "/birds" },
  { label: "how we built it", href: "/how-we-built-it" },
  { label: "set it up", href: "/setup" },
] as const;

export const loginLink = { label: "Login", href: "/login" } as const;

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 11" fill="currentColor" aria-hidden className={className}>
      <path d="M8.2 1.6 31.6 1.1 25.4 3.7 20.5 9.9 13.6 9.6 17.4 5.9Z" />
      <path d="M3.4 5.6h12.4l-1.3 1.2H4.3Z" opacity=".75" />
      <path d="M1.4 8.3h11.8l-1.2 1.1H2.2Z" opacity=".6" />
    </svg>
  );
}

/** Site navigation. `current` is the href of the page being shown (drives the active pill). */
export function Navbar({ current }: { current: string }) {
  return (
    <header className="relative z-30 flex items-center justify-between stage:absolute stage:inset-x-0 stage:top-0 stage:block stage:h-56">
      <Link
        href="/"
        aria-label="Blue Bird home"
        className="block text-white drop-shadow-[0_1px_2px_rgb(60_100_130/0.25)] stage:absolute stage:top-22 stage:left-26"
      >
        <Logo className="h-14 w-41 stage:h-11 stage:w-32" />
      </Link>

      <nav
        aria-label="Primary"
        className="hidden stage:absolute stage:top-18 stage:left-1/2 stage:block stage:-translate-x-1/2"
      >
        <ul className="flex items-center stage:gap-13">
          {navLinks.map((link) => {
            const active = link.href === current;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex h-19 items-center whitespace-nowrap rounded-full px-8 fs-7.5 tracking-[0.01em] transition-colors duration-200 " +
                    (active
                      ? "border border-white/45 bg-white/10 text-[#3c4f5d] shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
                      : "border border-transparent text-[#6f8796] hover:bg-white/15 hover:text-[#3c4f5d]")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href={loginLink.href}
        aria-current={current === loginLink.href ? "page" : undefined}
        className="hidden h-19 w-50 items-center justify-center rounded-full bg-[#f8fdff] fs-7.25 font-medium text-[#3c4f5d] shadow-[0_1px_4px_rgb(60_100_130/0.12)] transition-colors hover:bg-white stage:absolute stage:top-18 stage:right-28 stage:flex"
      >
        {loginLink.label}
      </Link>

      <MobileMenu links={navLinks} current={current} login={loginLink} />
    </header>
  );
}
