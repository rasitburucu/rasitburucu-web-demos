import { Fragment } from "react";
import { tr } from "@/content/onikitas/tr";
import { credits, type CreditGroup } from "@/content/onikitas/credits";
import { chapters, formatHour, sectionVh } from "@/lib/onikitas/chapters";
import { Sundial } from "./Sundial";
import { Registry } from "./Registry";

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
                <div className="oki-dial-panel" data-dial-panel id="ziyaret-panel">
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

const GROUPS: CreditGroup[] = ["fonts", "textures", "code"];

export function Footer() {
  return (
    <footer className="oki-footer">
      <div className="oki-footer__grid">
        <div className="oki-footer__lead">
          <p className="oki-footer__brand">{tr.brand}</p>
          <p>{tr.footer.fiction}</p>
          <p>{tr.footer.procedural}</p>
          <p>
            {tr.footer.made}.{" "}
            <a href={tr.strip.href}>{tr.footer.back}</a>
          </p>
        </div>
        <div className="oki-footer__credits">
          <h2>{tr.footer.creditsTitle}</h2>
          {GROUPS.map((g) => (
            <div key={g} className="oki-footer__group">
              <h3>{tr.footer.groups[g]}</h3>
              <ul>
                {credits
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.name}>
                      <a href={c.url} rel="noreferrer">
                        {c.name}
                      </a>
                      <span>
                        {c.author}, {c.licence}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
