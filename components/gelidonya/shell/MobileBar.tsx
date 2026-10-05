"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { isoWeek, nf } from "@/lib/gelidonya/hesap";
import { useOrder } from "@/lib/gelidonya/siparis";

/** Phone only: on the home page the live order summary and the next step;
 *  elsewhere a call button and the way to the order. */
export function MobileBar() {
  const pathname = usePathname() ?? "";
  const home = /\/gelidonya\/?$/.test(pathname);
  const { result, order } = useOrder();
  const [hidden, setHidden] = useState(false);
  const m = tr.mobileBar;

  // step aside while the delivery form (or the footer) is on screen
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
      { rootMargin: "0px 0px -15% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (home) {
    return (
      <div className="gd-mbar" data-hidden={hidden || undefined}>
        <p className="gd-mbar-sum" aria-live="polite">
          <b className="gd-tnum">{m.summary(nf(result.fide))}</b>
          <span aria-hidden="true">
            {m.summary2(nf(result.viyol), isoWeek(result.sowing).w, isoWeek(order.delivery).w)}
          </span>
          <span className="gd-sr">{m.summary2Long(nf(result.viyol), isoWeek(result.sowing).w, isoWeek(order.delivery).w)}</span>
        </p>
        <a href="#tezgah" className="gd-btn gd-btn--light">
          {m.cta}
        </a>
      </div>
    );
  }
  return (
    <nav className="gd-mbar" aria-label={m.label} data-hidden={hidden || undefined}>
      <a href={tr.brand.phoneHref} className="gd-btn gd-btn--ghost">
        {m.call}
      </a>
      <Link href={`${tr.base}/#siparis`} className="gd-btn gd-btn--light">
        {m.order}
      </Link>
    </nav>
  );
}
