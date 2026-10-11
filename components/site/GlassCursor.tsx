"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor='hover']";
const TEXT_FIELD =
  "input:not([type='checkbox'], [type='radio'], [type='submit'], [type='button']), textarea, [contenteditable='true']";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type Mode = "default" | "hover" | "text";

/**
 * Frosted-glass cursor: a blurred glass lens that trails the pointer on a spring, plus a
 * precise dot. Grows over links/buttons, steps aside over text fields (the native I-beam
 * is kept there), and only runs on mouse/trackpad devices.
 */
export function GlassCursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = reduceMotion ? { stiffness: 2000, damping: 100 } : { stiffness: 380, damping: 32, mass: 0.6 };
  const lensX = useSpring(x, spring);
  const lensY = useSpring(y, spring);

  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("glass-cursor-on");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target instanceof Element ? e.target : null;
      setMode(target?.closest(TEXT_FIELD) ? "text" : target?.closest(INTERACTIVE) ? "hover" : "default");
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      root.classList.remove("glass-cursor-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const lensSize = mode === "hover" ? 58 : mode === "text" ? 18 : 34;
  const scale = pressed ? 0.82 : 1;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-white/60 bg-white/12 shadow-[0_6px_20px_rgb(40_80_110/0.18),inset_0_1px_1px_rgb(255_255_255/0.7),inset_0_-6px_12px_rgb(120_170_200/0.18)] backdrop-blur-[6px] backdrop-saturate-150"
        style={{ x: lensX, y: lensY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: lensSize,
          height: lensSize,
          scale,
          opacity: visible ? (mode === "text" ? 0.5 : 1) : 0,
          backgroundColor: mode === "hover" ? "rgba(120, 190, 255, 0.16)" : "rgba(255, 255, 255, 0.12)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-[6px] rounded-full bg-[#0a6fe0] shadow-[0_0_0_1.5px_rgb(255_255_255/0.85)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && mode !== "text" ? 1 : 0, scale: mode === "hover" ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
