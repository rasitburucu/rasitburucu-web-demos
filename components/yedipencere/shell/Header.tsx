"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { counterpart, href, parsePath, type PageKey } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";

const ITEMS: PageKey[] = ["rooms", "arrival", "house", "faq"];

export function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? "";
  const t = COPY[lang].nav;
  return (
    <div className="yp-lang" role="group" aria-label={t.lang}>
      <Link href={counterpart(pathname, "tr")} hrefLang="tr" lang="tr" aria-current={lang === "tr" ? "true" : undefined} aria-label={t.langTr}>
        TR
      </Link>
      <Link href={counterpart(pathname, "en")} hrefLang="en" lang="en" aria-current={lang === "en" ? "true" : undefined} aria-label={t.langEn}>
        EN
      </Link>
    </div>
  );
}

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? "";
  const t = COPY[lang];
  const here = parsePath(pathname).page;
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  // the root layout is shared by every demo; keep <html lang> right after client navigation
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.ypMenu = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.ypMenu;
    };
  }, [open]);

  const current = (p: PageKey) => (here === p || (p === "rooms" && here === "room") ? ("page" as const) : undefined);

  return (
    <header className="yp-header">
      <div className="yp-header-in">
        <Link href={href(lang, "home")} className="yp-logo" aria-label={t.brand.home}>
          <span className="yp-logo-word">{t.brand.name}</span>
          <span className="yp-logo-tag">{t.brand.tagline}</span>
        </Link>
        <nav className="yp-nav" aria-label={t.nav.label}>
          <ul>
            {ITEMS.map((p) => (
              <li key={p}>
                <Link href={href(lang, p)} aria-current={current(p)}>
                  {t.nav[p as "rooms" | "arrival" | "house" | "faq"]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LangSwitch lang={lang} />
        <Link href={href(lang, "booking")} className="yp-btn yp-btn--line yp-header-cta" aria-current={current("booking")}>
          {t.nav.booking}
        </Link>
        <button ref={btn} type="button" className="yp-menu-btn" aria-expanded={open} aria-controls="yp-menu" onClick={() => setOpen((o) => !o)}>
          <span className="yp-menu-lines" aria-hidden="true" data-open={open || undefined}>
            <i />
            <i />
          </span>
          <span>{open ? t.nav.close : t.nav.menu}</span>
        </button>
      </div>
      <div id="yp-menu" className="yp-menu" hidden={!open}>
        <nav aria-label={t.nav.label}>
          <ul>
            <li>
              <Link href={href(lang, "home")} aria-current={current("home")} onClick={() => setOpen(false)}>
                {t.nav.home}
              </Link>
            </li>
            {ITEMS.map((p) => (
              <li key={p}>
                <Link href={href(lang, p)} aria-current={current(p)} onClick={() => setOpen(false)}>
                  {t.nav[p as "rooms" | "arrival" | "house" | "faq"]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href(lang, "booking")} aria-current={current("booking")} onClick={() => setOpen(false)}>
                {t.nav.booking}
              </Link>
            </li>
          </ul>
        </nav>
        <p className="yp-menu-foot">
          {t.footer.hours}
          <br />
          <a href={t.footer.phoneHref}>{t.footer.phone}</a> <span className="yp-tag">{t.footer.phoneNote}</span>
        </p>
      </div>
    </header>
  );
}
