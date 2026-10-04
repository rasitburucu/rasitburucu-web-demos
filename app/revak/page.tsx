import Link from "next/link";
import { preload } from "react-dom";
import { tr } from "@/content/revak/tr";
import { SentenceForm } from "@/components/revak/home/SentenceForm";
import { Walk } from "@/components/revak/home/Walk";
import { ClubList, EventTable, NearestSlots } from "@/components/revak/home/Interactive";
import { Photo, srcSet } from "@/components/revak/ui/Photo";
import { Faq } from "@/components/revak/ui/Faq";

const HERO_SIZES = "(max-width: 860px) 92vw, 40vw";
const ROMAN = ["i.", "ii.", "iii."];

export default function RevakHome() {
  preload(srcSet("revak", "avif").split(" ")[0], {
    as: "image",
    imageSrcSet: srcSet("revak", "avif"),
    imageSizes: HERO_SIZES,
    type: "image/avif",
    fetchPriority: "high",
  });

  const h = tr.hero;
  return (
    <>
      {/* 1. Hero: inside the arcade at a child's eye height; the first step of every flow beside it. */}
      <section className="rv-cover" aria-labelledby="rv-hero-title">
        <div className="rv-wrap rv-cover-grid">
          <div className="rv-cover-main">
            <h1 className="rv-cover-title" id="rv-hero-title">
              {h.title}
            </h1>
            <p className="rv-lede rv-cover-lede">{h.sub}</p>
            <SentenceForm season={h.season} />
            <Link href="/revak/kabul/kampus-turu/" className="rv-textlink rv-cover-tour">
              {h.secondary}
            </Link>
          </div>
          <figure className="rv-cover-arch">
            <Photo k="revak" arch priority sizes={HERO_SIZES} />
          </figure>
        </div>
      </section>

      {/* 2. Proof as a poster: one large numeral, three smaller ones, each read as its sentence */}
      <section className="rv-facts" aria-labelledby="rv-proof-title">
        <div className="rv-wrap">
          <h2 className="rv-folio" id="rv-proof-title">
            {tr.proof.title}
          </h2>
          <ol className="rv-poster">
            {tr.proof.lines.map((l) => (
              <li key={l.pre} className="rv-poster-item">
                <p className="rv-fact">
                  <span className="rv-fact-pre">{l.pre}</span>{" "}
                  <span className="rv-fact-big">{l.big}</span>{" "}
                  <span className="rv-fact-post">{l.post}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Signature: the walk through the arcade */}
      <Walk />

      {/* 4. Where the walk ends: university guidance, grade by grade (no placement numbers) */}
      <section className="rv-section rv-guide" id="rehberlik" aria-labelledby="rv-guide-title">
        <div className="rv-wrap">
          <div className="rv-guide-head">
            <h2 className="rv-h2" id="rv-guide-title">
              {tr.guidance.title}
            </h2>
            <p className="rv-lede">{tr.guidance.intro}</p>
          </div>
          <ol className="rv-guide-steps">
            {tr.guidance.steps.map((s) => (
              <li key={s.grade}>
                <p className="rv-guide-grade">{s.grade}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <Link href={tr.guidance.linkHref} className="rv-textlink rv-guide-link">
            {tr.guidance.link}
          </Link>
        </div>
      </section>

      {/* 5. Approach: three habits with hanging numerals */}
      <section className="rv-section rv-manifesto" id="yaklasim" aria-labelledby="rv-approach-title">
        <div className="rv-wrap">
          <div className="rv-manifesto-grid">
            <h2 className="rv-manifesto-title" id="rv-approach-title">
              {tr.approach.title}
            </h2>
            <figure className="rv-manifesto-plate">
              <Photo k="writing" arch reveal sizes="(max-width: 860px) 60vw, 20vw" alt={tr.approach.imageAlt} />
            </figure>
            <ol className="rv-manifesto-list">
              {tr.approach.items.map((a, i) => (
                <li key={a.title}>
                  <span className="rv-manifesto-n" aria-hidden="true">
                    {ROMAN[i]}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 6. Arts, sport, clubs */}
      <section className="rv-section rv-clubs" aria-label={tr.clubs.title}>
        <div className="rv-wrap">
          <ClubList />
        </div>
      </section>

      {/* 7. Campus: the courtyard band, the headline set on the render's sill */}
      <section className="rv-campus2" aria-labelledby="rv-campus-title">
        <div className="rv-campus2-media">
          <Photo k="avlu" className="rv-parallax" sizes="100vw" alt={tr.campusPreview.imageAlt} />
        </div>
        <div className="rv-wrap rv-campus2-body">
          <div className="rv-campus2-head">
            <h2 className="rv-h2" id="rv-campus-title">
              {tr.campusPreview.title}
            </h2>
            <Link href="/revak/kampus/" className="rv-btn rv-btn--line">
              {tr.campusPreview.cta}
            </Link>
          </div>
          <ul className="rv-facts4">
            {tr.campusPreview.facilities.map((f) => (
              <li key={f.name}>
                <h3>{f.name}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Events */}
      <section className="rv-section" aria-label={tr.events.title}>
        <div className="rv-wrap">
          <EventTable />
        </div>
      </section>

      {/* 9. FAQ */}
      <Faq title={tr.faq.title} groups={tr.faq.groups} />

      {/* 10. Closing: nearest free tour slots */}
      <section className="rv-closing rv-ink rv-on-ink" aria-labelledby="rv-closing-title">
        <div className="rv-wrap rv-closing-grid">
          <div>
            <h2 id="rv-closing-title">{tr.closing.title}</h2>
            <p className="rv-lede">{tr.closing.text}</p>
          </div>
          <NearestSlots />
        </div>
      </section>
    </>
  );
}
