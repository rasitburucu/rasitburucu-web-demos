"use client";

// Phones: dates, phone and booking always one thumb away. Fixed, so it never
// moves the page; the page keeps room for it at the bottom. Hidden on the
// booking page, which has its own button.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/yedipencere/dates";
import { parsePath } from "@/lib/yedipencere/paths";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { bookingHref } from "../home/RoomCard";
import { Calendar, Phone } from "../ui/icons";

export function MobileBar({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? "";
  const { stay, setSheet } = useStay();
  const t = COPY[lang];
  if (parsePath(pathname).page === "booking") return null;
  return (
    <nav className="yp-mbar" aria-label={t.mobileBar.label}>
      <button type="button" className="yp-mbar-btn" onClick={() => setSheet(true)} aria-haspopup="dialog">
        <Calendar />
        {t.mobileBar.dates}
      </button>
      <a href={t.footer.phoneHref} className="yp-mbar-btn">
        <Phone />
        {t.mobileBar.phone}
      </a>
      <Link href={bookingHref(lang, stay)} className="yp-mbar-btn yp-mbar-btn--accent">
        {t.mobileBar.booking}
      </Link>
    </nav>
  );
}
