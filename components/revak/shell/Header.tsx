"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { Icon, Mark } from "../ui/Icon";
import { Announce } from "./Announce";

const t = tr.nav;
const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");

/** Flow pages (the admissions steps) get a quiet header: logo and a way out. */
export function useFlowMode() {
  const p = usePathname() ?? "";
  return /\/revak\/kabul\/[^/]+/.test(p);
}

export function Header() {
  const flow = useFlowMode();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.rvMenu = "open";
    const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 72;
    menuRef.current?.style.setProperty("--rv-menu-top", `${Math.max(0, bottom)}px`);
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.rvMenu;
    };
  }, [open]);

  return (
    <>
      {!flow && <Announce />}
      <header ref={headerRef} className="rv-header" data-flow={flow || undefined}>
        <div className="rv-wrap rv-header-in">
          <Link href="/revak/" className="rv-logo" aria-label={tr.brand.home}>
            <Mark size={30} />
            <span className="rv-logo-word">
              Revak <span>Okulları</span>
            </span>
          </Link>

          {!flow && (
            <nav className="rv-nav" aria-label={t.label}>
              <ul>
                {t.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} aria-current={!i.href.includes("#") && norm(i.href) === norm(pathname ?? "") ? "page" : undefined}>
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="rv-header-act">
            {flow ? (
              <Link href="/revak/kabul/" className="rv-btn rv-btn--quiet rv-btn--sm">
                <Icon name="close" size={18} />
                <span className="rv-hide-sm">{tr.flows.common.close}</span>
                <span className="rv-show-sm">{tr.flows.common.closeShort}</span>
              </Link>
            ) : (
              <>
                <a href="#" className="rv-parents" onClick={(e) => e.preventDefault()}>
                  {t.parents}
                </a>
                <Link href="/revak/kabul/kampus-turu/" className="rv-btn rv-btn--line rv-btn--sm rv-hide-md">
                  {t.tour}
                </Link>
                <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--seal rv-btn--sm rv-hide-sm">
                  {t.apply}
                </Link>
                <button
                  ref={toggleRef}
                  type="button"
                  className="rv-menu-btn"
                  aria-expanded={open}
                  aria-controls="rv-menu"
                  onClick={() => setOpen((o) => !o)}
                >
                  <Icon name={open ? "close" : "menu"} size={22} />
                  <span>{open ? t.close : t.menu}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </header>
      {/* Outside <header>: its backdrop-filter would trap position:fixed. */}
        {!flow && (
        <div ref={menuRef} id="rv-menu" className="rv-menu" hidden={!open}>
          <nav aria-label={t.label}>
            <ul>
              {t.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} onClick={() => setOpen(false)}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="rv-menu-foot">
            <Link href="/revak/kabul/kampus-turu/" className="rv-btn rv-btn--line">
              {t.tour}
            </Link>
            <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--seal">
              {t.apply}
            </Link>
            <a href="#" className="rv-parents" onClick={(e) => e.preventDefault()}>
              {t.parents}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileBar() {
  const flow = useFlowMode();
  if (flow) return null;
  const m = tr.mobileBar;
  return (
    <nav className="rv-mbar" aria-label={m.label}>
      <Link href="/revak/kabul/kampus-turu/">{m.tour}</Link>
      <Link href="/revak/kabul/on-kayit/" className="is-primary">
        {m.apply}
      </Link>
      <a href={tr.contact.phoneHref}>
        <Icon name="phone" size={18} />
        {m.call}
      </a>
    </nav>
  );
}

export function FlowGate({ children }: { children: React.ReactNode }) {
  const flow = useFlowMode();
  return flow ? null : <>{children}</>;
}
