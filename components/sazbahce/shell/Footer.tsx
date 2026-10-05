import Link from "next/link";
import { tr } from "@/content/sazbahce/tr";
import { credits } from "@/content/sazbahce/credits";
import { Mark } from "./Mark";

const f = tr.footer;
const c = tr.contact;
const k = f.kunye;

export function Footer() {
  const photos = credits.filter((x) => x.group === "photo");
  const fonts = credits.filter((x) => x.group === "font");
  return (
    <footer className="sb-footer" id="iletisim">
      <div className="sb-wrap">
        <div className="sb-footer-top">
          <div className="sb-footer-brand">
            <Mark size={44} />
            <p className="sb-footer-word">{tr.brand.name}</p>
            <p className="sb-muted">{tr.brand.place}</p>
          </div>
          <div className="sb-footer-col">
            <h2>{f.visit}</h2>
            <address>
              {c.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="sb-muted">{c.hours}</p>
            <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="sb-link">
              {c.directions}
            </a>
          </div>
          <div className="sb-footer-col">
            <h2>{f.reach}</h2>
            <p>
              <a href={c.phoneHref} className="sb-link">
                {c.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${c.email}`} className="sb-link">
                {c.email}
              </a>
            </p>
          </div>
          <div className="sb-footer-col">
            <h2>{f.pages}</h2>
            <ul>
              {f.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="sb-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="sb-footer-note">{f.note}</p>

        <details className="sb-credits">
          <summary>{f.credits}</summary>
          <dl className="sb-kunye">
            <div>
              <dt>{k.design}</dt>
              <dd>
                <a href={k.designHref} target="_blank" rel="noopener noreferrer">
                  {k.designBy}
                </a>
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
                  {photos.map((x) => (
                    <li key={x.url}>
                      <a href={x.url} target="_blank" rel="noopener noreferrer">
                        {x.title}
                      </a>
                      , {x.author} ({x.licence}). {x.use}.
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
                    <li key={x.url}>
                      <a href={x.url} target="_blank" rel="noopener noreferrer">
                        {x.title}
                      </a>
                      , {x.author} ({x.licence}). {x.use}.
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

        <p className="sb-footer-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
