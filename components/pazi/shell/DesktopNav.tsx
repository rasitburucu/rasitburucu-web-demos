"use client";

// Desktop menu. Items with children open a small list on click (a button, not a
// hover trap): Escape or a click elsewhere closes it, tabbing out closes it.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/pazi/tr";

export function DesktopNav() {
  const n = tr.nav;
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const base = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      root.current?.querySelector<HTMLButtonElement>("button[aria-expanded='true']")?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <nav ref={root} className="pz-nav" aria-label={n.label} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setOpen(null)}>
      <ul>
        {n.items.map((i, idx) => {
          const kids = "children" in i ? i.children : undefined;
          if (!kids) {
            return (
              <li key={i.label}>
                <Link href={i.href!}>{i.label}</Link>
              </li>
            );
          }
          const id = `${base}-${idx}`;
          const isOpen = open === i.label;
          return (
            <li key={i.label} className="pz-nav-group">
              <button type="button" className="pz-nav-toggle" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : i.label)}>
                {i.label}
                <svg className="pz-nav-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
              <ul id={id} className="pz-nav-sub" hidden={!isOpen}>
                {kids.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} onClick={() => setOpen(null)}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
