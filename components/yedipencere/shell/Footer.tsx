// The shared footer of the concept demos (fixed order and labels):
// brand, visit, contact, pages, concept note, project credits, copyright.

import Link from "next/link";
import type { Lang } from "@/lib/yedipencere/dates";
import { href, type PageKey } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";
import { PHOTOS, type PhotoKey } from "@/content/yedipencere/photos";

const PAGES: PageKey[] = ["home", "rooms", "arrival", "house", "faq", "booking"];

export function Footer({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const f = t.footer;
  const label = (p: PageKey) => (p === "home" ? t.nav.home : t.nav[p as "rooms" | "arrival" | "house" | "faq" | "booking"]);
  // one line per photographer
  const byAuthor = new Map<string, { url: string; licence: string; keys: PhotoKey[] }>();
  (Object.keys(PHOTOS) as PhotoKey[]).forEach((k) => {
    const p = PHOTOS[k];
    const e = byAuthor.get(p.author);
    if (e) e.keys.push(k);
    else byAuthor.set(p.author, { url: p.url, licence: p.licence, keys: [k] });
  });
  return (
    <footer className="yp-footer">
      <div className="yp-wrap">
        <div className="yp-footer-top">
          <div className="yp-footer-brand">
            <p className="yp-footer-word">{t.brand.name}</p>
            <p>{f.brandLine}</p>
          </div>
          <div className="yp-footer-col">
            <h2>{f.visit}</h2>
            <address>
              {f.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="yp-muted">{f.addressNote}</p>
            <Link href={href(lang, "arrival")} className="yp-link">
              {f.directions}
            </Link>
          </div>
          <div className="yp-footer-col">
            <h2>{f.contact}</h2>
            <p>
              <a href={f.phoneHref} className="yp-link">
                {f.phone}
              </a>{" "}
              <span className="yp-tag">{f.phoneNote}</span>
            </p>
            <p>
              <a href={`mailto:${f.email}`} className="yp-link">
                {f.email}
              </a>{" "}
              <span className="yp-tag">{f.emailNote}</span>
            </p>
            <p className="yp-muted">{f.hours}</p>
          </div>
          <div className="yp-footer-col">
            <h2>{f.pages}</h2>
            <ul>
              {PAGES.map((p) => (
                <li key={p}>
                  <Link href={href(lang, p)} className="yp-link">
                    {label(p)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="yp-footer-note">{f.note}</p>

        <details className="yp-credits">
          <summary>{f.credits}</summary>
          <dl>
            <div>
              <dt>{f.design}</dt>
              <dd>
                <a href={f.designHref} target="_blank" rel="noopener noreferrer">
                  {f.designBy}
                </a>
              </dd>
            </div>
            <div>
              <dt>{f.render}</dt>
              <dd>{f.renderText}</dd>
            </div>
            <div>
              <dt>{f.photos}</dt>
              <dd>
                <ul>
                  {[...byAuthor.entries()].map(([author, e]) => (
                    <li key={author}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        {author}
                      </a>{" "}
                      ({e.licence}), {f.photosUse}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{f.fonts}</dt>
              <dd>{f.fontsText}</dd>
            </div>
            <div>
              <dt>{f.year}</dt>
              <dd>{f.yearValue}</dd>
            </div>
          </dl>
        </details>

        <p className="yp-footer-copy">
          {f.copyright.split("OpenStreetMap")[0]}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>
          {f.copyright.split("OpenStreetMap")[1]}
        </p>
      </div>
    </footer>
  );
}
