"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navPages, tr } from "@/content/gelidonya/tr";
import { Wordmark } from "./Shell";

const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");
const current = (href: string, pathname: string) =>
  !href.includes("#") && norm(href) === norm(pathname) ? ("page" as const) : undefined;

export function Header() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const n = tr.nav;
  const b = tr.brand;

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
    const head = document.querySelector<HTMLElement>("[data-demo='gelidonya'] .gd-header");
    const bottom = head ? Math.max(0, Math.round(head.getBoundingClientRect().bottom)) : 0;
    document.documentElement.style.setProperty("--gd-menu-top", `${bottom}px`);
    document.documentElement.dataset.gdMenu = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.removeProperty("--gd-menu-top");
      delete document.documentElement.dataset.gdMenu;
    };
  }, [open]);

  return (
    <>
      <header className="gd-header">
        <div className="gd-header-in">
          <Link href={`${tr.base}/`} className="gd-brand" aria-label={b.home}>
            <Wordmark />
            <span className="gd-brand-line">{b.line}</span>
          </Link>
          <nav className="gd-nav" aria-label={n.label}>
            <ul>
              {n.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} aria-current={current(i.href, pathname)}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a href={b.phoneHref} className="gd-header-phone">
            <span className="gd-sr">{n.call}: </span>
            <span className="gd-tnum">{b.phone}</span>
            <small>{b.phoneNote}</small>
          </a>
          <button
            ref={btn}
            type="button"
            className="gd-menu-btn"
            aria-expanded={open}
            aria-controls="gd-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? n.close : n.menu}
          </button>
        </div>
      </header>
      <div id="gd-menu" className="gd-menu" hidden={!open}>
        <nav aria-label={n.label}>
          <ul>
            {navPages.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={current(i.href, pathname)} onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="gd-menu-foot">
          <a href={b.phoneHref} className="gd-tnum">
            {b.phone}
          </a>{" "}
          <span className="gd-muted">[{b.phoneNote}]</span>
          <br />
          {tr.contact.hours[0]}
        </p>
      </div>
    </>
  );
}
