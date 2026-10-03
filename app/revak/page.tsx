import Link from "next/link";
import { preload } from "react-dom";
import { tr } from "@/content/revak/tr";
import { SentenceForm } from "@/components/revak/home/SentenceForm";
import { Walk } from "@/components/revak/home/Walk";
import { AlumniTabs, ClubList, EventTable, NearestSlots } from "@/components/revak/home/Interactive";
import { Photo, srcSet } from "@/components/revak/ui/Photo";
import { Faq } from "@/components/revak/ui/Faq";
import { Folio } from "@/components/revak/ui/Folio";

const HERO_SIZES = "(max-width: 860px) 34vw, 15vw";
const ROMAN = ["i.", "ii.", "iii."];

export default function RevakHome() {
  preload(srcSet("hero", "avif").split(" ")[0], {
    as: "image",
    imageSrcSet: srcSet("hero", "avif"),
    imageSizes: HERO_SIZES,
    type: "image/avif",
    fetchPriority: "high",
  });

  const h = tr.hero;
  return (
    <>
      {/* 1. Hero: an almanac cover. The arch photograph is set inside the headline. */}
      <section className="rv-cover" aria-labelledby="rv-hero-title">
        <div className="rv-wrap">
          <ul className="rv-masthead" aria-label={tr.brand.full}>
            {h.masthead.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <h1 className="rv-cover-title" id="rv-hero-title">
            <span className="rv-sr">{h.title}</span>
            <span className="rv-line" aria-hidden="true">
              <span className="rv-mask">
                <span>{h.titleLines[0]}</span>
              </span>
            </span>
            <span className="rv-line rv-line--in" aria-hidden="true">
              <span className="rv-mask">
                <span>
                  <em>{h.titleLines[1]}</em>
                </span>
              </span>
              <span className="rv-cover-arch">
                <Photo k="hero" arch priority sizes={HERO_SIZES} alt="" />
              </span>
            </span>
            <span className="rv-line" aria-hidden="true">
              <span className="rv-mask">
                <span>{h.titleLines[2]}</span>
              </span>
            </span>
          </h1>
          <div className="rv-cover-foot">
            <p className="rv-cover-caption" aria-hidden="true">
              {h.caption}
            </p>
            <p className="rv-lede">{h.sub}</p>
            <div className="rv-cover-cta">
              <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--seal">
                {h.primary}
              </Link>
              <Link href="/revak/kabul/kampus-turu/" className="rv-textlink rv-textlink--big">
                {h.secondary}
              </Link>
            </div>
          </div>
          <SentenceForm />
        </div>
      </section>

      {/* 2. Proof as one typographic paragraph, numerals in the running text */}
      <section className="rv-facts" aria-labelledby="rv-proof-title">
        <div className="rv-wrap">
          <Folio n={tr.proof.folio} id="rv-proof-title">
            {tr.proof.title}
          </Folio>
          <p className="rv-facts-text">
            {tr.proof.lines.map((l, i) => (
              <span key={l.big} className="rv-fact">
                {l.pre}
                <span className="rv-fact-big">{l.big}</span>
                <sup className="rv-fact-ref">{i + 1}</sup>
                {l.post}{" "}
              </span>
            ))}
          </p>
          <ol className="rv-facts-notes">
            {tr.proof.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Signature: the walk through the arcade */}
      <Walk />

      {/* 4. Where the walk ends: the class of 2026 */}
      <section className="rv-section rv-alumni" id="mezunlar" aria-labelledby="rv-alumni-title">
        <div className="rv-wrap">
          <Folio n={tr.alumni.folio} />
          <div className="rv-alumni-grid">
            <div>
              <h2 className="rv-h2" id="rv-alumni-title">
                {tr.alumni.title}
              </h2>
              <p className="rv-lede">{tr.alumni.intro}</p>
              <AlumniTabs />
            </div>
            <figure className="rv-alumni-quote" style={{ margin: 0 }}>
              <blockquote>
                <p>{tr.alumni.quote}</p>
              </blockquote>
              <figcaption>
                <cite>
                  {tr.alumni.who}
                  <span>{tr.alumni.whoDetail}</span>
                </cite>
              </figcaption>
              <Link href={tr.alumni.linkHref} className="rv-textlink">
                {tr.alumni.link}
              </Link>
            </figure>
          </div>
        </div>
      </section>

      {/* 5. Approach: a short manifesto with hanging numerals */}
      <section className="rv-section rv-manifesto" id="yaklasim" aria-labelledby="rv-approach-title">
        <div className="rv-wrap">
          <Folio n={tr.approach.folio} />
          <div className="rv-manifesto-grid">
            <h2 className="rv-manifesto-title" id="rv-approach-title">
              {tr.approach.title}
            </h2>
            <figure className="rv-manifesto-plate">
              <Photo k="writing" arch reveal sizes="(max-width: 860px) 50vw, 20vw" alt={tr.approach.imageAlt} />
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
          <Folio n={tr.clubs.folio} />
          <ClubList />
        </div>
      </section>

      {/* 7. Campus preview: full-bleed, the headline set on the photograph's sill */}
      <section className="rv-campus2" aria-labelledby="rv-campus-title">
        <div className="rv-campus2-media">
          <Photo k="campus" className="rv-parallax" sizes="100vw" alt={tr.campusPreview.imageAlt} />
        </div>
        <div className="rv-wrap rv-campus2-body">
          <Folio n={tr.campusPreview.folio} />
          <div className="rv-campus2-head">
            <h2 className="rv-h2" id="rv-campus-title">
              {tr.campusPreview.title}
            </h2>
            <Link href="/revak/kampus/" className="rv-btn rv-btn--line">
              {tr.campusPreview.cta}
            </Link>
          </div>
          <ul className="rv-facts4">
            {tr.campusPreview.facilities.map((f, i) => (
              <li key={f.name}>
                <span className="rv-num rv-facts4-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
          <Folio n={tr.events.folio} />
          <EventTable />
        </div>
      </section>

      {/* 9. Parent voices */}
      <section className="rv-section rv-voices" aria-labelledby="rv-voices-title">
        <div className="rv-wrap">
          <Folio n={tr.voices.folio} id="rv-voices-title">
            {tr.voices.title}
          </Folio>
          <div className="rv-voices-list">
            {tr.voices.items.map((v) => (
              <figure key={v.who} className="rv-voice">
                <blockquote>
                  <p>“{v.quote}”</p>
                </blockquote>
                <figcaption>
                  {v.who} <span>{v.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <Faq title={tr.faq.title} groups={tr.faq.groups} folio={tr.faq.folio} />

      {/* 11. Closing: nearest free tour slots */}
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
