import Link from "next/link";
import { PAGES, tr } from "@/content/revak/tr";
import { credits } from "@/content/revak/credits";
import { Mark } from "../ui/Icon";
import { KvkkLink } from "../ui/Drawer";

const f = tr.footer;
const k = f.kunye;
const c = tr.contact;

/* Künye: brand, Ziyaret, İletişim, Sayfalar; then the concept note, the project credits
   and the copyright line. Same structure and labels on every concept site. */
export function Footer() {
  const photos = credits.filter((x) => x.group === "photo");
  const fonts = credits.filter((x) => x.group === "font");
  return (
    <footer className="rv-footer" id="iletisim">
      <div className="rv-wrap">
        <div className="rv-footer-top">
          <div className="rv-footer-brand">
            <Mark size={44} />
            <div>
              <p className="rv-footer-name">{tr.brand.full}</p>
              <p className="rv-footer-muted rv-footer-place">{tr.brand.place}</p>
            </div>
          </div>

          <div className="rv-footer-col">
            <h2>{f.visitTitle}</h2>
            <address>
              {c.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="rv-footer-muted">{c.hours}</p>
            <p>
              <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="rv-footer-link">
                {f.directions}
              </a>
            </p>
          </div>

          <div className="rv-footer-col">
            <h2>{f.reachTitle}</h2>
            <p>
              <a href={c.phoneHref}>{c.phone}</a>
              <br />
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </p>
            <p>
              <KvkkLink className="rv-footer-btnlink" />
            </p>
          </div>

          <div className="rv-footer-col rv-footer-pages">
            <h2>{f.pagesTitle}</h2>
            <ul>
              {PAGES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rv-footer-base">
          <p className="rv-footer-note">{f.note}</p>
          <details className="rv-credits">
            <summary>{k.title}</summary>
            <dl className="rv-kunye">
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
                    {photos.map((p) => (
                      <li key={p.url}>
                        <a href={p.url} target="_blank" rel="noopener noreferrer">
                          {p.author}
                        </a>
                        , {p.licence}. {p.use}.
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>{k.fonts}</dt>
                <dd>
                  <ul>
                    {fonts.map((x) => (
                      <li key={x.title}>
                        <a href={x.url} target="_blank" rel="noopener noreferrer">
                          {x.title}
                        </a>
                        , {x.author} ({x.licence}).
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
          <p className="rv-footer-muted">
            {f.copyright} <a href={tr.strip.href}>{tr.strip.link}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* The concept strip: one line on every screen size. */
export function Strip() {
  return (
    <div className="rv-strip">
      <p>
        {tr.strip.text} <a href={tr.strip.href}>{tr.strip.link}</a>
      </p>
    </div>
  );
}
