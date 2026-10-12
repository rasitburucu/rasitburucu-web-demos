import Link from "next/link";
import { credits } from "@/content/damar/credits";
import { href, NAV_KEYS, type Locale } from "@/content/damar/routes";
import { STONES } from "@/content/damar/stones";
import { dict } from "@/lib/damar/dict";
import { Wordmark } from "./Header";

/** Shared demo footer order (2026-10-05): brand, visit, contact, pages;
 *  concept note; "Project credits" (design, 3D, photos, type, year); copyright. */
export function Footer({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const f = d.footer;
  const k = f.kunye;
  const photos = credits.filter((c) => c.group === "photo");
  const fonts = credits.filter((c) => c.group === "font");
  return (
    <footer className="dm-footer" data-dm-bar-hide>
      <div className="dm-wrap">
        <div className="dm-footer-cols">
          <div className="dm-footer-brand">
            <Wordmark locale={locale} />
            <p>{f.brandLine}</p>
          </div>
          <div>
            <h2>{f.visit}</h2>
            <address>
              {f.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <span className="dm-muted">({f.addressNote})</span>
            </address>
            <p>{f.hours}</p>
          </div>
          <div>
            <h2>{f.contact}</h2>
            <p>{f.desk}</p>
            <p>
              <a href={f.phoneHref} className="dm-tnum">
                {f.phone}
              </a>{" "}
              <span className="dm-muted">({f.phoneNote})</span>
            </p>
            <p>
              {f.email} <span className="dm-muted">({f.emailNote})</span>
            </p>
          </div>
          <div>
            <h2>{f.pages}</h2>
            <ul>
              {[...NAV_KEYS, "samples" as const].map((key) => (
                <li key={key}>
                  <Link href={href(locale, key)}>{d.nav.items[key]}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="dm-footer-note">{f.note}</p>
        <details className="dm-kunye">
          <summary>{f.credits}</summary>
          <dl>
            <div>
              <dt>{k.design}</dt>
              <dd>
                <a href={k.designHref}>{k.designBy}</a>
              </dd>
            </div>
            <div>
              <dt>{k.render}</dt>
              <dd>{k.renderText}</dd>
            </div>
            <div>
              <dt>{k.photos}</dt>
              <dd>
                <ul>
                  {photos.map((c) => (
                    <li key={c.url}>
                      <a href={c.url} rel="noopener noreferrer" target="_blank">
                        {c.title}
                      </a>
                      , {c.author} ({c.licence}){c.stone ? ` · ${STONES[c.stone].name}` : ""}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{k.fonts}</dt>
              <dd>
                <ul>
                  {fonts.map((c) => (
                    <li key={c.url}>
                      <a href={c.url} rel="noopener noreferrer" target="_blank">
                        {c.title}
                      </a>
                      , {c.author} ({c.licence})
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{k.year}</dt>
              <dd>{k.yearValue}</dd>
            </div>
          </dl>
        </details>
        <p className="dm-footer-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
