"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff, Info } from "lucide-react";

/**
 * Sign-in UI. There is no authentication backend in this project yet, so submitting
 * validates the form and then says so plainly instead of pretending to log in.
 * Connect it by replacing `onSubmit` with a call to your auth provider.
 */
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(false);

  return (
    <div className="glass-panel w-full rounded-[30px] p-6 sm:p-8">
      <h1 className="text-[34px] leading-tight font-light tracking-[-0.02em] text-[#24384a]">Login</h1>
      <p className="mt-1.5 text-[15px] text-[#4d6473]">Sign in to manage your Blue Bird station.</p>

      <form
        className="mt-7 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(true);
        }}
      >
        <label className="block">
          <span className="text-sm text-[#3c4f5d]">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@campus.edu"
            className="mt-1.5 h-12 w-full rounded-2xl border border-white/60 bg-white/45 px-4 text-[15px] text-[#24384a] placeholder:text-[#7d93a1] outline-none transition focus:border-[#0a7de9]/60 focus:bg-white/70 focus:ring-4 focus:ring-[#0a7de9]/15"
          />
        </label>

        <label className="block">
          <span className="text-sm text-[#3c4f5d]">Password</span>
          <span className="relative mt-1.5 block">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 w-full rounded-2xl border border-white/60 bg-white/45 pr-12 pl-4 text-[15px] text-[#24384a] placeholder:text-[#7d93a1] outline-none transition focus:border-[#0a7de9]/60 focus:bg-white/70 focus:ring-4 focus:ring-[#0a7de9]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#4d6473] hover:bg-white/60"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-[#3c4f5d]">
            <input type="checkbox" name="remember" className="size-4 rounded accent-[#0a7de9]" />
            Remember me
          </label>
          <Link href="/about" className="text-[#0a5fc0] hover:underline">
            Need access?
          </Link>
        </div>

        <button
          type="submit"
          className="group flex h-13 w-full items-center justify-between rounded-full bg-[linear-gradient(90deg,#0074fe_0%,#0383e5_55%,#088fd1_100%)] pr-1.5 pl-6 text-[15px] text-white shadow-[0_8px_22px_rgb(0_110_230/0.3)] transition-[filter] hover:brightness-110"
        >
          Sign in
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#0a7de9] transition-transform group-hover:translate-x-0.5">
            <ChevronRight className="size-4" strokeWidth={2.2} />
          </span>
        </button>

        {notice && (
          <p role="status" className="flex gap-2 rounded-2xl bg-white/55 p-3 text-sm leading-snug text-[#2f4554]">
            <Info className="mt-0.5 size-4 shrink-0 text-[#0a6fe0]" />
            Accounts aren&apos;t enabled on this prototype yet, so nothing was sent. Sign-in will open once the station
            dashboard is ready.
          </p>
        )}
      </form>
    </div>
  );
}
