"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, pageOf, type Locale } from "@/content/damar/routes";
import { STONES } from "@/content/damar/stones";
import { estimate } from "@/lib/damar/calc";
import { dict, num } from "@/lib/damar/dict";
import { useDamar } from "@/lib/damar/store";
import { Box } from "../ui/Icons";

/** Phones: the quote and the sample box one thumb away. On the home page the
 *  bar carries the live estimate. It steps aside while the footer or a form's
 *  own buttons are on screen, so nothing is covered twice. */
export function MobileBar({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const d = dict(locale);
  const page = pageOf(pathname)?.key;
  const count = useDamar((s) => s.box.length);
  const quote = useDamar((s) => s.quote);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-demo='damar'] [data-dm-bar-hide]"));
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setHidden(seen.size > 0);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (page === "sheet") return null;

  const samples = href(locale, "samples");
  const est = page === "home" && quote ? estimate(STONES[quote.stone], quote.m2, quote.t, quote.limit) : null;

  return (
    <nav className="dm-mbar" aria-label={d.mbar.label} data-hidden={hidden || undefined}>
      {page === "home" ? (
        <>
          <Link href={`${samples}#quote`} className="dm-btn dm-btn--page dm-mbar-quote">
            <span>{d.mbar.quote}</span>
            {est && <small className="dm-tnum">{d.calc.summary(num(locale, est.slabs), num(locale, est.containers))}</small>}
          </Link>
          <Link href={`${samples}#box`} className="dm-btn dm-btn--line">
            <Box />
            {count > 0 ? d.mbar.samplesCount(count) : d.mbar.samples}
          </Link>
        </>
      ) : (
        <>
          <Link href={`${samples}#box`} className="dm-btn dm-btn--line">
            <Box />
            {count > 0 ? d.mbar.samplesCount(count) : d.mbar.requestSamples}
          </Link>
          <Link href={`${samples}#quote`} className="dm-btn dm-btn--page">
            {d.mbar.askQuote}
          </Link>
        </>
      )}
    </nav>
  );
}
