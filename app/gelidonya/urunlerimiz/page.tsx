import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { Sezon } from "@/components/gelidonya/home/Sections";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { AliciFormu } from "@/components/gelidonya/pages/AliciFormu";

export const metadata: Metadata = {
  title: "Ürünlerimiz ve ihracat",
  description: "Kendi seralarımızda yetiştirdiğimiz domates ve mevsim sebzesi: hasat sezonu, ambalaj, belgeler ve fiyat sorma. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/urunlerimiz/" },
};

export default function UrunlerimizPage() {
  const p = tr.urunlerimiz;
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap">
          <h1 className="gd-h1">{p.title}</h1>
          <p className="gd-lead">{p.lead}</p>
        </div>
      </header>
      <Resim k="urun" className="gd-page-img" alt={p.imageAlt} sizes="100vw" priority />

      <section className="gd-block gd-block--white" aria-labelledby="gd-u-season">
        <div className="gd-wrap">
          <h2 id="gd-u-season" className="gd-h2">
            {p.productsTitle}
          </h2>
          <Sezon caption={tr.urunler.seasonCaption} />
          <p className="gd-note">{tr.seralarimiz.seasonNote}</p>
        </div>
      </section>

      <section className="gd-block" aria-labelledby="gd-u-req">
        <div className="gd-wrap gd-req">
          <div className="gd-prose">
            <h2 id="gd-u-req" className="gd-h2">
              {p.docsTitle}
            </h2>
            <ul className="gd-bullets">
              {p.docs.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="gd-gap">{p.docsNote}</p>
            <h2 className="gd-h2">{p.packTitle}</h2>
            <ul className="gd-bullets">
              {p.pack.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="gd-gap">{p.packNote}</p>
          </div>
          <AliciFormu />
        </div>
      </section>
    </>
  );
}
