"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { Rosette } from "../ui/Rosette";

const t = tr.nav;
const norm = (s: string) => s.split("#")[0].replace(/\/$/, "");

/** The booking pages get a quiet header: wordmark and a way out. */
export function useFlowMode() {
  const p = usePathname() ?? "";
  return /\/kalemkar\/(rezervasyon|ozel-davet)/.test(p);
}

export function Header() {
  const pathname = usePathname() ?? "";
  const flow = useFlowMode();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // A line under the header once the page has moved (no scroll listener).
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.kkMenu = "open";
    // The concept strip sits above the sticky header at the top of the page:
    // open the panel under the header's real bottom edge, not a fixed 58 px.
    const head = document.querySelector<HTMLElement>("[data-demo='kalemkar'] .kk-header");
    const bottom = head ? Math.max(0, Math.round(head.getBoundingClientRect().bottom)) : 0;
    document.documentElement.style.setProperty("--kk-menu-top", `${bottom}px`);
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.kkMenu;
      document.documentElement.style.removeProperty("--kk-menu-top");
    };
  }, [open]);

  return (
    <>
      <div ref={sentinel} className="kk-sentinel" aria-hidden="true" />
      <header className="kk-header" data-scrolled={scrolled || undefined} data-flow={flow || undefined}>
        <div className="kk-wrap kk-header-in">
          <Link href={`${tr.base}/`} className="kk-logo" aria-label={tr.brand.home}>
            <Rosette size={26} />
            <span className="kk-logo-word">{tr.brand.word}</span>
          </Link>

          {!flow && (
            <nav className="kk-nav" aria-label={t.label}>
              <ul>
                {t.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} aria-current={!i.href.includes("#") && norm(i.href) === norm(pathname) ? "page" : undefined}>
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="kk-header-act">
            {flow ? (
              <Link href={`${tr.base}/`} className="kk-btn kk-btn--line kk-btn--sm">
                {tr.flow.close}
              </Link>
            ) : (
              <>
                <Link href={`${tr.base}/rezervasyon/`} className="kk-btn kk-btn--accent kk-btn--sm kk-hide-sm">
                  {t.cta}
                </Link>
                <button
                  ref={btn}
                  type="button"
                  className="kk-menu-btn"
                  aria-expanded={open}
                  aria-controls="kk-menu"
                  onClick={() => setOpen((o) => !o)}
                >
                  <span className="kk-menu-lines" aria-hidden="true" data-open={open || undefined}>
                    <i />
                    <i />
                  </span>
                  <span>{open ? t.close : t.menu}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {!flow && (
        <div id="kk-menu" className="kk-menu" hidden={!open}>
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
          <Link href={`${tr.base}/rezervasyon/`} className="kk-btn kk-btn--accent" onClick={() => setOpen(false)}>
            {t.cta}
          </Link>
          <p className="kk-menu-foot">
            {tr.contact.hours}
            <br />
            <a href={tr.contact.phoneHref}>{tr.contact.phone}</a>
          </p>
        </div>
      )}
    </>
  );
}

export function MobileBar() {
  const flow = useFlowMode();
  const pathname = usePathname() ?? "";
  const [away, setAway] = useState(() => !/\/kalemkar\/?$/.test(pathname));
  const [serving, setServing] = useState(false);

  // On the home page the first screen already has the booking sentence and its
  // button: the bar waits until that has scrolled away (no second green button).
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-demo='kalemkar'] .kk-sentence");
    if (!hero || !("IntersectionObserver" in window)) {
      setAway(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  // The service scene already fills the phone screen (header, sini, text):
  // the bar steps aside while it is on screen and comes back after it.
  useEffect(() => {
    const serve = document.querySelector<HTMLElement>("[data-demo='kalemkar'] .kk-serve-grid");
    if (!serve || !("IntersectionObserver" in window)) {
      setServing(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setServing(e.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(serve);
    return () => io.disconnect();
  }, [pathname]);

  if (flow) return null;
  const m = tr.mobileBar;
  return (
    <nav className="kk-mbar" aria-label={m.label} data-away={(away && !serving) || undefined}>
      <a href={tr.contact.phoneHref} className="kk-mbar-call">
        {m.call}
      </a>
      <Link href={`${tr.base}/rezervasyon/`} className="kk-btn kk-btn--accent">
        {m.cta}
      </Link>
    </nav>
  );
}
