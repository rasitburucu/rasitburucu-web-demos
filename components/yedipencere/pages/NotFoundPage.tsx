import Link from "next/link";
import type { Lang } from "@/lib/yedipencere/dates";
import { href } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";
import { INK } from "../draw/geom";

/** A window with its shutters shut: the page is not here. */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="yp-page">
      <div className="yp-404">
        <svg viewBox="0 0 300 360" aria-hidden="true">
          <rect width="300" height="360" fill="url(#yp-moloz)" />
          <rect x="70" y="40" width="160" height="250" fill="#DCE5EA" />
          <rect x="64" y="34" width="172" height="262" fill="none" stroke={INK} strokeWidth="2.4" />
          <rect x="70" y="40" width="78" height="250" fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.4" />
          <rect x="152" y="40" width="78" height="250" fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.4" />
          <circle cx="143" cy="168" r="3" fill={INK} />
          <circle cx="157" cy="168" r="3" fill={INK} />
          <rect x="52" y="296" width="196" height="12" fill="#F7F8F7" stroke={INK} strokeWidth="1.4" />
        </svg>
        <div>
          <h1 className="yp-h1">{t.notFound.title}</h1>
          <p className="yp-lead" style={{ marginTop: 14 }}>
            {t.notFound.lead}
          </p>
          <div className="yp-404-links">
            <Link href={href(lang, "rooms")} className="yp-btn">
              {t.nav.rooms}
            </Link>
            <Link href={href(lang, "arrival")} className="yp-btn">
              {t.nav.arrival}
            </Link>
            <Link href={href(lang, "home")} className="yp-btn yp-btn--accent">
              {t.notFound.home}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
