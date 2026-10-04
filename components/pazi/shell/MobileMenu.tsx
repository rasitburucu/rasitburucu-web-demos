"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/pazi/tr";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const n = tr.nav;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.pzMenu = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.pzMenu;
    };
  }, [open]);

  return (
    <div className="pz-mmenu">
      <button ref={btn} type="button" className="pz-mmenu-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <span className="pz-mmenu-bars" aria-hidden="true" />
        <span>{open ? n.close : n.menu}</span>
      </button>
      <div id={id} className="pz-mmenu-panel" hidden={!open}>
        <ul>
          {n.items.map((i) => (
            <li key={i.href}>
              <Link href={i.href} onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/pazi/fizibilite/" className="pz-btn pz-btn-primary" onClick={() => setOpen(false)}>
              {n.cta}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
