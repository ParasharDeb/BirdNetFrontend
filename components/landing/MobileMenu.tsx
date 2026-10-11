"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type NavLink = { readonly label: string; readonly href: string };

type Props = {
  links: readonly NavLink[];
  current: string;
  login: NavLink;
};

export function MobileMenu({ links, current, login }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="stage:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-40 w-40 items-center justify-center rounded-full border border-white/50 bg-white/25 text-[#3c4f5d] backdrop-blur"
      >
        {open ? <X className="h-18 w-18" /> : <Menu className="h-18 w-18" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-52 rounded-[20px] border border-white/50 bg-white/70 p-8 shadow-lg backdrop-blur-xl"
          >
            <ul className="flex flex-col">
              {links.map((link) => {
                const active = link.href === current;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={
                        "block rounded-[14px] px-14 py-11 text-[15px] text-[#3c4f5d] hover:bg-white/70 " +
                        (active ? "bg-white/60 font-medium" : "")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="p-6">
                <Link
                  href={login.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-white py-11 text-center text-[15px] font-medium text-[#3c4f5d] shadow-sm"
                >
                  {login.label}
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
