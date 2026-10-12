"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { counterpart, href, LOCALES, NAV_KEYS, pageOf, type Locale } from "@/content/damar/routes";
import { dict } from "@/lib/damar/dict";
import { useDamar } from "@/lib/damar/store";
import { Box, Close, Menu } from "../ui/Icons";

export function Wordmark({ locale }: { locale: Locale }) {
  const d = dict(locale);
  return (
    <span className="dm-word">
      {d.brand.word}
      <small>{d.brand.line}</small>
    </span>
  );
}

/** EN | TR: the same page in the other language, query kept (sheet, quote). */
function LangSwitch({ locale, pathname }: { locale: Locale; pathname: string }) {
  const router = useRouter();
  const d = dict(locale);
  return (
    <div className="dm-lang" role="group" aria-label={d.nav.lang}>
      {LOCALES.map((l) => {
        const target = l === locale ? pathname : counterpart(pathname);
        return (
          <Link
            key={l}
            href={target}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            aria-label={d.nav.langName[l]}
            onClick={(e) => {
              if (l === locale) return e.preventDefault();
              const q = window.location.search;
              if (q) {
                e.preventDefault();
                router.push(`${target}${q}`);
              }
            }}
          >
            {d.nav.langShort[l]}
          </Link>
        );
      })}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const d = dict(locale);
  const page = pageOf(pathname);
  const current = page?.key === "stone" ? "stones" : page?.key;
  const count = useDamar((s) => s.box.length);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

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
    const head = document.querySelector<HTMLElement>("[data-demo='damar'] .dm-header");
    const bottom = head ? Math.max(0, Math.round(head.getBoundingClientRect().bottom)) : 0;
    document.documentElement.style.setProperty("--dm-menu-top", `${bottom}px`);
    document.documentElement.dataset.dmMenu = "open";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.removeProperty("--dm-menu-top");
      delete document.documentElement.dataset.dmMenu;
    };
  }, [open]);

  const samplesHref = href(locale, "samples");
  const ctaCurrent = page?.key === "samples" ? ("page" as const) : undefined;

  return (
    <>
      <header className="dm-header">
        <div className="dm-header-in">
          <Link href={href(locale, "home")} className="dm-brand" aria-label={d.brand.home}>
            <Wordmark locale={locale} />
          </Link>
          <nav className="dm-nav" aria-label={d.nav.label}>
            <ul>
              {NAV_KEYS.map((k) => (
                <li key={k}>
                  <Link href={href(locale, k)} aria-current={current === k ? "page" : undefined}>
                    {d.nav.items[k]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="dm-header-end">
            <LangSwitch locale={locale} pathname={pathname} />
            <Link href={samplesHref} className="dm-btn dm-btn--page dm-header-cta" aria-current={ctaCurrent}>
              <Box />
              <span>{d.nav.items.samples}</span>
              {count > 0 && (
                <span className="dm-count" aria-label={d.nav.inBox(count)}>
                  {count}
                </span>
              )}
            </Link>
            <button
              ref={btn}
              type="button"
              className="dm-menu-btn"
              aria-expanded={open}
              aria-controls="dm-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
              <span>{open ? d.nav.close : d.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>
      <div id="dm-menu" ref={panel} className="dm-menu" hidden={!open}>
        <nav aria-label={d.nav.label}>
          <ul>
            {[...NAV_KEYS, "samples" as const].map((k) => (
              <li key={k}>
                <Link href={href(locale, k)} aria-current={current === k ? "page" : undefined} onClick={() => setOpen(false)}>
                  {d.nav.items[k]}
                  {k === "samples" && count > 0 ? <span className="dm-count">{count}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dm-menu-foot">
          <LangSwitch locale={locale} pathname={pathname} />
          <p>
            <a href={d.footer.phoneHref} className="dm-tnum">
              {d.footer.phone}
            </a>{" "}
            <span className="dm-muted">({d.footer.phoneNote})</span>
          </p>
        </div>
      </div>
    </>
  );
}
