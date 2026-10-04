"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { Icon, Mark } from "../ui/Icon";
import { Announce } from "./Announce";
import { Strip } from "./Footer";

const t = tr.nav;
const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");
type Group = (typeof t.groups)[number];

/** A group is "here" when the page is its hub or one of its links (anchors ignored). */
function isHere(g: Group, path: string) {
  const p = norm(path);
  if (!p) return false;
  return norm(g.href) === p || g.items.some((i) => !i.href.includes("#") && norm(i.href) === p) || (g.id === "egitim" && p.startsWith("/revak/egitim"));
}

/** Flow pages (the admissions steps) get a quiet header: logo and a way out. */
export function useFlowMode() {
  const p = usePathname() ?? "";
  return /\/revak\/kabul\/[^/]+/.test(p);
}

/**
 * Six headings. Four open a small panel (at most five links); Almanak and İletişim
 * are plain links. Disclosure pattern: the heading is a button; Esc and an outside
 * click close; a pointer resting on a heading opens it.
 */
function DesktopNav({ pathname }: { pathname: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const hoverable = useRef(false);

  useEffect(() => {
    hoverable.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    return () => window.clearTimeout(timer.current);
  }, []);
  useEffect(() => setOpenId(null), [pathname]);
  useEffect(() => {
    if (!openId) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-g="${openId}"]`);
      setOpenId(null);
      btn?.focus();
    };
    const onFocus = (e: FocusEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
    };
  }, [openId]);

  const enter = (id: string) => {
    if (!hoverable.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenId(id), 90);
  };
  const leave = () => {
    if (!hoverable.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenId(null), 180);
  };

  return (
    <nav ref={navRef} className="rv-nav" aria-label={t.label}>
      <ul>
        {t.groups.map((g) => {
          const here = isHere(g, pathname);
          if (!g.items.length)
            return (
              <li key={g.id}>
                <Link href={g.href} aria-current={here ? "page" : undefined}>
                  {g.label}
                </Link>
              </li>
            );
          const open = openId === g.id;
          return (
            <li key={g.id} className="rv-nav-group" onMouseEnter={() => enter(g.id)} onMouseLeave={leave}>
              <button
                type="button"
                data-g={g.id}
                aria-expanded={open}
                aria-controls={`rv-nav-${g.id}`}
                data-here={here || undefined}
                onClick={() => setOpenId(open ? null : g.id)}
              >
                {g.label}
                <Icon name="chevron" size={16} />
              </button>
              <div className="rv-nav-panel" id={`rv-nav-${g.id}`} hidden={!open}>
                <ul>
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href} aria-current={!i.href.includes("#") && norm(i.href) === norm(pathname) ? "page" : undefined}>
                        <span>{i.label}</span>
                        <small>{i.text}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
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
      {/* the honesty strip and the exam notice share one band on wide screens */}
      <div className="rv-topbar">
        <Strip />
        {!flow && <Announce />}
      </div>
      <header ref={headerRef} className="rv-header" data-flow={flow || undefined}>
        <div className="rv-wrap rv-header-in">
          <Link href="/revak/" className="rv-logo" aria-label={tr.brand.home}>
            <Mark size={30} />
            <span className="rv-logo-word">
              Revak <span>Okulları</span>
            </span>
          </Link>

          {!flow && <DesktopNav pathname={pathname ?? ""} />}

          <div className="rv-header-act">
            {flow ? (
              <Link href="/revak/kabul/" className="rv-btn rv-btn--quiet rv-btn--sm">
                <Icon name="close" size={18} />
                <span className="rv-hide-sm">{tr.flows.common.close}</span>
                <span className="rv-show-sm">{tr.flows.common.closeShort}</span>
              </Link>
            ) : (
              <>
                <Link href="/revak/veli/" className="rv-parents" aria-current={norm(pathname ?? "") === "/revak/veli" ? "page" : undefined}>
                  {t.parents}
                </Link>
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
            <ul className="rv-menu-groups">
              {t.groups.map((g) => (
                <li key={g.id}>
                  <Link href={g.href} className="rv-menu-group" onClick={() => setOpen(false)}>
                    {g.label}
                  </Link>
                  {g.items.length > 0 && (
                    <ul className="rv-menu-sub">
                      {g.items
                        .filter((i) => norm(i.href) !== norm(g.href) || i.href.includes("#"))
                        .map((i) => (
                          <li key={i.href}>
                            <Link href={i.href} onClick={() => setOpen(false)}>
                              {i.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
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
            <Link href="/revak/veli/" className="rv-parents" onClick={() => setOpen(false)}>
              {t.parents}
            </Link>
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
