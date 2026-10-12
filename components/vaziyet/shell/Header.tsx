"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/vaziyet/tr";
import { Mark } from "./Shell";
import { PhoneIcon } from "./Wa";

const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");
const current = (href: string, pathname: string) => {
  const a = norm(href);
  const p = norm(`/web${pathname}`) === a || norm(pathname) === a;
  const alt = a !== "/vaziyet" && (norm(pathname).startsWith(`${a}/`) || norm(`/web${pathname}`).startsWith(`${a}/`));
  return p ? ("page" as const) : alt ? ("true" as const) : undefined;
};

export function Header() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const t = tr.nav;

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
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="vz-header" data-open={open || undefined}>
      <div className="vz-header-in">
        <Link href={`${tr.base}/`} className="vz-logo" aria-label={tr.brand.home}>
          <Mark size={30} />
          <span className="vz-logo-word">{tr.brand.ad}</span>
          <span className="vz-logo-line">{tr.brand.satir}</span>
        </Link>
        <nav className="vz-nav" aria-label={t.label}>
          <ul>
            {t.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={current(i.href, pathname)}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="vz-header-act">
          <a href={tr.brand.phoneHref} className="vz-btn vz-btn--cizgi vz-btn--sm vz-header-tel">
            <PhoneIcon />
            <span className="vz-tnum">{tr.brand.phone}</span>
            <span className="vz-ornek">{tr.ornek}</span>
          </a>
          <button
            ref={btn}
            type="button"
            className="vz-menu-btn"
            aria-expanded={open}
            aria-controls="vz-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="vz-menu-lines" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>{open ? t.close : t.menu}</span>
          </button>
        </div>
      </div>
      <div id="vz-menu" className="vz-menu" hidden={!open}>
        <nav aria-label={t.label}>
          <ul>
            <li>
              <Link href={`${tr.base}/`} aria-current={current(`${tr.base}/`, pathname)} onClick={() => setOpen(false)}>
                {t.home}
              </Link>
            </li>
            {t.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={current(i.href, pathname)} onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="vz-menu-foot">
          <a href={tr.brand.phoneHref} className="vz-tnum">
            {tr.brand.phone}
          </a>{" "}
          <span className="vz-ornek">{tr.ornek}</span>
          <br />
          {tr.footer.saat}
        </p>
      </div>
    </header>
  );
}
