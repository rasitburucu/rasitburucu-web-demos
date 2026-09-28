"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Arch-mask reveal: the photograph opens upward inside an arched frame,
 * once, when it scrolls into view. Used on a few chosen images only.
 */
export function ArchReveal({
  children,
  className = "",
  delay = 0,
  arch = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  arch?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`${arch ? "arch" : ""} relative overflow-hidden bg-travertine ${className}`}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 0.61, 0.21, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
