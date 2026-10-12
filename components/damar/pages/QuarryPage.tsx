import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { STONES, type StoneId } from "@/content/damar/stones";
import { dict } from "@/lib/damar/dict";
import { ArrowRight } from "../ui/Icons";
import { FACE_BLOCKS, QuarryFace, Stations } from "../ui/Drawings";
import { Slab } from "../ui/Slab";

// which stone each numbered cut on the face belongs to
const FACE_STONES: Record<number, StoneId> = { 1: "duman", 2: "kiragi", 3: "karakalem", 4: "sirma" };

/** Quarry and factory: the face in section, the six stations of the line,
 *  the photo of every slab, and a visit. No capacity figures. */
export function QuarryPage({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const q = d.quarry;
  const kk = STONES.karakalem;
  const sheetSlabs = kk.available.slice(0, 8);
  return (
    <>
      <header className="dm-phead dm-wrap">
        <h1 className="dm-h1">{q.h1}</h1>
        <p className="dm-lede">{q.lede}</p>
      </header>

      <section className="dm-onpage dm-qface" aria-labelledby="dm-qface-h">
        <div className="dm-wrap dm-qface-in">
          <div className="dm-qface-text">
            <h2 id="dm-qface-h" className="dm-h2">
              {q.faceTitle}
            </h2>
            <p>{q.faceText}</p>
            <ol className="dm-qface-legend">
              {FACE_BLOCKS.map((b) => {
                const s = STONES[FACE_STONES[b.n]];
                return (
                  <li key={b.n}>
                    <span className="dm-qface-n" aria-hidden="true">
                      {b.n}
                    </span>
                    <Link href={href(locale, "stone", s.id)}>{q.faceLegend(s.block.id, s.name, b.bench)}</Link>
                  </li>
                );
              })}
            </ol>
          </div>
          <figure className="dm-qface-fig">
            <div className="dm-figscroll">
              <QuarryFace label={q.faceFigure} bench={q.benches} />
            </div>
            <figcaption>{q.faceCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="dm-wrap dm-line" aria-labelledby="dm-line-h">
        <div className="dm-line-head">
          <h2 id="dm-line-h" className="dm-h2">
            {q.lineTitle}
          </h2>
          <p className="dm-lede">{q.lineText}</p>
        </div>
        <ol className="dm-stations" aria-label={q.lineFigure}>
          {q.stations.map((st, i) => {
            const Draw = Stations[i];
            return (
              <li key={st.t}>
                <div className="dm-station-draw">
                  <Draw />
                </div>
                <p className="dm-station-n dm-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="dm-h3">{st.t}</h3>
                <p>{st.d}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="dm-photosec" aria-labelledby="dm-photo-h">
        <div className="dm-wrap dm-photosec-in">
          <div className="dm-photosec-text">
            <h2 id="dm-photo-h" className="dm-h2">
              {q.photoTitle}
            </h2>
            <p>{q.photoText}</p>
          </div>
          <ol className="dm-contact" aria-label={`${kk.block.id}, ${kk.name}`}>
            {sheetSlabs.map((n) => (
              <li key={n}>
                <Slab stone="karakalem" n={n} sizes="(max-width: 760px) 22vw, 9vw" className="dm-slab" alt="" />
                <span className="dm-num">{n}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dm-wrap dm-visit" aria-labelledby="dm-visit-h">
        <h2 id="dm-visit-h" className="dm-h2">
          {q.visitTitle}
        </h2>
        <p className="dm-lede">{q.visitText}</p>
        <p className="dm-note">{q.visitNote}</p>
        <Link href={`${href(locale, "samples")}#quote`} className="dm-btn dm-btn--page">
          {q.visitCta}
          <ArrowRight />
        </Link>
      </section>
    </>
  );
}
