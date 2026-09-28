"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import { useBooking } from "./Shell";
import { getVilla } from "@/content/onikitas/villas";

export function Header() {
  const { open } = useBooking();
  const pathname = usePathname();
  // On a villa page the header CTA pre-selects that villa (unless it is sold).
  const villaId = pathname?.match(/\/villalar\/(\d{2})/)?.[1];
  const villa = villaId ? getVilla(villaId) : undefined;
  const prefill = villa && villa.status !== "sold" ? { villas: [villa.id] } : undefined;
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setSolid((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menu]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 no-print ${
        solid ? "bg-lime shadow-[0_1px_0_#3b3a2e1f]" : "bg-lime"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-8 lg:h-[72px] lg:px-12">
        <Link href="/onikitas" aria-label={tr.nav.home} className="font-display text-[1.6rem] leading-none tracking-tight">
          Onikitaş
        </Link>

        <nav aria-label={tr.nav.label} className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {tr.nav.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="py-2 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2" ref={menuRef}>
          <button type="button" className="btn-tile !px-4 !py-3 sm:!px-5" onClick={() => open(prefill)}>
            {tr.nav.book}
          </button>
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center md:hidden"
            aria-expanded={menu}
            aria-controls="onk-mobile-nav"
            aria-label={tr.nav.label}
            onClick={(e) => {
              e.stopPropagation();
              setMenu((m) => !m);
            }}
          >
            <span aria-hidden className="block h-px w-5 bg-olive" style={{ transform: menu ? "translateY(3px) rotate(45deg)" : "translateY(-3px)", transition: "transform .3s" }} />
            <span aria-hidden className="absolute block h-px w-5 bg-olive" style={{ transform: menu ? "rotate(-45deg)" : "translateY(3px)", transition: "transform .3s" }} />
          </button>
          {menu && (
            <nav
              id="onk-mobile-nav"
              aria-label={tr.nav.label}
              className="absolute inset-x-0 top-full border-t border-olive/15 bg-lime px-4 pb-6 pt-2 shadow-[0_12px_24px_-12px_#3b3a2e40] md:hidden"
            >
              <ul>
                {tr.nav.items.map((item) => (
                  <li key={item.href} className="border-b border-olive/10">
                    <Link href={item.href} className="block py-4 font-display text-2xl" onClick={() => setMenu(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
