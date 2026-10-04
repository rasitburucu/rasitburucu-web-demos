import { Fragment } from "react";
import { footerCopy, tr } from "@/content/onikitas/tr";
import { credits } from "@/content/onikitas/credits";
import { chapters, formatHour, sectionVh } from "@/lib/onikitas/chapters";
import { Sundial } from "./Sundial";
import { Registry } from "./Registry";
import { asset } from "@/lib/asset";

/** Letters rise out of a mask when the chapter becomes active. Real text for AT. */
function Split({ text, id }: { text: string; id: string }) {
  let i = 0;
  return (
    <h2 className="oki-title" id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="oki-title__vis">
        {text.split(" ").map((word, w, all) => (
          <Fragment key={w}>
          <span className="oki-word">
            {Array.from(word).map((ch, c) => (
              <span key={c} className="oki-ch" style={{ "--i": i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {w < all.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </h2>
  );
}

/**
 * Which side of the screen each hour's copy stands on; the side rails follow
 * it (s: dawn, copy left and no clock yet; c: night, copy centred on top).
 */
const SIDE: Record<string, "s" | "l" | "r" | "c"> = {
  safak: "s",
  sabah: "l",
  kusluk: "r",
  ogle: "l",
  ikindi: "r",
  aksam: "l",
  yatsi: "c",
};

export function Chapters() {
  return (
    <main id="icerik" className="oki-main">
      {chapters.map((c, i) => {
        const copy = tr.chapters[c.id];
        return (
          <section
            key={c.id}
            id={c.id}
            data-chapter={i}
            data-name={copy.name}
            data-side={SIDE[c.id]}
            className={`oki-chapter oki-chapter--${c.id}`}
            style={{ height: `${sectionVh(c)}svh` }}
            aria-labelledby={`${c.id}-title`}
          >
            {c.id === "aksam" ? (
              <span id="ziyaret" className="oki-anchor" style={{ top: `${Math.round(c.vh * 0.62)}svh` }} aria-hidden="true" />
            ) : null}
            <div className="oki-sticky">
              <div className="oki-copy" data-copy data-on={i === 0 ? "true" : undefined}>
                <p className="sr-only">
                  {copy.name}, saat {formatHour(c.from)}
                </p>
                {i === 0 ? (
                  // the first title is the page's largest paint: printed as is,
                  // no letter-by-letter rise, so it counts the moment it lands
                  <h1 className="oki-title" id={`${c.id}-title`}>
                    {copy.title}
                  </h1>
                ) : (
                  <Split text={copy.title} id={`${c.id}-title`} />
                )}
                <p className="oki-copy__body">{copy.body}</p>
                {c.id === "yatsi" ? (
                  <p className="oki-close">
                    <a href="#ziyaret" className="oki-close__visit">
                      {tr.close.visit}
                    </a>
                    <a href="#evler" className="oki-close__homes">
                      {tr.close.homes}
                    </a>
                  </p>
                ) : null}
              </div>
              {c.id === "aksam" ? (
                <div
                  className="oki-dial-panel"
                  data-dial-panel
                  id="ziyaret-panel"
                  style={{ "--trav-tex": `url("${asset("/onikitas/tex/travertine.webp")}")` } as React.CSSProperties}
                >
                  <Sundial />
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
      <Registry />
    </main>
  );
}

/** Footer: brand, visit, contact, pages (the menu's list), then the concept note, the project credits and the copyright line. */
export function Footer() {
  const f = footerCopy.footer;
  const c = footerCopy.contact;
  const fonts = credits.filter((x) => x.group === "fonts");
  const textures = credits.filter((x) => x.group === "textures");
  const code = credits.filter((x) => x.group === "code");
  const list = (items: typeof credits) => (
    <ul>
      {items.map((x) => (
        <li key={x.name}>
          <a href={x.url} rel="noreferrer">
            {x.name}
          </a>
          , {x.author} ({x.licence}). {x.use}.
        </li>
      ))}
    </ul>
  );
  return (
    <footer className="oki-footer" id="iletisim">
      <div className="oki-footer__top">
        <div className="oki-footer__brand-col">
          <p className="oki-footer__brand">{tr.brand}</p>
          <p className="oki-footer__name">{f.brandName}</p>
          <p className="oki-footer__muted">{f.place}</p>
        </div>
        <div className="oki-footer__col">
          <h2>{f.visitTitle}</h2>
          <address>
            {c.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <p className="oki-footer__muted">{c.hours}</p>
          <p>
            <a href={c.mapsHref} target="_blank" rel="noopener noreferrer">
              {c.directions}
            </a>
          </p>
        </div>
        <div className="oki-footer__col">
          <h2>{f.contactTitle}</h2>
          <p>
            <a href={c.phoneHref}>{c.phone}</a>
          </p>
          <p>
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </p>
        </div>
        <div className="oki-footer__col">
          <h2>{f.pagesTitle}</h2>
          <ul>
            {tr.nav.pages.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="oki-footer__base">
        <p className="oki-footer__note">{f.note}</p>
        <details className="oki-credits">
          <summary>{f.creditsTitle}</summary>
          <dl>
            <div>
              <dt>{f.rows.made}</dt>
              <dd>
                <a href={tr.strip.href}>{f.madeBy}</a>
              </dd>
            </div>
            <div>
              <dt>{f.rows.render}</dt>
              <dd>
                <p>{f.render}</p>
                <p className="oki-credits__sub">{f.textures}</p>
                {list(textures)}
                <p className="oki-credits__sub">{f.code}</p>
                {list(code)}
              </dd>
            </div>
            <div>
              <dt>{f.rows.photos}</dt>
              <dd>{f.noPhotos}</dd>
            </div>
            <div>
              <dt>{f.rows.fonts}</dt>
              <dd>{list(fonts)}</dd>
            </div>
            <div>
              <dt>{f.rows.year}</dt>
              <dd>{f.year}</dd>
            </div>
          </dl>
        </details>
        <p className="oki-footer__copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
