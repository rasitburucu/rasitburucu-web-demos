"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tr } from "@/content/vaziyet/tr";
import { PhoneIcon, useWa, WaIcon } from "./Wa";

/** Phone and small tablet: call, WhatsApp and the quote summary, one thumb
 *  away. Steps aside while the footer or a form's own send button is on
 *  screen, so nothing is covered twice. Fixed, so it never moves the page. */
export function MobileBar() {
  const pathname = usePathname() ?? "";
  const [hidden, setHidden] = useState(false);
  const { open } = useWa();
  const m = tr.mobileBar;
  const onQuote = pathname.replace(/\/$/, "").endsWith("/teklif");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-demo='vaziyet'] [data-vz-bar-hide]"));
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
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav className="vz-mbar" aria-label={m.label} data-hidden={hidden || undefined}>
      <a href={tr.brand.phoneHref} className="vz-mbar-btn">
        <PhoneIcon />
        {m.call}
      </a>
      <button type="button" className="vz-mbar-btn" onClick={() => open(tr.wa.genel)} aria-haspopup="dialog">
        <WaIcon />
        {m.wa}
      </button>
      {onQuote ? (
        <a href="#talep" className="vz-mbar-btn vz-mbar-btn--ana">
          {m.teklif}
        </a>
      ) : (
        <Link href={`${tr.base}/teklif/`} className="vz-mbar-btn vz-mbar-btn--ana">
          {m.teklif}
        </Link>
      )}
    </nav>
  );
}
