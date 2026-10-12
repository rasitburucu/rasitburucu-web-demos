// The first screen's drawing: the house from the lane, the courtyard and the
// sea. Static linework is rendered on the server; windows and their names are
// live (WindowLayer, LabelLayer).

import type { Lang } from "@/lib/yedipencere/dates";
import { COPY } from "@/content/yedipencere/copy";
import { AvluBase, AvluTop, DenizBase, DenizTop, SokakBase, SokakTop } from "../draw/Elevations";
import { LabelLayer, WindowLayer } from "../draw/WindowLayer";
import { ELEV } from "../draw/windows";
import { PaftaFrame } from "./PaftaFrame";

export function Pafta({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const vb = (s: keyof typeof ELEV) => ELEV[s].vb.join(" ");
  return (
    <PaftaFrame lang={lang}>
      <div className="yp-elevs" role="group" aria-label={t.drawing.label}>
        <div className="yp-elev" data-side="sokak" style={{ flexGrow: ELEV.sokak.vb[2] }}>
          <svg viewBox={vb("sokak")} role="group" aria-label={t.sides.sokak}>
            <SokakBase />
            <WindowLayer side="sokak" lang={lang} />
            <SokakTop lang={lang} />
            <LabelLayer side="sokak" lang={lang} />
          </svg>
        </div>
        <div className="yp-elev" data-side="avlu" style={{ flexGrow: ELEV.avlu.vb[2] }}>
          <svg viewBox={vb("avlu")} role="group" aria-label={t.sides.avlu}>
            <AvluBase />
            <WindowLayer side="avlu" lang={lang} />
            <AvluTop lang={lang} />
            <LabelLayer side="avlu" lang={lang} />
          </svg>
        </div>
        <div className="yp-elev" data-side="deniz" style={{ flexGrow: ELEV.deniz.vb[2] }}>
          <svg viewBox={vb("deniz")} role="group" aria-label={t.sides.deniz}>
            <DenizBase />
            <WindowLayer side="deniz" lang={lang} />
            <DenizTop lang={lang} />
            <LabelLayer side="deniz" lang={lang} />
          </svg>
        </div>
      </div>
    </PaftaFrame>
  );
}
