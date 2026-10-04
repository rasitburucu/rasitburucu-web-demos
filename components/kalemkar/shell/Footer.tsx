import Link from "next/link";
import { tr } from "@/content/kalemkar/tr";
import { credits } from "@/content/kalemkar/credits";
import { Rosette } from "../ui/Rosette";

const f = tr.footer;
const c = tr.contact;
const k = f.kunye;

export function Strip() {
  return (
    <div className="kk-strip" role="note">
      <div className="kk-wrap kk-strip-in">
        <p>
          {tr.strip.text} <a href={tr.strip.href}>{tr.strip.link}</a>
        </p>
      </div>
    </div>
  );
}

export function Footer() {
  const photos = credits.filter((x) => x.group === "photo");
  const fonts = credits.filter((x) => x.group === "font");
  const hdri = credits.find((x) => x.group === "hdri");
  return (
    <footer className="kk-footer" id="iletisim">
      <div className="kk-wrap">
        <div className="kk-footer-top">
          <div className="kk-footer-brand">
            <Rosette size={56} />
            <p className="kk-footer-word">{tr.brand.word}</p>
            <p className="kk-muted">{tr.brand.place}</p>
          </div>
          <div className="kk-footer-col">
            <h2>{f.visit}</h2>
            <address>
              {c.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="kk-muted">{c.walk}</p>
            <p className="kk-muted">{c.hours}</p>
            <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="kk-link">
              {c.directions}
            </a>
          </div>
          <div className="kk-footer-col">
            <h2>{f.reach}</h2>
            <p>
              <a href={c.phoneHref} className="kk-link">
                {c.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${c.email}`} className="kk-link">
                {c.email}
              </a>
            </p>
          </div>
          <div className="kk-footer-col">
            <h2>{f.pages}</h2>
            <ul>
              {f.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="kk-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="kk-footer-note">{f.note}</p>

        <details className="kk-credits">
          <summary>{f.credits}</summary>
          <dl className="kk-kunye">
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
              <dd>
                {k.renderText}{" "}
                {hdri && (
                  <>
                    <a href={hdri.url} target="_blank" rel="noopener noreferrer">
                      {hdri.title}
                    </a>
                    , {hdri.author} ({hdri.licence}).
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>{k.photos}</dt>
              <dd>
                <ul>
                  {photos.map((x) => (
                    <li key={x.title}>
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
                    <li key={x.title}>
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

        <p className="kk-footer-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
