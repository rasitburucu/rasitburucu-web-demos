import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { LISTE_TARIHI } from "@/content/gelidonya/urunler";
import { tarih } from "@/lib/gelidonya/hesap";
import { HazirListe } from "@/components/gelidonya/pages/HazirListe";

export const metadata: Metadata = {
  title: "Hazır fide listesi",
  description: "Gelidonya fideliğinde teslime hazır aşılı ve aşısız domates, biber, patlıcan ve hıyar fidesi: viyol, adet, hazır tarihi. Örnek liste, konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/hazir-fide/" },
};

export default function HazirFidePage() {
  const h = tr.hazir;
  return (
    <>
      <header className="gd-page-head gd-page-head--list">
        <div className="gd-wrap">
          <p className="gd-print-only gd-print-head">{h.printHead}</p>
          <h1 className="gd-h1">{h.title}</h1>
          <p className="gd-lead">{h.lead}</p>
          <p className="gd-updated">
            {h.updated(tarih(LISTE_TARIHI))} <span className="gd-muted">[{h.updatedNote}]</span>
          </p>
        </div>
      </header>
      <section className="gd-sec gd-sec--tight" aria-label={h.title}>
        <div className="gd-wrap">
          <HazirListe />
          <p className="gd-note">{h.durumHelp}</p>
          <p className="gd-note">{h.typeNote}</p>
        </div>
      </section>
    </>
  );
}
