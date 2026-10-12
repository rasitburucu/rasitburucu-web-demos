// "Ruhsat ve imar": the honest guide. What decides, who decides, which line of
// the zoning certificate is which box of the plot check, what the title deed's
// one word changes, and the sentences we do not say. Sources at the end.
import Link from "next/link";
import { tr } from "@/content/vaziyet/tr";

export function Rehber() {
  const t = tr.rehber;
  return (
    <>
      <section className="vz-sayfa-bas vz-mat">
        <div className="vz-wrap vz-rehber-bas">
          <h1 className="vz-h1">{t.baslik}</h1>
          <p className="vz-lead">{t.lead}</p>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit" aria-labelledby="vz-kisaca">
        <div className="vz-wrap">
          <h2 id="vz-kisaca" className="vz-h2">
            {t.kisaca}
          </h2>
          <ol className="vz-kisaca">
            {t.ozet.map((o, i) => (
              <li key={o.baslik}>
                <span className="vz-kisaca-no" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="vz-h3">{o.baslik}</h3>
                <p>{o.metin}</p>
                {o.kaynak && <p className="vz-kaynak">{o.kaynak}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="vz-bant vz-bant--kart" aria-labelledby="vz-tapu">
        <div className="vz-wrap">
          <div className="vz-bant-bas">
            <h2 id="vz-tapu" className="vz-h2">
              {t.tapuBaslik}
            </h2>
            <p className="vz-lead">{t.tapuLead}</p>
          </div>
          <div className="vz-tapu">
            {t.tapu.map((x) => (
              <article key={x.id} className={`vz-tapu-kart is-${x.id}`}>
                <h3 className="vz-h3">{x.baslik}</h3>
                <p>{x.metin}</p>
                {x.adimlar.length > 0 && (
                  <ol className="vz-yol-haritasi">
                    {x.adimlar.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ol>
                )}
                <p className="vz-kaynak">{x.kaynak}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-bant vz-bant--mat" aria-labelledby="vz-belge">
        <div className="vz-wrap vz-belge-in">
          <div className="vz-bant-bas">
            <h2 id="vz-belge" className="vz-h2">
              {t.belgeBaslik}
            </h2>
            <p className="vz-lead">{t.belgeLead}</p>
            <p>
              <Link href={`${tr.base}/#arac`} className="vz-btn vz-btn--kobalt">
                {t.cta}
              </Link>
            </p>
          </div>
          <div className="vz-belge" role="table" aria-label={t.belgeBaslik}>
            <p className="vz-belge-filigran" aria-hidden="true">
              {t.belgeOrnek}
            </p>
            <p className="vz-belge-baslik">
              {t.belgeAd} <span>({t.belgeOrnek})</span>
            </p>
            {t.belgeSatirlar.map((s, i) => (
              <div key={s.etiket} className={`vz-belge-satiri ${s.alan ? "is-hesap" : ""}`} role="row">
                <span className="vz-belge-no" aria-hidden="true">
                  {i + 1}
                </span>
                <span role="cell" className="vz-belge-etiket">
                  {s.etiket}
                </span>
                <span role="cell" className="vz-belge-deger">
                  {s.alan ? <mark>{s.deger}</mark> : s.deger}
                </span>
                <span role="cell" className="vz-belge-not">
                  {s.not}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit" aria-labelledby="vz-kim">
        <div className="vz-wrap vz-kim-in">
          <div>
            <h2 id="vz-kim" className="vz-h2">
              {t.kimBaslik}
            </h2>
            <dl className="vz-kim">
              {t.kim.map((k) => (
                <div key={k.kim} className={k.kim === "Vaziyet" ? "is-biz" : undefined}>
                  <dt>{k.kim}</dt>
                  <dd>{k.is}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="vz-h2">{t.duymazBaslik}</h2>
            <p className="vz-lead">{t.duymazLead}</p>
            <ul className="vz-duymaz">
              {t.duymaz.map((d) => (
                <li key={d.cumle}>
                  <p className="vz-duymaz-cumle">
                    <span aria-hidden="true">✕</span> {d.cumle}
                  </p>
                  <p>{d.neden}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="vz-bant vz-bant--kart" aria-labelledby="vz-kaynak">
        <div className="vz-wrap">
          <h2 id="vz-kaynak" className="vz-h3">
            {t.kaynakBaslik}
          </h2>
          <ul className="vz-kaynaklar">
            {t.kaynaklar.map((k) => (
              <li key={k.ad}>{k.href ? <a href={k.href} rel="noopener noreferrer" target="_blank">{k.ad}</a> : k.ad}</li>
            ))}
          </ul>
          <p className="vz-uyari">{t.uyari}</p>
        </div>
      </section>
    </>
  );
}
