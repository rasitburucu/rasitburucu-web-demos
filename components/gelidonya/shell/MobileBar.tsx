"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { PhoneIcon, useWa, WaIcon } from "./Wa";

/** Phone and small tablet: call, WhatsApp, directions, always one thumb away.
 *  Steps aside while the first screen's own buttons, a form or the footer are
 *  on screen, so nothing is covered twice. Fixed, so it never moves the page. */
export function MobileBar() {
  const pathname = usePathname() ?? "";
  const [hidden, setHidden] = useState(true);
  const { open } = useWa();
  const m = tr.mobileBar;

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-demo='gelidonya'] [data-gd-bar-hide]"));
    if (!els.length || !("IntersectionObserver" in window)) {
      setHidden(false);
      return;
    }
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setHidden(seen.size > 0);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav className="gd-mbar" aria-label={m.label} data-hidden={hidden || undefined}>
      <a href={tr.brand.phoneHref} className="gd-mbar-btn">
        <PhoneIcon />
        {m.call}
      </a>
      <button type="button" className="gd-mbar-btn" onClick={() => open(tr.wa.general)} aria-haspopup="dialog">
        <WaIcon />
        {m.wa}
      </button>
      <Link href={`${tr.base}/iletisim/#harita`} className="gd-mbar-btn">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="gd-ico">
          <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        {m.route}
      </Link>
    </nav>
  );
}
