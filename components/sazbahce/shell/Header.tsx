"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { Mark } from "./Mark";

const t = tr.nav;
const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");
const current = (href: string, pathname: string) => (!href.includes("#") && norm(href) === norm(pathname) ? ("page" as const) : undefined);

export function Strip() {
  return (
    <div className="sb-strip" role="note">
      <p>
        {tr.strip.text} <a href={tr.strip.href}>{tr.strip.link}</a>
      </p>
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

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
    document.documentElement.dataset.sbMenu = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.sbMenu;
    };
  }, [open]);

  return (
    <header className="sb-header">
      <div className="sb-header-in">
        <Link href={`${tr.base}/`} className="sb-logo" aria-label={tr.brand.home}>
          <Mark size={26} />
          <span className="sb-logo-word">{tr.brand.name}</span>
          <span className="sb-logo-place">{tr.brand.place}</span>
        </Link>
        <nav className="sb-nav" aria-label={t.label}>
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
        <div className="sb-header-act">
          <Link href={t.ctaHref} className="sb-btn sb-btn--accent sb-btn--sm sb-hide-sm" aria-current={current(t.ctaHref, pathname)}>
            {t.cta}
          </Link>
          <button ref={btn} type="button" className="sb-menu-btn" aria-expanded={open} aria-controls="sb-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sb-menu-lines" aria-hidden="true" data-open={open || undefined}>
              <i />
              <i />
            </span>
            <span>{open ? t.close : t.menu}</span>
          </button>
        </div>
      </div>
      <div id="sb-menu" className="sb-menu" hidden={!open}>
        <nav aria-label={t.label}>
          <ul>
            {t.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={current(i.href, pathname)} onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={t.ctaHref} className="sb-btn sb-btn--accent" onClick={() => setOpen(false)}>
          {t.cta}
        </Link>
        <p className="sb-menu-foot">
          {tr.contact.hours}
          <br />
          <a href={tr.contact.phoneHref}>{tr.contact.phone}</a>
        </p>
      </div>
    </header>
  );
}
