import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { TorbaKesiti } from "@/components/gelidonya/ui/Cizimler";

export const metadata: Metadata = {
  title: "Seralarımız",
  description: "Kumluca ve Finike'deki seralarımızda kışın domates: sonbahar dikimi, topraksız tarım ve torba kesiti, fidelik. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/seralarimiz/" },
};

export default function SeralarimizPage() {
  const p = tr.seralarimiz;
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap gd-media-row gd-media-row--head">
          <div className="gd-prose">
            <h1 className="gd-h1">{p.title}</h1>
            <p className="gd-lead">{p.lead}</p>
          </div>
          <Resim k="ova" className="gd-media gd-media--wide" alt={p.imageAlt} sizes="(min-width: 900px) 55vw, 100vw" priority />
        </div>
      </header>

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-s-kis">
        <div className="gd-wrap gd-split">
          <h2 id="gd-s-kis" className="gd-h2">
            {p.kis.title}
          </h2>
          <div className="gd-prose">
            {p.kis.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="gd-sec" aria-labelledby="gd-s-toprak">
        <div className="gd-wrap">
          <div className="gd-sec-head gd-sec-head--narrow">
            <h2 id="gd-s-toprak" className="gd-h2">
              {p.topraksiz.title}
            </h2>
            {p.topraksiz.text.map((t) => (
              <p key={t} className="gd-lead">
                {t}
              </p>
            ))}
          </div>
          <TorbaKesiti />
        </div>
      </section>

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-s-fide">
        <div className="gd-wrap gd-split">
          <h2 id="gd-s-fide" className="gd-h2">
            {p.fidelik.title}
          </h2>
          <div className="gd-prose">
            {p.fidelik.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p className="gd-gap">{p.gap}</p>
            <p className="gd-btn-row">
              <Link href={`${tr.base}/fidelik/`} className="gd-btn gd-btn--dark">
                {tr.nav.items[1].label}
              </Link>
              <Link href={`${tr.base}/urunlerimiz/`} className="gd-btn gd-btn--line">
                {p.cta}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
