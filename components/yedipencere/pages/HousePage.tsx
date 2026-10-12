// The house: a section with its parts numbered, breakfast in the courtyard,
// the materials as hatch swatches, the rooms of each floor through a door.

import Link from "next/link";
import type { Lang } from "@/lib/yedipencere/dates";
import { href } from "@/lib/yedipencere/paths";
import { ROOMS } from "@/lib/yedipencere/house";
import { COPY } from "@/content/yedipencere/copy";
import { DoorPhoto } from "../draw/DoorPhoto";
import { Section } from "../draw/Section";
import { Arrow } from "../ui/icons";

const SWATCH: Record<string, string> = {
  moloz: "url(#yp-moloz)",
  sur: "url(#yp-sur)",
  ahsap: "url(#yp-ahsap)",
  kiremit: "url(#yp-kiremit)",
  cakil: "url(#yp-cakil)",
  arnavut: "url(#yp-arnavut)",
  traverten: "url(#yp-traverten)",
};

export function HousePage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const h = t.housePage;
  const floors = [
    { key: "zemin" as const, photo: "ic-zemin" as const },
    { key: "birinci" as const, photo: "ic-birinci" as const },
    { key: "kosk" as const, photo: "ic-kosk" as const },
  ];
  return (
    <div className="yp-page">
      <header className="yp-page-head">
        <h1 className="yp-h1">{h.title}</h1>
        <p className="yp-lead">{h.lead}</p>
      </header>

      <section aria-labelledby="yp-sec-h">
        <div className="yp-block-head">
          <h2 id="yp-sec-h" className="yp-h2">
            {h.sectionTitle}
          </h2>
          <p className="yp-lead">{h.sectionLead}</p>
        </div>
        <div className="yp-sheet-frame">
          <Section lang={lang} parts label={h.sectionTitle} />
        </div>
        <ol className="yp-parts">
          {h.parts.map((p, i) => (
            <li key={p.title}>
              <i aria-hidden="true">{i + 1}</i>
              <b>{p.title}</b>
              <span>{p.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="yp-block yp-door" aria-labelledby="yp-kah-h">
        <div className="yp-door-frame">
          <DoorPhoto photo="sofa" lang={lang} id="kahvalti" arch />
        </div>
        <div>
          <h2 id="yp-kah-h" className="yp-h2">
            {h.breakfastTitle}
          </h2>
          <p className="yp-room-lead" style={{ marginTop: 14 }}>
            {h.breakfastBody}
          </p>
          <h3 className="yp-h3" style={{ margin: "34px 0 10px" }}>
            {h.restorationTitle}
          </h3>
          <p style={{ maxWidth: "58ch" }}>{h.restorationBody}</p>
        </div>
      </section>

      <section className="yp-block" aria-labelledby="yp-mat-h">
        <div className="yp-block-head">
          <h2 id="yp-mat-h" className="yp-h2">
            {h.materialsTitle}
          </h2>
        </div>
        <ul className="yp-mats">
          {h.materials.map((m) => (
            <li key={m.key}>
              <svg viewBox="0 0 54 40" aria-hidden="true">
                <rect width="54" height="40" fill={SWATCH[m.key]} />
              </svg>
              <span>
                <b>{m.label}</b>
                <small>{m.where}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="yp-block" aria-labelledby="yp-fl-h">
        <div className="yp-block-head">
          <h2 id="yp-fl-h" className="yp-h2">
            {h.floorsTitle}
          </h2>
        </div>
        <div className="yp-floors">
          {floors.map((fl) => (
            <figure key={fl.key}>
              <DoorPhoto photo={fl.photo} lang={lang} id={`kat-${fl.key}`} width={360} />
              <figcaption>
                <b>{h.floorNames[fl.key]}</b>
                <span>
                  {ROOMS.filter((r) => r.floor === fl.key)
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p style={{ marginTop: 18 }}>
          <Link href={href(lang, "rooms")} className="yp-more">
            {t.room.all} <Arrow />
          </Link>
        </p>
      </section>
    </div>
  );
}
