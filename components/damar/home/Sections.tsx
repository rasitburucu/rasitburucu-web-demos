import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { FINISHES, STONE_IDS, STONES } from "@/content/damar/stones";
import { dict } from "@/lib/damar/dict";
import { SampleTile } from "../ui/Slab";
import { ArrowRight, Box } from "../ui/Icons";

export function Intro({ locale }: { locale: Locale }) {
  const d = dict(locale);
  return (
    <>
      <h1 id="dm-h1" className="dm-h1">
        {d.home.h1}
      </h1>
      <p className="dm-lede">{d.home.lede}</p>
    </>
  );
}

/** The sample box as an object: four stones in three finishes, block numbers
 *  on the dividers, the terms written out (rare in this trade). */
export function BoxTeaser({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const t = d.home.box;
  return (
    <section className="dm-boxsec" aria-labelledby="dm-box-h">
      <div className="dm-wrap dm-boxsec-in">
        <div className="dm-boxsec-text">
          <h2 id="dm-box-h" className="dm-h2">
            {t.title}
          </h2>
          <p>{t.text}</p>
          <p className="dm-note">{t.terms}</p>
          <Link href={`${href(locale, "samples")}#box`} className="dm-btn dm-btn--page">
            <Box />
            <span>{t.cta}</span>
          </Link>
        </div>
        <figure className="dm-tray" aria-label={t.figure}>
          <div className="dm-tray-grid" role="table" aria-label={t.figure}>
            <div role="row" className="dm-tray-head">
              <span role="columnheader" className="dm-sr">
                {d.stonesPage.stone}
              </span>
              {FINISHES.map((f) => (
                <span key={f} role="columnheader">
                  {d.finishes[f].name}
                </span>
              ))}
            </div>
            {STONE_IDS.map((id) => (
              <div role="row" key={id} className="dm-tray-row" data-ground={STONES[id].ground}>
                <span role="rowheader" className="dm-tray-name">
                  {STONES[id].name}
                  <small>{STONES[id].block.id}</small>
                </span>
                {FINISHES.map((f) => (
                  <span role="cell" key={f} className="dm-tray-slot" data-finish={f} data-ground={STONES[id].ground}>
                    <SampleTile stone={id} alt={`${STONES[id].name}, ${d.finishes[f].name}`} className="dm-slab" />
                    <span className="dm-sheen" />
                    <span className="dm-tex" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}

/** Six steps from request to sealed container, as one strip. */
export function ShipStrip({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const s = d.home.ship;
  return (
    <section className="dm-shipsec" aria-labelledby="dm-ship-h">
      <div className="dm-wrap">
        <div className="dm-shipsec-head">
          <h2 id="dm-ship-h" className="dm-h2">
            {s.title}
          </h2>
          <Link href={href(locale, "shipping")} className="dm-link">
            {s.link}
            <ArrowRight />
          </Link>
        </div>
        <ol className="dm-steps">
          {s.steps.map((step, i) => (
            <li key={step.t}>
              <span className="dm-steps-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{step.t}</h3>
              <p>{step.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
