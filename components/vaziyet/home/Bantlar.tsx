"use client";

import Link from "next/link";
import { MODELLER } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { hesapla, maliyet } from "@/lib/vaziyet/hesap";
import { aralik, tl } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { Resim } from "../ui/Resim";
import { WaButton, PhoneIcon } from "../shell/Wa";
import { Ornek } from "../shell/Shell";

/** "Sığması, ruhsat alacağı anlamına gelmez": three rule cards by what the title deed says. */
export function RuhsatBand() {
  const t = tr.ruhsatBand;
  const { durum } = useDurum();
  return (
    <section className="vz-bant vz-bant--kart vz-ruhsat" id="ruhsat" aria-labelledby="vz-ruhsat-h">
      <div className="vz-wrap">
        <div className="vz-bant-bas">
          <h2 id="vz-ruhsat-h" className="vz-h2">
            {t.baslik}
          </h2>
          <p className="vz-lead">{t.lead}</p>
        </div>
        <ul className="vz-kural-kartlari">
          {t.kartlar.map((k, i) => {
            const secili = (i === 0 && durum.nitelik === "arsa") || (i === 1 && durum.nitelik === "tarla");
            return (
              <li key={k.baslik} className={`vz-kural-karti is-${k.isaret} ${secili ? "is-secili" : ""}`}>
                <span className="vz-kural-karti-isaret" aria-hidden="true">
                  {k.isaret === "ok" ? "✓" : k.isaret === "no" ? "✕" : "i"}
                </span>
                <h3 className="vz-h3">{k.baslik}</h3>
                <p>{k.metin}</p>
              </li>
            );
          })}
        </ul>
        <p className="vz-bant-link">
          <Link href={`${tr.base}/ruhsat-ve-imar/`} className="vz-link">
            {t.link}
          </Link>
        </p>
      </div>
    </section>
  );
}

/** "Beş model, aynı ölçekte": the row of table models, then one card per model. */
export function ModellerBand() {
  const t = tr.modellerBand;
  const { durum } = useDurum();
  return (
    <section className="vz-bant vz-bant--mat vz-modeller-bant" id="modeller" aria-labelledby="vz-modeller-h">
      <div className="vz-wrap">
        <div className="vz-bant-bas">
          <h2 id="vz-modeller-h" className="vz-h2">
            {t.baslik}
          </h2>
          <p className="vz-lead">{t.lead}</p>
        </div>
      </div>
      <div className="vz-raf-gorsel" tabIndex={0} role="group" aria-label={t.gorselAlt}>
        <Resim ad="raf" alt={t.gorselAlt} sizes="(max-width: 899px) 1000px, 100vw" />
      </div>
      <div className="vz-wrap">
        <p className="vz-model-not">{t.arsaNot(durum.W, durum.D)}</p>
        <ul className="vz-model-kartlari">
          {MODELLER.map((m) => {
            const k = maliyet(m, durum.il);
            const s = hesapla({ ...durum, model: m.id, x: null, y: null });
            return (
              <li key={m.id} className="vz-model-karti">
                <h3 className="vz-model-karti-ad">
                  {m.ad} <span>{m.m2} m²</span>
                </h3>
                <p className="vz-model-karti-oda">
                  {m.oda}
                  {m.katSayisi === 2 ? `, ${tr.modeller.kat(2)}` : ""} · {m.w.toLocaleString("tr-TR")} × {m.d.toLocaleString("tr-TR")} m
                </p>
                <p className="vz-model-karti-fiyat">
                  {tl(m.fiyat)} <Ornek />
                </p>
                <p className="vz-model-karti-kurulu">
                  {tr.model.kurulu}: <span className="vz-nowrap">{aralik(k.toplam[0], k.toplam[1])}</span>
                </p>
                <p className={`vz-model-karti-sigar ${s.sigar ? "is-ok" : "is-no"}`}>
                  <span aria-hidden="true">{s.sigar ? "✓" : "✕"}</span>{" "}
                  {s.sigar ? t.sigar(s.bahce) : t.sigmaz}
                </p>
                <div className="vz-model-karti-act">
                  <Link href={`${tr.base}/?${kodla({ ...durum, model: m.id, x: null, y: null })}#arac`} className="vz-btn vz-btn--kobalt vz-btn--sm">
                    {t.koy}
                  </Link>
                  <Link href={`${tr.base}/modeller/${m.id}/`} className="vz-link-acik">
                    {t.plan}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="vz-bant-link">
          <Link href={`${tr.base}/modeller/`} className="vz-link-acik">
            {t.tumu}
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Production in one picture and three sentences. */
export function UretimBand() {
  const t = tr.uretimBand;
  return (
    <section className="vz-bant vz-bant--kagit vz-uretim-bant" aria-labelledby="vz-uretim-h">
      <div className="vz-wrap vz-uretim-bant-in">
        <figure className="vz-uretim-bant-gorsel">
          <Resim ad="tir" alt={t.gorselAlt} sizes="(max-width: 899px) 100vw, 55vw" />
        </figure>
        <div className="vz-uretim-bant-yazi">
          <h2 id="vz-uretim-h" className="vz-h2">
            {t.baslik}
          </h2>
          <ul className="vz-madde">
            {t.maddeler.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>
            <Link href={`${tr.base}/nasil-uretiyoruz/`} className="vz-btn vz-btn--cizgi-k">
              {t.link}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Closing call: phone, WhatsApp with the visitor's own plot, the quote summary. */
export function Kapanis() {
  const t = tr.kapanis;
  const { durum } = useDurum();
  const s = hesapla(durum);
  const mesaj = tr.wa.arsa(
    durum.W.toLocaleString("tr-TR"),
    durum.D.toLocaleString("tr-TR"),
    `${s.m.ad} ${s.m.m2}`,
    s.maliyet.il,
    tr.arac.nitelikAd[durum.nitelik].toLocaleLowerCase("tr"),
  );
  return (
    <section className="vz-bant vz-bant--derin vz-kapanis" aria-labelledby="vz-kapanis-h">
      <div className="vz-wrap vz-kapanis-in">
        <div>
          <h2 id="vz-kapanis-h" className="vz-h2">
            {t.baslik}
          </h2>
          <p className="vz-lead">{t.lead}</p>
          <p className="vz-kapanis-saat">
            {t.saat} <Ornek />
          </p>
        </div>
        <div className="vz-kapanis-act">
          <a href={tr.brand.phoneHref} className="vz-btn vz-btn--acik vz-btn--big">
            <PhoneIcon /> <span className="vz-tnum">{tr.brand.phone}</span>
          </a>
          <WaButton message={mesaj} className="vz-btn vz-btn--cizgi vz-btn--big" />
          <Link href={`${tr.base}/teklif/?${kodla(durum)}`} className="vz-btn vz-btn--kobalt vz-btn--big">
            {t.teklif}
          </Link>
        </div>
      </div>
    </section>
  );
}
