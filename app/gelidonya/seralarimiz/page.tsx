import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { TorbaKesiti } from "@/components/gelidonya/ui/Cizimler";
import { Sezon } from "@/components/gelidonya/home/Sections";

export const metadata: Metadata = {
  title: "Seralarımız",
  description: "Kumluca ve Finike'deki seralarımızda kışın domates: sonbahar dikimi, topraksız tarım, hasat sezonu. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/seralarimiz/" },
};

export default function SeralarimizPage() {
  const p = tr.seralarimiz;
  const [kis, topraksiz, fide] = p.sections;
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap">
          <h1 className="gd-h1">{p.title}</h1>
          <p className="gd-lead">{p.lead}</p>
        </div>
      </header>
      <Resim k="ova" className="gd-page-img" alt={p.imageAlt} sizes="100vw" priority />

      <section className="gd-block gd-block--white" aria-labelledby="gd-s-kis">
        <div className="gd-wrap gd-inside">
          <div className="gd-prose">
            <h2 id="gd-s-kis" className="gd-h2">
              {kis.title}
            </h2>
            {kis.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <Resim k="sera-ici" alt={p.insideAlt} sizes="(max-width: 899px) 100vw, 50vw" />
        </div>
      </section>

      <section className="gd-block" aria-labelledby="gd-s-toprak">
        <div className="gd-wrap gd-figure-row">
          <div className="gd-prose">
            <h2 id="gd-s-toprak" className="gd-h2">
              {topraksiz.title}
            </h2>
            {topraksiz.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <figure className="gd-figure">
            <TorbaKesiti />
          </figure>
        </div>
      </section>

      <section className="gd-block gd-block--white" aria-labelledby="gd-s-sezon">
        <div className="gd-wrap gd-figure-row gd-figure-row--season">
          <div className="gd-prose">
            <h2 id="gd-s-sezon" className="gd-h2">
              {p.seasonTitle}
            </h2>
            <p>{p.seasonText}</p>
            <p>
              <Link href={`${tr.base}/urunlerimiz/`} className="gd-link">
                {p.seasonLink}
              </Link>
            </p>
          </div>
          <Sezon caption={tr.urunler.seasonCaption} />
        </div>
      </section>

      <section className="gd-block" aria-labelledby="gd-s-fide">
        <div className="gd-wrap gd-split">
          <h2 id="gd-s-fide" className="gd-h2">
            {fide.title}
          </h2>
          <div className="gd-prose">
            {fide.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p className="gd-gap">{p.gap}</p>
            <p>
              <Link href={`${tr.base}/urunlerimiz/`} className="gd-btn gd-btn--dark">
                {p.cta}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
